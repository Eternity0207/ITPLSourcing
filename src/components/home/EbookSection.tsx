"use client";

import Image from "next/image";
import { useState } from "react";
import { EBOOK_BULLETS } from "@/data/site";
import { Check } from "lucide-react";

export default function EbookSection() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/endpoints/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ firstName: "", lastName: "", email: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section-padding bg-accent">
      <div className="container-main">
        <div className="flex flex-col items-center gap-10 lg:flex-row">
          <div className="hidden flex-1 lg:block">
            <Image
              src="/images/ebook/import-guide-port.jpg"
              alt="Import from India shipping and logistics"
              width={1300}
              height={906}
              className="w-full rounded-2xl"
            />
          </div>
          <div className="hidden flex-1 sm:block lg:hidden">
            <Image
              src="/images/ebook/import-guide-truck.jpg"
              alt="Import from India freight and delivery"
              width={1100}
              height={841}
              className="mx-auto w-full max-w-md rounded-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="mb-4 text-2xl font-bold text-text md:text-3xl">
              Want to import from India and boost your profits?
            </h2>
            <p className="mb-4 text-text-muted">
              Download this practical tutorial now and learn:
            </p>
            <ul className="mb-6 space-y-2">
              {EBOOK_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm text-text-light">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {bullet}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First Name"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full disabled:opacity-60"
              >
                {status === "loading" ? "Submitting..." : "Download Now"}
              </button>
              {status === "success" && (
                <p className="text-sm text-green-600">Thank you! Check your email for the download link.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
