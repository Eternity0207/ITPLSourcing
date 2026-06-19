import { Suspense } from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { SITE } from "@/data/site";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE.name}. Submit your sourcing inquiry and receive a response within 48 hours.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#333] md:text-4xl">Talk to Us</h1>
            <p className="text-lg text-[#7a7a7a]">
              Submit your inquiry and our expert agents will respond within 48 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="card-shadow rounded-2xl bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-[#333]">Contact Information</h2>
                <div className="space-y-4 text-sm text-[#7a7a7a]">
                  <p className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9933]" />
                    <a href={`mailto:${SITE.email}`} className="hover:text-[#ff9933]">
                      {SITE.email}
                    </a>
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9933]" />
                    <span>
                      {SITE.phoneIndia}
                      <br />
                      <span className="text-xs">(India)</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9933]" />
                    <span>
                      {SITE.phoneIntl}
                      <br />
                      <span className="text-xs">(International)</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9933]" />
                    {SITE.address}
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9933]" />
                    <span>
                      {SITE.workingHours.weekdays}
                      <br />
                      {SITE.workingHours.saturday}
                      <br />
                      <span className="text-xs">({SITE.workingHours.timezone})</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#f0f4ff] p-6">
                <h3 className="mb-2 font-bold text-[#333]">48-Hour Sourcing Report</h3>
                <p className="text-sm text-[#7a7a7a]">
                  Submit your RFQ and receive a comprehensive sourcing report with supplier
                  recommendations, pricing, and lead times within 48 hours.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Suspense fallback={<div className="card-shadow rounded-2xl bg-white p-8">Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
