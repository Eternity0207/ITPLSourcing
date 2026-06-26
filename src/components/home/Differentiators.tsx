"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Package,
  FileText,
  ClipboardCheck,
  Truck,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { BUSINESS_HIGHLIGHTS, PRACTICAL_SERVICES, SITE } from "@/data/site";

const ICONS: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  "building-2": Building2,
  package: Package,
  "file-text": FileText,
  "clipboard-check": ClipboardCheck,
  truck: Truck,
  "user-check": UserCheck,
};

export default function Differentiators() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <h2 className="mb-3 text-center text-2xl font-bold text-text md:text-3xl">
          What we provide
        </h2>
        <p className="mb-12 text-center text-text-muted">
          Practical sourcing support — from supplier verification to export coordination.
        </p>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <div className="card-shadow rounded-2xl bg-white p-5 md:p-6">
              {PRACTICAL_SERVICES.map((item, index) => {
                const Icon = ICONS[item.icon] || ShieldCheck;
                const isActive = activeIndex === index;
                return (
                  <div key={item.title} className="border-b border-gray-100 last:border-0">
                    <button
                      className="flex w-full items-center justify-between py-4 text-left"
                      onClick={() => setActiveIndex(isActive ? -1 : index)}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          className={`h-5 w-5 shrink-0 ${isActive ? "text-primary" : "text-text"}`}
                        />
                        <span
                          className={`font-semibold ${isActive ? "text-primary" : "text-text"}`}
                        >
                          {item.title}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-text-light transition-transform ${
                          isActive ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>
                    {isActive && (
                      <p className="pb-4 pl-8 text-sm leading-relaxed text-text-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-2xl bg-accent p-8">
              <h3 className="mb-8 text-center text-xl font-bold text-text">Business Highlights</h3>
              <div className="grid grid-cols-2 gap-6">
                {BUSINESS_HIGHLIGHTS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/contact" className="btn-primary">
                  Submit enquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
