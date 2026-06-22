import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="section-padding relative">
        <div className="container-main text-center">
          <h1 className="mb-6 text-3xl font-bold leading-tight text-text md:text-4xl lg:text-[42px]">
            Source Quality Products from India with Confidence
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-text-muted">
            Finding reliable manufacturers and managing production across borders is hard.
            IntraTrade Global handles the full journey — supplier discovery, production oversight,
            quality checks, and delivery to your market.
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary min-w-[200px]">
              Submit sourcing enquiry
            </Link>
            <Link href="/our-products" className="btn-outline min-w-[200px]">
              Browse product categories
            </Link>
          </div>
          <p className="text-sm text-text-muted">
            New to importing? Our specialists guide you through every step.
          </p>
        </div>
      </div>
    </section>
  );
}
