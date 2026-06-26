import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { sendSourcingEnquiryEmail, type SourcingEnquiry } from "@/lib/email";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

const ALLOWED_TYPES = new Set([
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
]);

function isAllowedFile(file: File) {
  if (ALLOWED_TYPES.has(file.type)) return true;
  return /\.(dwg|dxf|ai|psd|svg)$/i.test(file.name);
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function appendJson(filename: string, data: unknown) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  let existing: unknown[] = [];
  try {
    const content = await fs.readFile(filePath, "utf-8");
    existing = JSON.parse(content);
  } catch {
    existing = [];
  }
  const id = Date.now();
  existing.push({
    ...(data as object),
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
  return id;
}

async function saveAttachments(files: File[], enquiryId: number) {
  if (!files.length) return [];

  const enquiryDir = path.join(UPLOADS_DIR, String(enquiryId));
  await fs.mkdir(enquiryDir, { recursive: true });

  const saved: { originalName: string; storedName: string; size: number; type: string }[] = [];

  for (const file of files) {
    if (!isAllowedFile(file)) {
      throw new Error(`Unsupported file type: ${file.name}`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${file.name}`);
    }

    const storedName = `${Date.now()}-${sanitizeFilename(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(enquiryDir, storedName), buffer);

    saved.push({
      originalName: file.name,
      storedName,
      size: file.size,
      type: file.type,
    });
  }

  return saved;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let enquiry: SourcingEnquiry = {
      contactName: "",
      companyName: "",
      email: "",
      productNames: "",
      productDescription: "",
      moq: "",
      targetPrice: "",
      productLinks: "",
      industry: "",
      urgency: "standard",
    };
    let attachmentFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      enquiry = {
        contactName: String(formData.get("contactName") || ""),
        companyName: String(formData.get("companyName") || ""),
        email: String(formData.get("email") || ""),
        productNames: String(formData.get("productNames") || ""),
        productDescription: String(formData.get("productDescription") || ""),
        moq: String(formData.get("moq") || ""),
        targetPrice: String(formData.get("targetPrice") || ""),
        productLinks: String(formData.get("productLinks") || ""),
        industry: String(formData.get("industry") || ""),
        urgency: String(formData.get("urgency") || ""),
      };

      attachmentFiles = formData
        .getAll("attachments")
        .filter((entry): entry is File => entry instanceof File && entry.size > 0);
    } else {
      const body = await request.json();
      enquiry = {
        contactName: body.contactName || `${body.firstName || ""} ${body.lastName || ""}`.trim(),
        companyName: body.companyName || body.company || "",
        email: body.email || "",
        productNames: body.productNames || body.productLink || "",
        productDescription: body.productDescription || body.message || "",
        moq: body.moq || "",
        targetPrice: body.targetPrice || "",
        productLinks: body.productLinks || body.productLink || "",
        industry: body.industry || "",
        urgency: body.urgency || "standard",
      };
    }

    const { contactName, email, productNames, productDescription } = enquiry;

    if (!contactName || !email || !productNames || !productDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (attachmentFiles.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} attachments allowed` }, { status: 400 });
    }

    const enquiryId = await appendJson("rfqs.json", {
      ...enquiry,
      attachments: [],
    });

    let attachments: Awaited<ReturnType<typeof saveAttachments>> = [];
    if (attachmentFiles.length) {
      attachments = await saveAttachments(attachmentFiles, enquiryId);

      const filePath = path.join(DATA_DIR, "rfqs.json");
      const content = await fs.readFile(filePath, "utf-8");
      const rfqs = JSON.parse(content);
      const index = rfqs.findIndex((r: { id: number }) => r.id === enquiryId);
      if (index !== -1) {
        rfqs[index].attachments = attachments;
        await fs.writeFile(filePath, JSON.stringify(rfqs, null, 2));
      }
    }

    try {
      await sendSourcingEnquiryEmail(enquiry, enquiryId, attachments);
    } catch (emailError) {
      const message =
        emailError instanceof Error ? emailError.message : "Failed to send notification email";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: "Sourcing enquiry submitted successfully. Expect a response within 24 hours.",
      rfqId: `RFQ-${enquiryId}`,
      attachments: attachments.map((a) => a.originalName),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const filePath = path.join(DATA_DIR, "rfqs.json");
    const content = await fs.readFile(filePath, "utf-8");
    const rfqs = JSON.parse(content);

    if (id) {
      const rfq = rfqs.find((r: { id: number }) => String(r.id) === id);
      if (!rfq) return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
      return NextResponse.json(rfq);
    }

    return NextResponse.json(rfqs);
  } catch {
    return NextResponse.json([]);
  }
}
