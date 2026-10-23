import { NextResponse, type NextRequest } from "next/server";
import { badRequest, parseType, serverError, unauthorized } from "@/lib/invoice/api";
import { loadInvoice } from "@/lib/invoice/store";

export async function GET(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  const type = parseType(request.nextUrl.searchParams.get("type"));
  const invoiceNo = request.nextUrl.searchParams.get("invoiceNo");
  if (!type || !invoiceNo) return badRequest("Missing invoice type or number.");

  try {
    const invoice = await loadInvoice(type, invoiceNo);
    if (!invoice) return NextResponse.json({ error: `${invoiceNo} was not found.` }, { status: 404 });
    return NextResponse.json({ invoice });
  } catch (error) {
    return serverError(error, "Could not load the invoice");
  }
}
