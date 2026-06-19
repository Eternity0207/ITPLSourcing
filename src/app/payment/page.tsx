import type { Metadata } from "next";
import { SITE } from "@/data/site";
import { CreditCard, Building, Globe, Shield } from "lucide-react";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Payment Information",
  description: `Payment methods and terms accepted by ${SITE.name}.`,
};

const PAYMENT_METHODS = [
  {
    icon: CreditCard,
    title: "Bank Transfer (Wire)",
    description: "Direct bank transfer to our Indian business account. Most common for large orders.",
  },
  {
    icon: Globe,
    title: "PayPal",
    description: "Accepted for smaller orders and sample payments. Additional fees may apply.",
  },
  {
    icon: Building,
    title: "Letter of Credit (L/C)",
    description: "Available for enterprise clients and large-volume orders with established relationships.",
  },
  {
    icon: Shield,
    title: "Credit Terms",
    description: "Qualified clients can access credit payment terms after receiving goods. See our Credit Payment Terms page.",
  },
];

export default function PaymentPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#333] md:text-4xl">Payment Information</h1>
            <p className="text-lg text-[#7a7a7a]">Secure and flexible payment options for global clients</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="mb-12 text-center">
            <p className="mx-auto max-w-2xl text-[#7a7a7a] leading-relaxed">
              {SITE.legalName} accepts multiple payment methods to accommodate clients worldwide.
              All transactions are processed securely with full documentation for your records.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.title} className="card-shadow rounded-2xl bg-white p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f4ff]">
                    <Icon className="h-6 w-6 text-[#ff9933]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#333]">{method.title}</h3>
                  <p className="text-sm text-[#7a7a7a]">{method.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl bg-[#f0f4ff] p-8">
            <h2 className="mb-4 text-xl font-bold text-[#333]">Standard Payment Terms</h2>
            <ul className="space-y-2 text-sm text-[#7a7a7a]">
              <li>• 30% deposit upon order confirmation</li>
              <li>• 70% balance before shipment</li>
              <li>• Sample orders: 100% upfront payment</li>
              <li>• Credit terms available for qualified enterprise clients</li>
              <li>• All prices quoted in USD unless otherwise specified</li>
            </ul>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
