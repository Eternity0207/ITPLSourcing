import { INVOICE_COMPANY, INVOICE_DECLARATIONS } from "@/data/invoice";

export type InvoiceType = "PI" | "CI";

export type Party = {
  name: string;
  // Attention line, street, city etc., one per line.
  address: string;
  email: string;
};

export type LineItem = {
  description: string;
  // Printed in small type after the description, e.g. "Helio G99 / 8GB RAM".
  details: string;
  hsn: string;
  qty: string;
  rate: string;
};

export type ShipmentDetails = {
  preCarriageBy: string;
  placeOfReceipt: string;
  vesselFlightNo: string;
  portOfLoading: string;
  portOfDischarge: string;
  finalDestination: string;
  incoterms: string;
  awbBlNo: string;
  packages: string;
  netWeight: string;
  grossWeight: string;
  dimensions: string;
};

export type InvoiceData = {
  type: InvoiceType;
  // Empty means "assign the next number from the counter".
  invoiceNo: string;
  // YYYY-MM-DD
  invoiceDate: string;
  po: string;
  piReference: string;
  paymentTerms: string;
  iecNo: string;
  lutRef: string;
  countryOfOrigin: string;
  countryOfDestination: string;
  currency: string;
  billTo: Party;
  shipTo: Party;
  shipToSameAsBillTo: boolean;
  shipment: ShipmentDetails;
  items: LineItem[];
  declaration: string;
};

export const SHIPMENT_FIELDS: { key: keyof ShipmentDetails; label: string }[] = [
  { key: "preCarriageBy", label: "Pre-Carriage By" },
  { key: "placeOfReceipt", label: "Place of Receipt" },
  { key: "vesselFlightNo", label: "Vessel / Flight No." },
  { key: "portOfLoading", label: "Port of Loading" },
  { key: "portOfDischarge", label: "Port of Discharge" },
  { key: "finalDestination", label: "Final Destination" },
  { key: "incoterms", label: "Incoterms" },
  { key: "awbBlNo", label: "AWB / BL No." },
  { key: "packages", label: "No. of Packages" },
  { key: "netWeight", label: "Net Weight" },
  { key: "grossWeight", label: "Gross Weight" },
  { key: "dimensions", label: "Dimensions" },
];

export function emptyParty(): Party {
  return { name: "", address: "", email: "" };
}

export function emptyItem(): LineItem {
  return { description: "", details: "", hsn: "", qty: "", rate: "" };
}

export function todayIso() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function emptyInvoice(type: InvoiceType): InvoiceData {
  return {
    type,
    invoiceNo: "",
    invoiceDate: todayIso(),
    po: "",
    piReference: "",
    paymentTerms: type === "PI" ? "100% Advance" : "",
    iecNo: INVOICE_COMPANY.iecNo,
    lutRef: INVOICE_COMPANY.lutRef,
    countryOfOrigin: "India",
    countryOfDestination: "",
    currency: "USD",
    billTo: emptyParty(),
    shipTo: emptyParty(),
    shipToSameAsBillTo: true,
    shipment: Object.fromEntries(SHIPMENT_FIELDS.map((field) => [field.key, ""])) as ShipmentDetails,
    items: [emptyItem()],
    declaration: INVOICE_DECLARATIONS[type],
  };
}

export function parseAmount(value: string | number) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

// Rounded to cents per line so the printed amounts add up to the printed total.
export function lineAmount(item: LineItem) {
  return Math.round(parseAmount(item.qty) * parseAmount(item.rate) * 100) / 100;
}

export function filledItems(items: LineItem[]) {
  return items.filter((item) => item.description.trim() || item.qty.trim() || item.rate.trim());
}

export function invoiceTotal(items: LineItem[]) {
  return Math.round(filledItems(items).reduce((sum, item) => sum + lineAmount(item), 0) * 100) / 100;
}

/** Fills defaults for missing fields so older or hand-made JSON can be loaded. */
export function normalizeInvoice(input: Partial<InvoiceData> & { type: InvoiceType }): InvoiceData {
  const base = emptyInvoice(input.type);
  const asText = (value: unknown) => (value === undefined || value === null ? "" : String(value));
  const party = (value: Partial<Party> | undefined): Party => ({
    name: asText(value?.name),
    address: asText(value?.address),
    email: asText(value?.email),
  });

  const result: InvoiceData = { ...base };
  for (const key of Object.keys(base) as (keyof InvoiceData)[]) {
    if (typeof base[key] === "string" && input[key] !== undefined) {
      (result as Record<string, unknown>)[key] = asText(input[key]);
    }
  }
  result.type = input.type;
  result.billTo = party(input.billTo);
  result.shipTo = party(input.shipTo);
  result.shipToSameAsBillTo = input.shipToSameAsBillTo ?? base.shipToSameAsBillTo;
  result.shipment = Object.fromEntries(
    SHIPMENT_FIELDS.map((field) => [field.key, asText(input.shipment?.[field.key])]),
  ) as ShipmentDetails;
  result.items = (input.items?.length ? input.items : base.items).map((item) => ({
    description: asText(item?.description),
    details: asText(item?.details),
    hsn: asText(item?.hsn),
    qty: asText(item?.qty),
    rate: asText(item?.rate),
  }));
  return result;
}
