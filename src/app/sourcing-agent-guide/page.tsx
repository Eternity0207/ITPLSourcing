import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { HOW_WE_WORK, PRACTICAL_SERVICES, SITE } from "@/data/site";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Sourcing Agent Guide",
  description: "Complete guide to choosing and working with an India sourcing agent.",
};

const FEATURES = PRACTICAL_SERVICES.map((s) => s.title);

const STEPS = HOW_WE_WORK.map((item) => ({
  step: String(item.step),
  title: `Step ${item.step}`,
  description: item.description,
}));

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
          <h2 className="mb-8 text-center text-2xl font-bold text-text">How We Work</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            What {SITE.name} provides
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
            Share your product requirements and receive a response within 24 hours.
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
