"use client";

import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { SITE, URGENCY_OPTIONS } from "@/data/site";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
];

type FormState = {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  productNames: string;
  productDescription: string;
  moq: string;
  targetPrice: string;
  productLinks: string;
  industry: string;
  urgency: string;
};

const initialForm: FormState = {
  contactName: "",
  companyName: "",
  email: "",
  phone: "",
  productNames: "",
  productDescription: "",
  moq: "",
  targetPrice: "",
  productLinks: "",
  industry: "",
  urgency: "standard",
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;

    setFileError("");
    const next: File[] = [...files];

    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        setFileError(`You can upload up to ${MAX_FILES} files.`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" exceeds the 10 MB limit.`);
        continue;
      }
      if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(dwg|dxf|ai|psd|svg)$/i)) {
        setFileError(`"${file.name}" is not a supported file type.`);
        continue;
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }

    setFiles(next);
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
    setFileError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFileError("");

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append("attachments", file));

      const res = await fetch("/api/endpoints/rfq", {
        method: "POST",
        body: payload,
      });

      if (res.ok) {
        setStatus("success");
        setForm(initialForm);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const data = await res.json().catch(() => null);
        setFileError(data?.error || "Submission failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-shadow space-y-5 rounded-2xl bg-white p-6 md:p-8">
      <div>
        <h2 className="text-xl font-bold text-text">Product Sourcing Enquiry Form</h2>
        <p className="mt-2 text-sm text-text-muted">
          Please provide details about the products you wish to source from India through{" "}
          {SITE.legalName}. This helps us initiate the sourcing process promptly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Contact Person Name *</label>
          <input
            type="text"
            required
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Company Name</label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Phone Number (including country code) *
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 555 000 0000"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">
          Name of the Product(s) you wish to source *
        </label>
        <input
          type="text"
          required
          value={form.productNames}
          onChange={(e) => setForm({ ...form, productNames: e.target.value })}
          className={inputClass}
          placeholder="e.g. Stainless steel water bottles, bamboo cutting boards"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">
          Detailed Description of the Product / Specifications *
        </label>
        <textarea
          required
          rows={4}
          value={form.productDescription}
          onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
          className={inputClass}
          placeholder="Materials, dimensions, colors, certifications, packaging requirements, etc."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Minimum Order Quantity (MOQ) Required
          </label>
          <input
            type="text"
            value={form.moq}
            onChange={(e) => setForm({ ...form, moq: e.target.value })}
            className={inputClass}
            placeholder="e.g. 500 units"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Target Price per Unit (in USD)
          </label>
          <input
            type="text"
            value={form.targetPrice}
            onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
            className={inputClass}
            placeholder="e.g. $4.50"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">
          Relevant Links to the Product
        </label>
        <textarea
          rows={2}
          value={form.productLinks}
          onChange={(e) => setForm({ ...form, productLinks: e.target.value })}
          className={inputClass}
          placeholder="Manufacturer website, retail listing, reference product pages, etc."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">
          Upload Attachments
        </label>
        <p className="mb-2 text-xs text-text-muted">
          Product schematics, design files, sample images, specification documents. Up to {MAX_FILES}{" "}
          files, 10 MB each. Supported: images, PDF, Word, Excel, ZIP, DWG, AI, PSD.
        </p>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-accent/50 px-4 py-8 transition-colors hover:border-primary/50 hover:bg-accent">
          <Paperclip className="mb-2 h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-text">Click to upload or drag files here</span>
          <span className="mt-1 text-xs text-text-muted">Max 10 MB per file</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}`}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="truncate pr-3 text-text-light">
                  {file.name}{" "}
                  <span className="text-text-muted">({formatFileSize(file.size)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="shrink-0 rounded p-1 text-text-muted hover:bg-white hover:text-red-600"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Primary industry or application for this product
          </label>
          <input
            type="text"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className={inputClass}
            placeholder="e.g. Home & kitchen retail, promotional merchandise"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">
            Urgency level for sourcing this product *
          </label>
          <select
            required
            value={form.urgency}
            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
            className={inputClass}
          >
            {URGENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
        {status === "loading" ? "Submitting..." : "Submit Sourcing Enquiry"}
      </button>

      {status === "success" && (
        <p className="text-center text-sm text-green-600">
          Thank you! Your enquiry has been received. Our team will respond within 48 hours.
        </p>
      )}
      {status === "error" && !fileError && (
        <p className="text-center text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
