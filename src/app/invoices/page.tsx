import Link from "next/link";
import { FileText, Ship } from "lucide-react";
import InvoiceShell from "@/components/invoices/InvoiceShell";
import RecentInvoices from "@/components/invoices/RecentInvoices";

const CARDS = [
  {
    href: "/invoices/proforma",
    title: "New Proforma Invoice",
    text: "PI for quotations and advance payment, with PO and payment terms.",
    icon: FileText,
  },
  {
    href: "/invoices/commercial",
    title: "New Commercial Invoice",
    text: "CI for shipment, with PI reference, ports, Incoterms and weights.",
    icon: Ship,
  },
];

export default function InvoicesDashboard() {
  return (
    <InvoiceShell>
      <div className="grid gap-4 md:grid-cols-2">
        {CARDS.map(({ href, title, text, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#2E75B6] hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D6E4F7] text-[#1F3864] transition group-hover:bg-[#1F3864] group-hover:text-white">
              <Icon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-bold text-slate-900">{title}</span>
              <span className="mt-1 block text-sm text-slate-500">{text}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RecentInvoices type="PI" />
        <RecentInvoices type="CI" />
      </div>
    </InvoiceShell>
  );
}
