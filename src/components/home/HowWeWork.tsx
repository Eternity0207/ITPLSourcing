import Link from "next/link";
import { HOW_WE_WORK, SITE } from "@/data/site";

export default function HowWeWork() {
  return (
    <section className="section-padding bg-accent">
      <div className="container-main">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-text md:text-3xl">How we work</h2>
          <p className="text-text-muted">
            A clear process from your first enquiry to final delivery.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_WE_WORK.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {item.step}
              </div>
              <p className="text-sm leading-relaxed text-text-muted">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">
            Start with {SITE.name}
          </Link>
        </div>
      </div>
    </section>
  );
}
