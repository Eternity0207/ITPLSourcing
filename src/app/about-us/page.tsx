import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE, STATS, MODULES } from "@/data/site";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE.legalName} — India's trusted sourcing agent since ${SITE.founded}.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#333] md:text-4xl">About {SITE.name}</h1>
            <p className="text-lg text-[#7a7a7a]">
              A vertically integrated procurement operating system for global importers
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1">
              <Image
                src="/images/hero/enterprise-procurement.jpg"
                alt="About ITPLSourcing"
                width={1000}
                height={788}
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-4 text-2xl font-bold text-[#333]">
                One Point of Contact for Importing from India
              </h2>
              <p className="mb-4 text-[#7a7a7a] leading-relaxed">
                {SITE.legalName} ({SITE.name}) is not simply a sourcing marketplace. We are a
                vertically integrated procurement operating system that manages the entire supply
                chain lifecycle from product discovery to final customer delivery.
              </p>
              <p className="mb-4 text-[#7a7a7a] leading-relaxed">
                Founded in {SITE.founded} and headquartered in {SITE.headquarters}, we serve
                Amazon FBA sellers, Shopify brands, dropshippers, retailers, wholesalers,
                enterprises, and first-time importers worldwide.
              </p>
              <p className="text-[#7a7a7a] leading-relaxed">
                Our core promise: end-to-end sourcing workflow support with human sourcing agents,
                quality inspection focus, and 48-hour sourcing report turnaround.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-[#f0f4ff]">
        <div className="container-main">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#333]">
            {SITE.name} in Numbers
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-6 text-center shadow-md">
                <p className="text-3xl font-bold text-[#ff9933]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#7a7a7a]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#333]">
            Our Platform Modules
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((mod) => (
              <div key={mod.id} className="card-shadow rounded-2xl bg-white p-5">
                <h3 className="mb-3 font-semibold text-[#ff9933]">{mod.title}</h3>
                <ul className="space-y-1">
                  {mod.features.map((f) => (
                    <li key={f} className="text-xs text-[#7a7a7a]">
                      • {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
