import { NextRequest, NextResponse } from "next/server";
import {
  sendSourcingEnquiryEmail,
  type EnquiryAttachment,
  type SourcingEnquiry,
} from "@/lib/email";

// Vercel rejects request bodies over 4.5 MB, so keep all attachments combined under that.
const MAX_TOTAL_SIZE = 4 * 1024 * 1024;
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

async function readAttachments(files: File[]): Promise<EnquiryAttachment[]> {
  const attachments: EnquiryAttachment[] = [];

  for (const file of files) {
    if (!isAllowedFile(file)) {
      throw new Error(`Unsupported file type: ${file.name}`);
    }
    attachments.push({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined,
    });
  }

  return attachments;
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

    const totalSize = attachmentFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json({ error: "Attachments must be 4 MB or less in total" }, { status: 400 });
    }

    const enquiryId = Date.now();
    const attachments = await readAttachments(attachmentFiles);

    try {
      await sendSourcingEnquiryEmail(enquiry, enquiryId, attachments);
    } catch (emailError) {
      console.error("Failed to send sourcing enquiry email:", emailError);
      const message =
        emailError instanceof Error ? emailError.message : "Failed to send notification email";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: "Sourcing enquiry submitted successfully. Expect a response within 24 hours.",
      rfqId: `RFQ-${enquiryId}`,
      attachments: attachments.map((a) => a.filename),
    });
  } catch (error) {
    console.error("RFQ submission failed:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
