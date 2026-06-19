import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import CTASection from "@/components/home/CTASection";

type ServicePageProps = {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
};

export default function ServicePageTemplate({
  title,
  subtitle,
  description,
  features,
  image,
}: ServicePageProps) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-[#333] md:text-4xl">{title}</h1>
            <p className="text-lg font-semibold text-[#ff9933]">{subtitle}</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1">
              <Image
                src={image}
                alt={title}
                width={1000}
                height={657}
                className="w-full rounded-2xl object-cover shadow-lg"
              />
            </div>
            <div className="flex-1">
              <p className="mb-6 text-lg leading-relaxed text-[#7a7a7a]">{description}</p>
              <ul className="mb-8 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9933]" />
                    <span className="text-[#444]">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn-primary">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
