import readXlsxFile from "read-excel-file/browser";
import { SHIPMENT_FIELDS, emptyItem, type InvoiceData, type LineItem, type ShipmentDetails } from "./types";

// Reads invoice input from an .xlsx or .csv file. Field/value rows (in any
// sheet) fill the invoice details, and a header row containing "Description"
// starts the line items. That covers the downloadable template (Details +
// Items sheets) as well as a single sheet with both, or a plain item list.

type Cell = string | number | boolean | Date | null | undefined;
type Row = Cell[];

const normalize = (value: Cell) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

type FieldSetter = (invoice: Partial<InvoiceData>, value: string) => void;

function setTop<K extends keyof InvoiceData>(key: K): FieldSetter {
  return (invoice, value) => {
    (invoice as Record<string, unknown>)[key] = value;
  };
}

function setParty(party: "billTo" | "shipTo", key: "name" | "address" | "email"): FieldSetter {
  return (invoice, value) => {
    invoice[party] = { name: "", address: "", email: "", ...invoice[party], [key]: value };
  };
}

function setShipment(key: keyof ShipmentDetails): FieldSetter {
  return (invoice, value) => {
    invoice.shipment = { ...(invoice.shipment as ShipmentDetails), [key]: value };
  };
}

const FIELD_ALIASES: [string[], FieldSetter][] = [
  [["invoiceno", "invoicenumber", "invoice"], setTop("invoiceNo")],
  [["invoicedate", "date"], (invoice, value) => (invoice.invoiceDate = toIsoDate(value))],
  [["po", "pono", "ponumber", "purchaseorder", "poref", "poreference"], setTop("po")],
  [["pireference", "piref", "pino", "proformainvoice", "proformainvoiceno"], setTop("piReference")],
  [["paymentterms", "terms"], setTop("paymentTerms")],
  [["iecno", "iec", "ieccode"], setTop("iecNo")],
  [["lutref", "lut", "lutno", "lutreference"], setTop("lutRef")],
  [["countryoforigin", "origin"], setTop("countryOfOrigin")],
  [["countryofdestination", "destinationcountry", "destination"], setTop("countryOfDestination")],
  [["currency"], (invoice, value) => (invoice.currency = value.toUpperCase())],
  [["billtoname", "billto", "billtocompany", "buyer", "buyername", "customer"], setParty("billTo", "name")],
  [["billtoaddress"], setParty("billTo", "address")],
  [["billtoemail"], setParty("billTo", "email")],
  [["shiptoname", "shipto", "shiptocompany", "consignee"], setParty("shipTo", "name")],
  [["shiptoaddress", "consigneeaddress"], setParty("shipTo", "address")],
  [["shiptoemail", "consigneeemail"], setParty("shipTo", "email")],
  [["declaration"], setTop("declaration")],
  ...SHIPMENT_FIELDS.map(
    (field) => [[normalize(field.label), normalize(field.key)], setShipment(field.key)] as [string[], FieldSetter],
  ),
  [["awbno", "blno", "awb", "billoflading"], setShipment("awbBlNo")],
  [["packages", "noofpkgs", "numberofpackages"], setShipment("packages")],
];

const FIELD_MAP = new Map<string, FieldSetter>(
  FIELD_ALIASES.flatMap(([aliases, setter]) => aliases.map((alias) => [alias, setter] as const)),
);

function itemColumn(header: Cell): keyof LineItem | null {
  const key = normalize(header);
  if (["description", "descriptionofgoods", "item", "product", "goods", "particulars"].includes(key)) return "description";
  if (["details", "specification", "specifications", "specs", "spec"].includes(key)) return "details";
  if (key.startsWith("hsn")) return "hsn";
  if (key === "qty" || key.startsWith("quantity")) return "qty";
  if (key.startsWith("rate") || key.startsWith("unitprice") || key === "price") return "rate";
  return null;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Accepts YYYY-MM-DD, DD-Mon-YY(YY), DD/MM/YYYY and Excel dates. */
export function toIsoDate(value: Cell): string {
  if (value instanceof Date) {
    return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}-${String(value.getUTCDate()).padStart(2, "0")}`;
  }
  const text = String(value ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const named = /^(\d{1,2})[-\s/]([a-z]{3})[a-z]*[-\s/,]+(\d{2,4})$/i.exec(text);
  if (named) {
    const month = MONTHS.indexOf(named[2].toLowerCase()) + 1;
    const year = named[3].length === 2 ? `20${named[3]}` : named[3];
    if (month) return `${year}-${String(month).padStart(2, "0")}-${named[1].padStart(2, "0")}`;
  }

  const numeric = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/.exec(text);
  if (numeric) {
    const year = numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3];
    return `${year}-${numeric[2].padStart(2, "0")}-${numeric[1].padStart(2, "0")}`;
  }
  return text;
}

function cellText(value: Cell) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return toIsoDate(value);
  return String(value).trim();
}

/** Minimal RFC 4180 CSV parser (quoted fields, escaped quotes, newlines in quotes). */
export function parseCsv(text: string): Row[] {
  const rows: Row[] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export type SheetImport = {
  fields: Partial<InvoiceData>;
  items: LineItem[];
  fieldCount: number;
};

/** Pulls invoice fields and line items out of spreadsheet rows. */
export function rowsToInvoice(sheets: Row[][]): SheetImport {
  const fields: Partial<InvoiceData> = {};
  const items: LineItem[] = [];
  let fieldCount = 0;

  for (const rows of sheets) {
    let columns: (keyof LineItem | null)[] | null = null;

    for (const row of rows) {
      const cells = row.map(cellText);
      if (cells.every((cell) => !cell)) continue;

      const headerColumns = cells.map((cell) => itemColumn(cell));
      if (headerColumns.includes("description") && headerColumns.filter(Boolean).length >= 2) {
        columns = headerColumns;
        continue;
      }

      if (columns) {
        const item = emptyItem();
        columns.forEach((column, index) => {
          if (column) item[column] = cells[index] ?? "";
        });
        if (item.description || item.qty || item.rate) items.push(item);
        continue;
      }

      // Field rows: label in the first non-empty cell, value in the next one.
      const first = cells.findIndex(Boolean);
      const setter = FIELD_MAP.get(normalize(cells[first]));
      const raw = row[first + 1];
      const value = raw instanceof Date ? toIsoDate(raw) : cellText(raw);
      if (setter && value) {
        setter(fields, value);
        fieldCount++;
      }
    }
  }

  const ship = fields.shipTo;
  if (ship && (ship.name || ship.address || ship.email)) fields.shipToSameAsBillTo = false;
  return { fields, items, fieldCount };
}

export async function readInvoiceSheet(file: File): Promise<SheetImport> {
  if (/\.csv$/i.test(file.name) || file.type === "text/csv") {
    return rowsToInvoice([parseCsv(await file.text())]);
  }
  if (!/\.xlsx$/i.test(file.name)) {
    throw new Error("Upload an .xlsx or .csv file. Older .xls files need to be saved as .xlsx first.");
  }
  const sheets = await readXlsxFile(file);
  return rowsToInvoice(sheets.map((sheet) => sheet.data as Row[]));
}
