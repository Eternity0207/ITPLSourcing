import { Suspense } from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { SITE } from "@/data/site";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Product Sourcing Enquiry",
  description: `Submit a product sourcing enquiry to ${SITE.legalName}. Share specifications, target pricing, and attachments — we respond within 48 hours.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">Product Sourcing Enquiry</h1>
            <p className="mx-auto max-w-2xl text-lg text-text-muted">
              Tell us what you need to source from India. Our team at {SITE.legalName} will review
              your requirements and respond within 48 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="card-shadow rounded-2xl bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-text">Contact Information</h2>
                <div className="space-y-4 text-sm text-text-muted">
                  <p className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                      {SITE.email}
                    </a>
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      {SITE.phoneIndia}
                      <br />
                      <span className="text-xs">(India)</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>
                      {SITE.phoneIntl}
                      <br />
                      <span className="text-xs">(International)</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {SITE.address}
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
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

              <div className="rounded-2xl bg-accent p-6">
                <h3 className="mb-2 font-bold text-text">48-Hour Sourcing Report</h3>
                <p className="text-sm text-text-muted">
                  After you submit your enquiry, we prepare a sourcing report with supplier options,
                  indicative pricing, lead times, and recommended next steps.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-white p-6 text-sm text-text-muted">
                <p className="font-medium text-text">Website</p>
                <a href={SITE.url} className="text-primary hover:underline">
                  {SITE.domain}
                </a>
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
