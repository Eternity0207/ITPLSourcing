"use client";

import { usePathname } from "next/navigation";

// The internal invoice tool has its own minimal layout, so the marketing
// header, footer and scroll button are left out under /invoices.
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/invoices" || pathname?.startsWith("/invoices/")) return <>{children}</>;

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
