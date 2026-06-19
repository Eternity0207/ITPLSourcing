import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { EBOOK_BULLETS, SITE } from "@/data/site";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Import from India Tutorial",
  description: "Free practical guide to importing products from India and boosting your profits.",
};

const CHAPTERS = [
  {
    title: "Chapter 1: Finding Reliable Indian Suppliers",
    content:
      "Learn how to identify trustworthy manufacturers in India's key industrial hubs — Mumbai, Delhi NCR, Bangalore, Chennai, and Ahmedabad. We cover factory verification, certification checks, and red flags to watch for.",
  },
  {
    title: "Chapter 2: Profitable Products to Source",
    content:
      "Discover high-margin product categories where Indian manufacturing offers competitive advantages: textiles, handicrafts, electronics components, leather goods, spices, and more.",
  },
  {
    title: "Chapter 3: Getting Precise Product Quotes",
    content:
      "Master the art of RFQ submission. Learn what specifications to include, how to compare quotes, and negotiation strategies that save 20-40% on unit costs.",
  },
  {
    title: "Chapter 4: Shipping Solutions",
    content:
      "Compare air freight, sea freight, and express shipping from India. Understand customs documentation, Incoterms, and how to optimize for time vs. cost.",
  },
  {
    title: "Chapter 5: Quality Control Essentials",
    content:
      "Protect your investment with proper QC protocols — sample inspection, in-production checks, final inspection, and the benefits of 1-by-1 full inspection.",
  },
];

export default function TutorialPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#333] md:text-4xl">
              Import from India Tutorial
            </h1>
            <p className="text-lg text-[#7a7a7a]">
              Your free practical guide to sourcing from India
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <div className="mb-8 rounded-2xl bg-[#f0f4ff] p-6">
            <h2 className="mb-3 text-xl font-bold text-[#333]">What you&apos;ll learn:</h2>
            <ul className="space-y-2">
              {EBOOK_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-[#444]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9933]" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            {CHAPTERS.map((chapter, i) => (
              <div key={chapter.title} className="border-b border-gray-100 pb-8 last:border-0">
                <h3 className="mb-3 text-lg font-semibold text-[#ff9933]">
                  {i + 1}. {chapter.title}
                </h3>
                <p className="text-[#7a7a7a] leading-relaxed">{chapter.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="mb-4 text-[#7a7a7a]">
              Need hands-on help? {SITE.name} agents handle the entire process for you.
            </p>
            <Link href="/contact" className="btn-primary">
              Talk to a Sourcing Agent
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
