"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, Eye, FileSpreadsheet, FileUp, Loader2, RotateCcw, Save, TriangleAlert } from "lucide-react";
import { INVOICE_CURRENCIES, INVOICE_DECLARATIONS, INVOICE_TYPES } from "@/data/invoice";
import { amountInWords, formatMoney } from "@/lib/invoice/format";
import { readInvoiceSheet } from "@/lib/invoice/sheet";
import {
  SHIPMENT_FIELDS,
  emptyInvoice,
  invoiceTotal,
  todayIso,
  type InvoiceData,
  type InvoiceType,
  type Party,
  type ShipmentDetails,
} from "@/lib/invoice/types";
import ItemsGrid from "./ItemsGrid";

type Message = { kind: "error" | "success" | "info"; text: string } | null;
type Result = { invoiceNo: string; link: string; fileName: string; pdfUrl: string; replaced: boolean; storage: string };
type Busy = "" | "preview" | "generate" | "import" | "load";

function base64ToBlobUrl(base64: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
}

async function errorText(res: Response, fallback: string) {
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (res.status === 401) window.location.assign(`/invoices/login?next=${encodeURIComponent(window.location.pathname)}`);
  return body.error || fallback;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="invoice-input"
      />
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-[#2E75B6] px-5 py-2.5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function PartyFields({
  party,
  onChange,
  disabled,
}: {
  party: Party;
  onChange: (key: keyof Party, value: string) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled} className="space-y-3 disabled:opacity-50">
      <Field label="Company name" value={party.name} onChange={(value) => onChange("name", value)} />
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Address</span>
        <textarea
          rows={3}
          value={party.address}
          placeholder={"Attn: Name\nStreet\nCity, State ZIP, Country"}
          onChange={(event) => onChange("address", event.target.value)}
          className="invoice-input resize-y"
        />
      </label>
      <Field label="Email" type="email" value={party.email} onChange={(value) => onChange("email", value)} />
    </fieldset>
  );
}

export default function InvoiceEditor({ type, editNo, fromPi }: { type: InvoiceType; editNo?: string; fromPi?: string }) {
  const meta = INVOICE_TYPES[type];
  const [invoice, setInvoice] = useState<InvoiceData>(() => emptyInvoice(type));
  const [nextNo, setNextNo] = useState("");
  const [storage, setStorage] = useState("");
  const [busy, setBusy] = useState<Busy>(editNo || fromPi ? "load" : "");
  const [message, setMessage] = useState<Message>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    setInvoice((prev) => ({ ...prev, [key]: value }));
  const setParty = (which: "billTo" | "shipTo", key: keyof Party, value: string) =>
    setInvoice((prev) => ({ ...prev, [which]: { ...prev[which], [key]: value } }));
  const setShipment = (key: keyof ShipmentDetails, value: string) =>
    setInvoice((prev) => ({ ...prev, shipment: { ...prev.shipment, [key]: value } }));

  // Load an existing invoice to edit, or a PI to turn into a CI.
  useEffect(() => {
    const source = editNo ? { type, invoiceNo: editNo } : fromPi ? { type: "PI" as const, invoiceNo: fromPi } : null;
    if (!source) return;

    fetch(`/api/invoices/load?type=${source.type}&invoiceNo=${encodeURIComponent(source.invoiceNo)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await errorText(res, "Could not load the invoice."));
        const loaded = (await res.json()).invoice as InvoiceData;
        if (fromPi && !editNo) {
          setInvoice({
            ...loaded,
            type: "CI",
            invoiceNo: "",
            invoiceDate: todayIso(),
            piReference: fromPi,
            declaration: INVOICE_DECLARATIONS.CI,
          });
          setMessage({ kind: "info", text: `Copied from ${fromPi}. Add the shipment details, then generate the CI.` });
        } else {
          setInvoice(loaded);
          setMessage({ kind: "info", text: `Editing ${editNo}. Generating again replaces the saved PDF.` });
        }
      })
      .catch((error: Error) => setMessage({ kind: "error", text: error.message }))
      .finally(() => setBusy(""));
  }, [type, editNo, fromPi]);

  const refreshNextNo = useCallback(() => {
    fetch(`/api/invoices/next-number?type=${type}&date=${invoice.invoiceDate}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await errorText(res, "Could not read the invoice counter."));
        const body = await res.json();
        setNextNo(body.invoiceNo);
        setStorage(body.storage);
      })
      .catch((error: Error) => setMessage({ kind: "error", text: error.message }));
  }, [type, invoice.invoiceDate]);

  useEffect(() => {
    const timer = setTimeout(refreshNextNo, 300);
    return () => clearTimeout(timer);
  }, [refreshNextNo]);

  async function importFile(file: File) {
    setBusy("import");
    setMessage(null);
    try {
      const { fields, items, fieldCount } = await readInvoiceSheet(file);
      if (!fieldCount && !items.length) {
        throw new Error("No invoice fields or line items were found. Use the template's Details and Items sheets.");
      }
      setInvoice((prev) => ({
        ...prev,
        ...fields,
        type: prev.type,
        billTo: { ...prev.billTo, ...fields.billTo },
        shipTo: { ...prev.shipTo, ...fields.shipTo },
        shipment: { ...prev.shipment, ...fields.shipment },
        items: items.length ? items : prev.items,
      }));
      setMessage({
        kind: "success",
        text: `Imported ${fieldCount} field${fieldCount === 1 ? "" : "s"} and ${items.length} line item${
          items.length === 1 ? "" : "s"
        } from ${file.name}. Check the form, then preview or generate.`,
      });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Could not read the file." });
    } finally {
      setBusy("");
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function preview() {
    setBusy("preview");
    setMessage(null);
    try {
      const res = await fetch("/api/invoices/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice: { ...invoice, invoiceNo: invoice.invoiceNo || nextNo } }),
      });
      if (!res.ok) throw new Error(await errorText(res, "Preview failed."));
      setPreviewUrl(URL.createObjectURL(await res.blob()));
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Preview failed." });
    } finally {
      setBusy("");
    }
  }

  async function generate(overwrite = false): Promise<void> {
    setBusy("generate");
    setMessage(null);
    try {
      const res = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice, overwrite }),
      });
      if (res.status === 409) {
        const body = await res.json();
        setBusy("");
        if (window.confirm(`${body.error}\n\nReplace the saved ${invoice.invoiceNo}?`)) return generate(true);
        return;
      }
      if (!res.ok) throw new Error(await errorText(res, "Could not generate the invoice."));

      const body = await res.json();
      const pdfUrl = base64ToBlobUrl(body.pdfBase64);
      setResult({ ...body, pdfUrl });
      setPreviewUrl(pdfUrl);
      setInvoice((prev) => ({ ...prev, invoiceNo: body.invoiceNo }));
      setMessage({
        kind: "success",
        text: `${body.invoiceNo} ${body.replaced ? "replaced" : "saved"} to ${
          body.storage === "drive" ? "Google Drive" : "local storage"
        }.`,
      });
      refreshNextNo();
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Could not generate the invoice." });
    } finally {
      setBusy("");
    }
  }

  function reset() {
    setInvoice(emptyInvoice(type));
    setResult(null);
    setPreviewUrl("");
    setMessage(null);
    window.history.replaceState(null, "", window.location.pathname);
  }

  const total = invoiceTotal(invoice.items);
  const isCI = type === "CI";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h1 className="text-2xl font-bold text-[#1F3864]">{meta.label}</h1>
            <p className="text-sm text-slate-500">
              Fill the form, import an Excel sheet, or paste rows from Excel into the line items.
            </p>
          </div>
          {storage && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                storage === "drive" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {storage === "drive" ? `Saves to Drive › ${meta.folder}` : "Drive not configured · saving locally"}
            </span>
          )}
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files[0];
            if (file) importFile(file);
          }}
          className={`flex flex-wrap items-center gap-3 rounded-2xl border-2 border-dashed p-4 transition ${
            dragging ? "border-[#2E75B6] bg-[#EBF3FB]" : "border-slate-300 bg-white"
          }`}
        >
          <FileSpreadsheet className="h-8 w-8 text-[#2E75B6]" />
          <div className="mr-auto text-sm">
            <p className="font-semibold">Import from Excel</p>
            <p className="text-slate-500">Drop an .xlsx or .csv here. Details and line items fill the form below.</p>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) importFile(file);
            }}
          />
          <button type="button" onClick={() => fileInput.current?.click()} className="invoice-btn-secondary" disabled={!!busy}>
            {busy === "import" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            Choose file
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/api/invoices/template")}
            className="invoice-btn-secondary"
          >
            <Download className="h-4 w-4" /> Template
          </button>
        </div>

        {busy === "load" && (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading invoice…
          </p>
        )}

        <Section title="Invoice details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Invoice No."
              value={invoice.invoiceNo}
              onChange={(value) => set("invoiceNo", value)}
              placeholder={nextNo ? `Auto: ${nextNo}` : "Auto"}
              hint="Leave blank to use the next number."
            />
            <Field label="Invoice Date" type="date" value={invoice.invoiceDate} onChange={(value) => set("invoiceDate", value)} />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Currency</span>
              <select value={invoice.currency} onChange={(event) => set("currency", event.target.value)} className="invoice-input">
                {INVOICE_CURRENCIES.map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </label>
            {isCI && (
              <Field
                label="PI Reference"
                value={invoice.piReference}
                onChange={(value) => set("piReference", value)}
                placeholder="PI-07-1734"
              />
            )}
            <Field label="PO" value={invoice.po} onChange={(value) => set("po", value)} placeholder="16936 dated 16-Jul-26" />
            <Field label="Payment Terms" value={invoice.paymentTerms} onChange={(value) => set("paymentTerms", value)} />
            <Field label="IEC No." value={invoice.iecNo} onChange={(value) => set("iecNo", value)} />
            <Field label="LUT Ref" value={invoice.lutRef} onChange={(value) => set("lutRef", value)} />
            <Field label="Country of Origin" value={invoice.countryOfOrigin} onChange={(value) => set("countryOfOrigin", value)} />
            <Field
              label="Country of Destination"
              value={invoice.countryOfDestination}
              onChange={(value) => set("countryOfDestination", value)}
            />
          </div>
        </Section>

        <div className="grid gap-5 md:grid-cols-2">
          <Section title="Bill to">
            <PartyFields party={invoice.billTo} onChange={(key, value) => setParty("billTo", key, value)} />
          </Section>
          <Section
            title="Ship to"
            action={
              <label className="flex items-center gap-2 text-xs font-medium text-white">
                <input
                  type="checkbox"
                  checked={invoice.shipToSameAsBillTo}
                  onChange={(event) => set("shipToSameAsBillTo", event.target.checked)}
                />
                Same as Bill To
              </label>
            }
          >
            <PartyFields
              party={invoice.shipToSameAsBillTo ? invoice.billTo : invoice.shipTo}
              onChange={(key, value) => setParty("shipTo", key, value)}
              disabled={invoice.shipToSameAsBillTo}
            />
          </Section>
        </div>

        {isCI && (
          <Section title="Shipment details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SHIPMENT_FIELDS.map((field) => (
                <Field
                  key={field.key}
                  label={field.label}
                  value={invoice.shipment[field.key]}
                  onChange={(value) => setShipment(field.key, value)}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">Empty rows are left off the PDF. Incoterms prints in the top grid.</p>
          </Section>
        )}

        <Section title="Line items">
          <ItemsGrid items={invoice.items} currency={invoice.currency} onChange={(items) => set("items", items)} />
          <div className="mt-4 rounded-lg bg-[#D6E4F7] px-4 py-3 text-sm">
            <div className="flex items-center justify-between font-bold">
              <span>GRAND TOTAL</span>
              <span className="tabular-nums">
                {invoice.currency} {formatMoney(total)}
              </span>
            </div>
            <p className="mt-1 italic text-slate-600">Amount in Words: {amountInWords(total, invoice.currency)}</p>
          </div>
        </Section>

        <Section title="Declaration">
          <textarea
            rows={3}
            value={invoice.declaration}
            onChange={(event) => set("declaration", event.target.value)}
            className="invoice-input resize-y"
          />
        </Section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={preview} disabled={!!busy} className="invoice-btn-secondary">
              {busy === "preview" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Preview
            </button>
            <button type="button" onClick={() => generate()} disabled={!!busy} className="invoice-btn-primary">
              {busy === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Generate &amp; save
            </button>
          </div>
          <button type="button" onClick={reset} className="mt-2 flex w-full items-center justify-center gap-1.5 py-1 text-xs text-slate-500 hover:text-slate-800">
            <RotateCcw className="h-3.5 w-3.5" /> Start a new {meta.label.toLowerCase()}
          </button>

          {message && (
            <p
              className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                message.kind === "error"
                  ? "bg-red-50 text-red-700"
                  : message.kind === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-sky-50 text-sky-800"
              }`}
            >
              {message.kind === "error" ? (
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              {message.text}
            </p>
          )}

          {result && (
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={result.pdfUrl} download={result.fileName} className="invoice-btn-primary flex-1">
                <Download className="h-4 w-4" /> Download PDF
              </a>
              <a href={result.link} target="_blank" rel="noreferrer" className="invoice-btn-secondary flex-1">
                {result.storage === "drive" ? "Open in Drive" : "Open saved file"}
              </a>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {previewUrl ? (
            <iframe src={`${previewUrl}#view=FitH`} title="Invoice preview" className="h-[680px] w-full" />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-slate-400">
              <Eye className="h-8 w-8" />
              Click Preview to see the PDF before saving.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
