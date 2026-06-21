"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PRODUCTS } from "@/data/site";
import CTASection from "@/components/home/CTASection";

export default function ProductsPage() {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

  const filtered =
    category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">Our Products</h1>
            <p className="text-lg text-text-muted">
              Browse product categories sourced directly from Indian factories
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-accent text-text-light hover:bg-primary/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-text">{product.name}</h3>
                  <p className="mb-3 text-xs text-text-muted">MOQ: {product.moq}</p>
                  <Link
                    href={`/contact?type=rfq&product=${encodeURIComponent(product.name)}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Request Quote →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
