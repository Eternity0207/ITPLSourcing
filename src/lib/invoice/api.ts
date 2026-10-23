import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import { InvoiceStorageError } from "./store";
import { filledItems, normalizeInvoice, type InvoiceData, type InvoiceType } from "./types";

export function unauthorized(request: NextRequest) {
  if (verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return null;
  return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
}

export function parseType(value: unknown): InvoiceType | null {
  return value === "PI" || value === "CI" ? value : null;
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export function serverError(error: unknown, context: string) {
  console.error(`${context}:`, error);
  const message =
    error instanceof InvoiceStorageError
      ? error.message
      : `${context}. ${error instanceof Error ? error.message : ""}`.trim();
  return NextResponse.json({ error: message }, { status: error instanceof InvoiceStorageError ? 503 : 500 });
}

/** Reads and checks an invoice from a JSON request body; returns an error message when invalid. */
export async function readInvoiceBody(request: NextRequest): Promise<{ data: InvoiceData; body: Record<string, unknown> } | string> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return "The request was not valid JSON.";
  }

  const raw = body.invoice as Partial<InvoiceData> | undefined;
  const type = parseType(raw?.type);
  if (!raw || !type) return "Choose a proforma (PI) or commercial (CI) invoice.";

  const data = normalizeInvoice({ ...raw, type });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.invoiceDate)) return "Enter a valid invoice date.";
  if (!data.billTo.name.trim()) return "Enter the Bill To company name.";
  if (!data.shipToSameAsBillTo && !data.shipTo.name.trim()) return "Enter the Ship To company name.";

  // Accept "1,059.50" or "$230" as typed or pasted from Excel.
  const number = (value: string) => value.replace(/[,\s]/g, "").replace(/^[^\d.-]+/, "");
  const items = filledItems(data.items).map((item) => ({ ...item, qty: number(item.qty), rate: number(item.rate) }));
  if (!items.length) return "Add at least one line item.";
  const missing = items.findIndex((item) => !item.description.trim());
  if (missing >= 0) return `Line ${missing + 1} has no description.`;
  const invalid = items.findIndex((item) => !Number.isFinite(Number(item.qty)) || !Number.isFinite(Number(item.rate)));
  if (invalid >= 0) return `Line ${invalid + 1}: quantity and rate must be numbers.`;
  if (items.length > 300) return "An invoice can have at most 300 lines.";

  return { data: { ...data, items }, body };
}
