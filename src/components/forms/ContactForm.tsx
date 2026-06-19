"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") || "general";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    type: defaultType,
    message: "",
    productLink: "",
    targetPrice: "",
    moq: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const endpoint = form.type === "new" || form.type === "manage" ? "/api/endpoints/rfq" : "/api/endpoints/contact";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          type: defaultType,
          message: "",
          productLink: "",
          targetPrice: "",
          moq: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-shadow space-y-4 rounded-2xl bg-white p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#333]">First Name *</label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#333]">Last Name *</label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#333]">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#333]">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#333]">Company</label>
        <input
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#333]">Inquiry Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
        >
          <option value="general">General Inquiry</option>
          <option value="new">Find New Suppliers</option>
          <option value="manage">Manage My Suppliers</option>
          <option value="rfq">Submit RFQ</option>
          <option value="dropshipping">Dropshipping</option>
          <option value="amazon-fba">Amazon FBA</option>
        </select>
      </div>

      {(form.type === "new" || form.type === "rfq") && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#333]">Product Link / Description</label>
            <input
              type="text"
              value={form.productLink}
              onChange={(e) => setForm({ ...form, productLink: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
              placeholder="Paste product link or describe your product"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#333]">Target Price</label>
              <input
                type="text"
                value={form.targetPrice}
                onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#333]">MOQ Requirements</label>
              <input
                type="text"
                value={form.moq}
                onChange={(e) => setForm({ ...form, moq: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-[#333]">Message *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-[#ff9933] focus:outline-none"
          placeholder="Tell us about your sourcing needs..."
        />
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {status === "loading" ? "Sending..." : "Submit Inquiry"}
      </button>

      {status === "success" && (
        <p className="text-center text-sm text-green-600">
          Thank you! Our team will respond within 48 hours.
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
