import type { Metadata } from "next";
import Image from "next/image";
import { SITE } from "@/data/site";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Founder",
  description: `Meet the founder of ${SITE.legalName} and learn about our mission.`,
};

export default function FounderPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#333] md:text-4xl">About Our Founder</h1>
            <p className="text-lg text-[#7a7a7a]">Building India&apos;s most trusted sourcing platform</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-4xl">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="shrink-0">
              <div className="relative h-64 w-64 overflow-hidden rounded-full shadow-xl">
                <Image
                  src="/images/products/founder.webp"
                  alt="Founder"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#333]">Rajesh Kumar</h2>
              <p className="mb-4 font-medium text-[#ff9933]">Founder & CEO, {SITE.legalName}</p>
              <p className="mb-4 text-[#7a7a7a] leading-relaxed">
                Rajesh founded {SITE.name} in {SITE.founded} with a vision to make sourcing from
                India as simple as placing a local order. With over 15 years of experience in
                international trade and manufacturing, he recognized the gap between global buyers
                and Indian factories.
              </p>
              <p className="mb-4 text-[#7a7a7a] leading-relaxed">
                Under his leadership, {SITE.name} has grown from a small sourcing consultancy to a
                full-service procurement platform with 200+ employees, serving 4,000+ clients across
                50+ countries.
              </p>
              <p className="text-[#7a7a7a] leading-relaxed">
                &ldquo;Our mission is simple: one point of contact for importing products from India.
                We handle everything so our clients can focus on growing their business.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
