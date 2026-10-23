import InvoiceEditor from "@/components/invoices/InvoiceEditor";
import InvoiceShell from "@/components/invoices/InvoiceShell";

export default async function CommercialInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const value = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);

  return (
    <InvoiceShell>
      <InvoiceEditor type="CI" editNo={value("edit")} fromPi={value("fromPi")} />
    </InvoiceShell>
  );
}
