import { type NextRequest } from "next/server";
import { unauthorized } from "@/lib/invoice/api";
import { INVOICE_TEMPLATE_XLSX_BASE64 } from "@/lib/invoice/template";

export async function GET(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  return new Response(Buffer.from(INVOICE_TEMPLATE_XLSX_BASE64, "base64"), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="ITPL-Invoice-Template.xlsx"',
    },
  });
}
