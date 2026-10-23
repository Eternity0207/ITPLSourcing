import { type NextRequest } from "next/server";
import { badRequest, readInvoiceBody, unauthorized } from "@/lib/invoice/api";
import { renderInvoicePdf } from "@/lib/invoice/pdf";

// Renders without saving or touching the counter.
export async function POST(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  const parsed = await readInvoiceBody(request);
  if (typeof parsed === "string") return badRequest(parsed);

  const invoiceNo = parsed.data.invoiceNo.trim() || `${parsed.data.type}-PREVIEW`;
  const pdf = await renderInvoicePdf(parsed.data, invoiceNo);
  return new Response(Buffer.from(pdf), {
    headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" },
  });
}
