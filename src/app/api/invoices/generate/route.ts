import { NextResponse, type NextRequest } from "next/server";
import { badRequest, readInvoiceBody, serverError, unauthorized } from "@/lib/invoice/api";
import { renderInvoicePdf } from "@/lib/invoice/pdf";
import { invoiceExists, saveInvoice } from "@/lib/invoice/store";

export async function POST(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  const parsed = await readInvoiceBody(request);
  if (typeof parsed === "string") return badRequest(parsed);
  const { data, body } = parsed;

  try {
    // A typed-in number that is already used needs an explicit OK, so nothing is overwritten by accident.
    const invoiceNo = data.invoiceNo.trim();
    if (invoiceNo && body.overwrite !== true && (await invoiceExists(data.type, invoiceNo))) {
      return NextResponse.json(
        { error: `${invoiceNo} already exists. Generate again to replace it.`, exists: true },
        { status: 409 },
      );
    }

    const saved = await saveInvoice(data, (number) => renderInvoicePdf(data, number));
    return NextResponse.json({
      invoiceNo: saved.invoiceNo,
      fileName: saved.fileName,
      link: saved.link,
      replaced: saved.replaced,
      storage: saved.storage,
      pdfBase64: Buffer.from(saved.pdf).toString("base64"),
    });
  } catch (error) {
    return serverError(error, "Could not save the invoice");
  }
}
