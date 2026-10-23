"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, FilePlus2, Pencil } from "lucide-react";
import { INVOICE_TYPES } from "@/data/invoice";
import type { InvoiceType } from "@/lib/invoice/types";

type Stored = { invoiceNo: string; fileName: string; customer: string; createdTime: string; link: string };

export default function RecentInvoices({ type }: { type: InvoiceType }) {
  const [invoices, setInvoices] = useState<Stored[] | null>(null);
  const [error, setError] = useState("");
  const meta = INVOICE_TYPES[type];

  useEffect(() => {
    fetch(`/api/invoices/list?type=${type}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Could not load invoices.");
        setInvoices(body.invoices);
      })
      .catch((err: Error) => setError(err.message));
  }, [type]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-200 px-5 py-3 font-bold text-[#1F3864]">Recent {meta.label}s</h2>
      {error && <p className="px-5 py-4 text-sm text-red-700">{error}</p>}
      {!error && invoices === null && <p className="px-5 py-4 text-sm text-slate-500">Loading…</p>}
      {invoices?.length === 0 && <p className="px-5 py-4 text-sm text-slate-500">No {meta.label.toLowerCase()}s yet.</p>}
      {!!invoices?.length && (
        <ul className="divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <li key={invoice.invoiceNo} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{invoice.invoiceNo}</span>
                <span className="block truncate text-slate-500">
                  {invoice.customer || "—"}
                  {invoice.createdTime && ` · ${new Date(invoice.createdTime).toLocaleDateString("en-GB")}`}
                </span>
              </span>
              <a href={invoice.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#2E75B6] hover:underline">
                <ExternalLink className="h-4 w-4" /> Open
              </a>
              <Link
                href={`/invoices/${meta.slug}?edit=${encodeURIComponent(invoice.invoiceNo)}`}
                className="flex items-center gap-1 text-slate-600 hover:text-[#1F3864]"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              {type === "PI" && (
                <Link
                  href={`/invoices/commercial?fromPi=${encodeURIComponent(invoice.invoiceNo)}`}
                  className="flex items-center gap-1 text-slate-600 hover:text-[#1F3864]"
                >
                  <FilePlus2 className="h-4 w-4" /> Make CI
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
