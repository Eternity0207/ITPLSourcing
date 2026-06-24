"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV, SITE } from "@/data/site";

type DropdownProps = {
  label: string;
  href?: string;
  items: { label: string; href: string }[];
};

function NavDropdown({ label, href, items }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href || "#"}
        className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-text transition-colors hover:text-primary"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <div className="absolute left-0 top-full z-50 min-w-[240px] rounded-lg border border-primary/10 bg-white py-2 shadow-xl shadow-primary/5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2.5 text-sm text-text-light transition-colors hover:bg-accent hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo.svg"
            alt={`${SITE.name} logo`}
            width={150}
            height={25}
            priority
            className="h-[25px] w-auto"
          />
        </Link>

        <nav className="hidden items-center lg:flex">
          <NavDropdown label="Our Services" href="/pricing" items={NAV.services} />
          <NavDropdown label="Solutions" items={NAV.solutions} />
          <Link
            href="/our-products"
            className="px-4 py-2 text-[15px] font-medium text-text transition-colors hover:text-primary"
          >
            Products
          </Link>
          <NavDropdown label="About" href="/about-us" items={NAV.about} />
          <NavDropdown label="Resources" href="/blog" items={NAV.resources} />
        </nav>

        <Link href="/contact" className="btn-primary hidden text-sm lg:inline-flex">
          Submit enquiry
        </Link>

        <button
          className="rounded-lg p-2 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          {[
            { label: "Our Services", items: NAV.services },
            { label: "Solutions", items: NAV.solutions },
            { label: "Products", items: [{ label: "Our Products", href: "/our-products" }] },
            { label: "About", items: NAV.about },
            { label: "Resources", items: NAV.resources },
          ].map((section) => (
            <div key={section.label} className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                {section.label}
              </p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-sm text-text-light"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/contact" className="btn-primary mt-2 w-full text-center" onClick={() => setMobileOpen(false)}>
            Submit enquiry
          </Link>
        </div>
      )}
    </header>
  );
}
