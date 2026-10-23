import { NextResponse, type NextRequest } from "next/server";
import { badRequest, parseType, serverError, unauthorized } from "@/lib/invoice/api";
import { listInvoices } from "@/lib/invoice/store";

export async function GET(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  const type = parseType(request.nextUrl.searchParams.get("type"));
  if (!type) return badRequest("Unknown invoice type.");

  try {
    return NextResponse.json({ invoices: await listInvoices(type, 50) });
  } catch (error) {
    return serverError(error, "Could not list invoices");
  }
}
