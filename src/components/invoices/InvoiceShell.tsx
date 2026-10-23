"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutGrid, LogOut, Ship } from "lucide-react";

const LINKS = [
  { href: "/invoices", label: "Dashboard", icon: LayoutGrid },
  { href: "/invoices/proforma", label: "Proforma (PI)", icon: FileText },
  { href: "/invoices/commercial", label: "Commercial (CI)", icon: Ship },
];

export default function InvoiceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/invoices/logout", { method: "POST" });
    window.location.assign("/invoices/login");
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/invoices" className="flex items-center gap-2 font-bold text-[#1F3864]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F3864] text-xs text-white">IT</span>
            Intratrade Invoices
          </Link>
          <nav className="flex flex-1 flex-wrap gap-1">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname === href ? "bg-[#1F3864] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-red-600">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-4 py-6">{children}</main>
    </>
  );
}
