import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { SITE } from "@/data/site";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Sourcing Agent Guide",
  description: "Complete guide to choosing and working with an India sourcing agent.",
};

const FEATURES = [
  "End-to-end supply chain management",
  "Free quality inspection",
  "1-by-1 product inspection",
  "48-hour sourcing report",
  "200+ professional staff",
  "In-house packaging solutions",
  "Credit payment terms",
  "Compensation for defective products",
  "Multi-factory coordination",
  "Dedicated account manager",
];

const STEPS = [
  {
    step: "1",
    title: "Submit Your Requirements",
    description: "Share product links, images, specifications, target price, and MOQ requirements.",
  },
  {
    step: "2",
    title: "Receive Sourcing Report",
    description: "Get a comprehensive report with supplier recommendations within 48 hours.",
  },
  {
    step: "3",
    title: "Review & Approve",
    description: "Compare quotes, review factory profiles, and approve your preferred supplier.",
  },
  {
    step: "4",
    title: "Production & QC",
    description: "We monitor production, conduct inspections, and keep you updated at every milestone.",
  },
  {
    step: "5",
    title: "Shipping & Delivery",
    description: "Handle logistics, customs, and deliver to your door or fulfillment warehouse.",
  },
];

export default function SourcingGuidePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">Sourcing Agent Guide</h1>
            <p className="text-lg text-text-muted">
              Everything you need to know about working with {SITE.name}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <h2 className="mb-8 text-center text-2xl font-bold text-text">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-5">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-text">{s.title}</h3>
                <p className="text-xs text-text-muted">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-accent">
        <div className="container-main">
          <h2 className="mb-8 text-center text-2xl font-bold text-text">
            What {SITE.name} Delivers
          </h2>
          <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-text-light">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main text-center">
          <h2 className="mb-4 text-2xl font-bold text-text">Ready to Get Started?</h2>
          <p className="mb-6 text-text-muted">
            Join 4,000+ clients who trust {SITE.name} for their India sourcing needs.
          </p>
          <Link href="/contact" className="btn-primary">
            Submit Your First RFQ
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
