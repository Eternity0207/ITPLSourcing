import { promises as fs } from "fs";
import path from "path";
import { INVOICE_TYPES } from "@/data/invoice";
import { DRIVE_FOLDER_MIME_TYPE, connectDrive, driveQueryValue, type DriveConnection } from "@/lib/drive";
import { normalizeInvoice, type InvoiceData, type InvoiceType } from "./types";

// Invoices live in Google Drive under INVOICE_DRIVE_FOLDER_ID (or the RFQ
// folder): one subfolder per invoice type for the PDFs, an "Invoice Data"
// folder with the JSON each PDF was made from (so it can be reopened and
// edited), and invoice-counter.json with the last number used per type.
// Without Drive credentials (local development) the same layout is written to
// ./data/invoices instead.

const COUNTER_FILE = "invoice-counter.json";
const DATA_FOLDER = "Invoice Data";
const APP_TAG = "itplInvoice";

export type StoredInvoice = {
  type: InvoiceType;
  invoiceNo: string;
  fileName: string;
  customer: string;
  createdTime: string;
  link: string;
};

export type SavedInvoice = { link: string; replaced: boolean; storage: "drive" | "local" };

type Counters = Record<InvoiceType, number>;

/** The running number at the end of an invoice number: "PI-07-1734" -> 1734. */
export function invoiceSequence(invoiceNo: string) {
  const match = /(\d+)\s*$/.exec(invoiceNo);
  return match ? Number(match[1]) : null;
}

export function formatInvoiceNo(type: InvoiceType, invoiceDate: string, sequence: number) {
  const month = /^\d{4}-(\d{2})/.exec(invoiceDate)?.[1] ?? String(new Date().getMonth() + 1).padStart(2, "0");
  return `${type}-${month}-${String(sequence).padStart(4, "0")}`;
}

function counterStart(type: InvoiceType) {
  const start = Number(process.env[`INVOICE_${type}_START`]);
  return Number.isInteger(start) && start > 0 ? start : 1;
}

function sanitizeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|\r\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

function pdfFileName(invoiceNo: string, customer: string) {
  const name = sanitizeFileName(customer).replace(/[.\s]+$/, "");
  return `${sanitizeFileName(invoiceNo)}${name ? ` - ${name}` : ""}.pdf`;
}

interface Backend {
  storage: "drive" | "local";
  readCounters(): Promise<Partial<Counters>>;
  writeCounters(counters: Partial<Counters>): Promise<void>;
  list(type: InvoiceType, limit: number): Promise<StoredInvoice[]>;
  find(type: InvoiceType, invoiceNo: string): Promise<StoredInvoice | null>;
  save(type: InvoiceType, invoiceNo: string, fileName: string, customer: string, pdf: Uint8Array, data: InvoiceData): Promise<SavedInvoice>;
  loadData(type: InvoiceType, invoiceNo: string): Promise<InvoiceData | null>;
  readPdf(type: InvoiceType, invoiceNo: string): Promise<{ fileName: string; content: Buffer } | null>;
}

// ---------------------------------------------------------------- Google Drive

class DriveBackend implements Backend {
  storage = "drive" as const;
  private folders = new Map<string, string>();

  constructor(private drive: DriveConnection) {}

  private async folder(name: string, configuredId?: string) {
    if (configuredId) return configuredId;
    const cached = this.folders.get(name);
    if (cached) return cached;

    const root = this.drive.rootFolderId;
    const [existing] = await this.drive.list(
      `name = '${driveQueryValue(name)}' and mimeType = '${DRIVE_FOLDER_MIME_TYPE}' and '${root}' in parents and trashed = false`,
      1,
    );
    const id = existing?.id ?? (await this.drive.createFolder(name, root)).id;
    this.folders.set(name, id);
    return id;
  }

  private typeFolder(type: InvoiceType) {
    return this.folder(INVOICE_TYPES[type].folder, process.env[`INVOICE_${type}_FOLDER_ID`]);
  }

  private async tagged(type: InvoiceType, kind: "pdf" | "data", invoiceNo?: string, pageSize = 100) {
    const parent = kind === "pdf" ? await this.typeFolder(type) : await this.folder(DATA_FOLDER);
    const clauses = [
      `'${parent}' in parents`,
      "trashed = false",
      `appProperties has { key='${APP_TAG}' and value='${kind}' }`,
      `appProperties has { key='invoiceType' and value='${type}' }`,
    ];
    if (invoiceNo) clauses.push(`appProperties has { key='invoiceNo' and value='${driveQueryValue(invoiceNo)}' }`);
    return { parent, files: await this.drive.list(clauses.join(" and "), pageSize) };
  }

  private async counterFile() {
    const [file] = await this.drive.list(
      `name = '${COUNTER_FILE}' and '${this.drive.rootFolderId}' in parents and trashed = false`,
      1,
    );
    return file ?? null;
  }

  async readCounters() {
    const file = await this.counterFile();
    if (!file) return {};
    try {
      return JSON.parse((await this.drive.download(file.id)).toString("utf8")) as Partial<Counters>;
    } catch {
      return {};
    }
  }

  async writeCounters(counters: Partial<Counters>) {
    const file = {
      filename: COUNTER_FILE,
      content: Buffer.from(JSON.stringify(counters, null, 2)),
      contentType: "application/json",
    };
    const existing = await this.counterFile();
    if (existing) await this.drive.update(existing.id, file);
    else await this.drive.upload(file, this.drive.rootFolderId);
  }

  async list(type: InvoiceType, limit: number) {
    const { files } = await this.tagged(type, "pdf", undefined, limit);
    return files.map((file) => ({
      type,
      invoiceNo: file.appProperties?.invoiceNo ?? file.name,
      fileName: file.name,
      customer: file.appProperties?.customer ?? "",
      createdTime: file.createdTime ?? "",
      link: file.webViewLink ?? "",
    }));
  }

  async find(type: InvoiceType, invoiceNo: string) {
    const { files } = await this.tagged(type, "pdf", invoiceNo, 1);
    const file = files[0];
    if (!file) return null;
    return {
      type,
      invoiceNo,
      fileName: file.name,
      customer: file.appProperties?.customer ?? "",
      createdTime: file.createdTime ?? "",
      link: file.webViewLink ?? "",
    };
  }

  async save(type: InvoiceType, invoiceNo: string, fileName: string, customer: string, pdf: Uint8Array, data: InvoiceData) {
    const tags = { [APP_TAG]: "pdf", invoiceType: type, invoiceNo, customer: customer.slice(0, 60) };
    const pdfFile = { filename: fileName, content: pdf, contentType: "application/pdf", appProperties: tags };
    const dataFile = {
      filename: `${sanitizeFileName(invoiceNo)}.json`,
      content: Buffer.from(JSON.stringify(data, null, 2)),
      contentType: "application/json",
      appProperties: { ...tags, [APP_TAG]: "data" },
    };

    const [{ parent: pdfFolder, files: pdfs }, { parent: dataFolder, files: datas }] = await Promise.all([
      this.tagged(type, "pdf", invoiceNo, 1),
      this.tagged(type, "data", invoiceNo, 1),
    ]);

    const saved = pdfs[0] ? await this.drive.update(pdfs[0].id, pdfFile) : await this.drive.upload(pdfFile, pdfFolder);
    if (datas[0]) await this.drive.update(datas[0].id, dataFile);
    else await this.drive.upload(dataFile, dataFolder);

    return { link: saved.webViewLink, replaced: Boolean(pdfs[0]), storage: this.storage };
  }

  async loadData(type: InvoiceType, invoiceNo: string) {
    const { files } = await this.tagged(type, "data", invoiceNo, 1);
    if (!files[0]) return null;
    const raw = JSON.parse((await this.drive.download(files[0].id)).toString("utf8"));
    return normalizeInvoice({ ...raw, type });
  }

  async readPdf(type: InvoiceType, invoiceNo: string) {
    const { files } = await this.tagged(type, "pdf", invoiceNo, 1);
    if (!files[0]) return null;
    return { fileName: files[0].name, content: await this.drive.download(files[0].id) };
  }
}

// ------------------------------------------------------------------ Local disk

type LocalIndexEntry = { invoiceNo: string; fileName: string; customer: string; createdTime: string };

class LocalBackend implements Backend {
  storage = "local" as const;
  private root = path.join(process.cwd(), "data", "invoices");

  private dir(...parts: string[]) {
    return path.join(this.root, ...parts);
  }

  private async readJson<T>(file: string, fallback: T): Promise<T> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as T;
    } catch {
      return fallback;
    }
  }

  private async writeJson(file: string, value: unknown) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(value, null, 2));
  }

  private indexFile(type: InvoiceType) {
    return this.dir(INVOICE_TYPES[type].folder, "index.json");
  }

  readCounters() {
    return this.readJson<Partial<Counters>>(this.dir(COUNTER_FILE), {});
  }

  writeCounters(counters: Partial<Counters>) {
    return this.writeJson(this.dir(COUNTER_FILE), counters);
  }

  async list(type: InvoiceType, limit: number) {
    const index = await this.readJson<LocalIndexEntry[]>(this.indexFile(type), []);
    return index
      .slice()
      .sort((a, b) => b.createdTime.localeCompare(a.createdTime))
      .slice(0, limit)
      .map((entry) => ({ ...entry, type, link: this.link(type, entry.invoiceNo) }));
  }

  private link(type: InvoiceType, invoiceNo: string) {
    return `/api/invoices/file?type=${type}&invoiceNo=${encodeURIComponent(invoiceNo)}`;
  }

  async find(type: InvoiceType, invoiceNo: string) {
    const index = await this.readJson<LocalIndexEntry[]>(this.indexFile(type), []);
    const entry = index.find((item) => item.invoiceNo === invoiceNo);
    return entry ? { ...entry, type, link: this.link(type, invoiceNo) } : null;
  }

  async save(type: InvoiceType, invoiceNo: string, fileName: string, customer: string, pdf: Uint8Array, data: InvoiceData) {
    const folder = this.dir(INVOICE_TYPES[type].folder);
    await fs.mkdir(folder, { recursive: true });

    const index = await this.readJson<LocalIndexEntry[]>(this.indexFile(type), []);
    const existing = index.find((item) => item.invoiceNo === invoiceNo);
    if (existing && existing.fileName !== fileName) await fs.rm(path.join(folder, existing.fileName), { force: true });

    await fs.writeFile(path.join(folder, fileName), pdf);
    await this.writeJson(this.dir(DATA_FOLDER, `${type}-${sanitizeFileName(invoiceNo)}.json`), data);

    const entry = { invoiceNo, fileName, customer, createdTime: existing?.createdTime ?? new Date().toISOString() };
    await this.writeJson(this.indexFile(type), [...index.filter((item) => item.invoiceNo !== invoiceNo), entry]);
    return { link: this.link(type, invoiceNo), replaced: Boolean(existing), storage: this.storage };
  }

  async loadData(type: InvoiceType, invoiceNo: string) {
    const raw = await this.readJson<Partial<InvoiceData> | null>(
      this.dir(DATA_FOLDER, `${type}-${sanitizeFileName(invoiceNo)}.json`),
      null,
    );
    return raw ? normalizeInvoice({ ...raw, type }) : null;
  }

  async readPdf(type: InvoiceType, invoiceNo: string) {
    const entry = await this.find(type, invoiceNo);
    if (!entry) return null;
    const content = await fs.readFile(this.dir(INVOICE_TYPES[type].folder, entry.fileName));
    return { fileName: entry.fileName, content };
  }
}

// --------------------------------------------------------------------- Public

export class InvoiceStorageError extends Error {}

async function backend(): Promise<Backend> {
  const drive = await connectDrive(process.env.INVOICE_DRIVE_FOLDER_ID || process.env.GOOGLE_DRIVE_FOLDER_ID);
  if (drive) return new DriveBackend(drive);
  // Vercel's filesystem is read-only and wiped between requests, so never fall back there.
  if (process.env.VERCEL || (process.env.NODE_ENV === "production" && process.env.INVOICE_LOCAL_STORAGE !== "1")) {
    throw new InvoiceStorageError(
      "Google Drive is not configured. Set the Google credentials and INVOICE_DRIVE_FOLDER_ID (or GOOGLE_DRIVE_FOLDER_ID).",
    );
  }
  return new LocalBackend();
}

async function lastUsed(store: Backend, type: InvoiceType) {
  const [counters, recent] = await Promise.all([store.readCounters(), store.list(type, 200)]);
  // Also look at the saved files, so a lost or stale counter can never hand out a used number.
  const fromFiles = Math.max(0, ...recent.map((item) => invoiceSequence(item.invoiceNo) ?? 0));
  return { counters, last: Math.max(counters[type] ?? counterStart(type) - 1, fromFiles) };
}

export async function storageMode() {
  return (await backend()).storage;
}

/** The number the next invoice of this type would get, without reserving it. */
export async function peekNextInvoiceNo(type: InvoiceType, invoiceDate: string) {
  const store = await backend();
  const { last } = await lastUsed(store, type);
  return formatInvoiceNo(type, invoiceDate, last + 1);
}

/**
 * Saves the PDF and its data, assigning the next number when `data.invoiceNo`
 * is empty. A number that already exists is overwritten (re-issuing a
 * corrected invoice); the counter only ever moves forward.
 */
export async function saveInvoice(
  data: InvoiceData,
  render: (invoiceNo: string) => Promise<Uint8Array>,
) {
  const store = await backend();
  const { counters, last } = await lastUsed(store, data.type);

  const invoiceNo = data.invoiceNo.trim() || formatInvoiceNo(data.type, data.invoiceDate, last + 1);
  const sequence = invoiceSequence(invoiceNo);
  const finalData = { ...data, invoiceNo };
  const pdf = await render(invoiceNo);
  const customer = data.billTo.name.trim();
  const saved = await store.save(data.type, invoiceNo, pdfFileName(invoiceNo, customer), customer, pdf, finalData);

  if (sequence !== null && sequence > (counters[data.type] ?? 0)) {
    await store.writeCounters({ ...counters, [data.type]: Math.max(sequence, last) });
  }

  return { ...saved, invoiceNo, pdf, fileName: pdfFileName(invoiceNo, customer) };
}

export async function listInvoices(type: InvoiceType, limit = 50) {
  return (await backend()).list(type, limit);
}

export async function loadInvoice(type: InvoiceType, invoiceNo: string) {
  return (await backend()).loadData(type, invoiceNo);
}

export async function readInvoicePdf(type: InvoiceType, invoiceNo: string) {
  return (await backend()).readPdf(type, invoiceNo);
}

export async function invoiceExists(type: InvoiceType, invoiceNo: string) {
  return Boolean(await (await backend()).find(type, invoiceNo));
}
