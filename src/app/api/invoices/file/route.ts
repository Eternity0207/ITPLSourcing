import { NextResponse, type NextRequest } from "next/server";
import { badRequest, parseType, serverError, unauthorized } from "@/lib/invoice/api";
import { readInvoicePdf } from "@/lib/invoice/store";

export async function GET(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  const type = parseType(request.nextUrl.searchParams.get("type"));
  const invoiceNo = request.nextUrl.searchParams.get("invoiceNo");
  if (!type || !invoiceNo) return badRequest("Missing invoice type or number.");

  try {
    const file = await readInvoicePdf(type, invoiceNo);
    if (!file) return NextResponse.json({ error: `${invoiceNo} was not found.` }, { status: 404 });
    return new Response(new Uint8Array(file.content), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return serverError(error, "Could not open the invoice");
  }
}
