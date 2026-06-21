import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="section-padding relative">
        <div className="container-main text-center">
          <h1 className="mb-6 text-3xl font-bold leading-tight text-text md:text-4xl lg:text-[42px]">
            We Make it Easy to Source from India
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-text-muted">
            Finding a reliable supplier and ensuring smooth production can be challenging.
            ITPLSourcing takes care of the entire process, from sourcing suppliers to delivering your products.
          </p>
          <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact?type=new" className="btn-primary min-w-[200px]">
              Find new suppliers
            </Link>
            <Link href="/contact?type=manage" className="btn-outline min-w-[200px]">
              Manage my suppliers
            </Link>
          </div>
          <p className="text-sm text-text-muted">
            No experience needed, our expert agents will handle it all for you.
          </p>
        </div>
      </div>
    </section>
  );
}
