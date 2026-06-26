import Link from "next/link";
import { HOW_WE_WORK, SITE } from "@/data/site";

export default function HowWeWork() {
  return (
    <section className="section-padding bg-accent">
      <div className="container-main">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-text md:text-3xl">How We Work</h2>
          <p className="text-text-muted">
            A clear process from your first enquiry to final delivery.
          </p>
        </div>

        <ol className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {HOW_WE_WORK.map((item) => (
            <li
              key={item.step}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="pt-0.5 font-semibold leading-snug text-text">{item.title}</h3>
              </div>
              <p className="pl-11 text-sm leading-relaxed text-text-muted">{item.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link href="/contact" className="btn-primary">
            Start with {SITE.name}
          </Link>
        </div>
      </div>
    </section>
  );
}
