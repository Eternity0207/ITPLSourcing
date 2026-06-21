import Link from "next/link";

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary via-cyan-600 to-secondary-dark">
      <div className="container-main text-center">
        <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
          Ready to import from India?
        </h2>
        <p className="mb-8 text-lg text-white/90">
          Grow with ITPLSourcing. Wholesale or customize products at competitive prices.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-white px-10 py-3 text-base font-semibold text-primary shadow-lg transition-all hover:bg-gray-50"
        >
          Join our 4000+ clients now
        </Link>
      </div>
    </section>
  );
}
