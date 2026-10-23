import { NextResponse, type NextRequest } from "next/server";
import { badRequest, parseType, serverError, unauthorized } from "@/lib/invoice/api";
import { peekNextInvoiceNo, storageMode } from "@/lib/invoice/store";
import { todayIso } from "@/lib/invoice/types";

export async function GET(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  const type = parseType(request.nextUrl.searchParams.get("type"));
  if (!type) return badRequest("Unknown invoice type.");
  const date = request.nextUrl.searchParams.get("date") || todayIso();

  try {
    const [invoiceNo, storage] = await Promise.all([peekNextInvoiceNo(type, date), storageMode()]);
    return NextResponse.json({ invoiceNo, storage });
  } catch (error) {
    return serverError(error, "Could not read the invoice counter");
  }
}
