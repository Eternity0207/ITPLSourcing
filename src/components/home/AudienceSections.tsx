import Image from "next/image";
import Link from "next/link";
import { AUDIENCE_SECTIONS } from "@/data/site";

export default function AudienceSections() {
  return (
    <>
      {AUDIENCE_SECTIONS.map((section) => (
        <section
          key={section.id}
          className={`section-padding ${section.reverse ? "bg-[#f0f4ff]" : "bg-white"}`}
        >
          <div className="container-main">
            <div
              className={`flex flex-col items-center gap-10 lg:gap-16 ${
                section.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <div className="flex-1">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  width={1000}
                  height={657}
                  className="w-full rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-bold text-[#333] md:text-3xl">
                  {section.title}
                </h2>
                <p className="mb-4 text-lg font-semibold text-[#ff9933]">
                  {section.subtitle}
                </p>
                <p className="mb-6 text-[#7a7a7a] leading-relaxed">
                  {section.description}
                </p>
                <Link href="/contact" className="btn-primary">
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
