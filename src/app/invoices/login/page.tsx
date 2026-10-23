import LoginForm from "@/components/invoices/LoginForm";
import { isLoginConfigured } from "@/lib/invoice/auth";

export default async function InvoiceLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { next } = await searchParams;
  // Only allow redirects back into the invoice tool.
  const target = typeof next === "string" && next.startsWith("/invoices") ? next : "/invoices";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl shadow-slate-300/40">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F3864] text-lg font-bold text-white">
            IT
          </div>
          <h1 className="text-xl font-bold">Intratrade Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to create proforma and commercial invoices.</p>
        </div>
        {isLoginConfigured() ? (
          <LoginForm next={target} />
        ) : (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Login is not set up yet. Add <code>INVOICE_ADMIN_USERNAME</code> and <code>INVOICE_ADMIN_PASSWORD</code> to the
            environment variables and redeploy.
          </p>
        )}
      </div>
    </div>
  );
}
