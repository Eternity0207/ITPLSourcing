import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import { SITE, URGENCY_OPTIONS } from "@/data/site";

type SavedAttachment = {
  originalName: string;
  storedName: string;
  size: number;
  type: string;
};

export type SourcingEnquiry = {
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

function getUrgencyLabel(value: string) {
  return URGENCY_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function formatEnquiryText(enquiry: SourcingEnquiry, enquiryId: number) {
  return [
    `New product sourcing enquiry — RFQ-${enquiryId}`,
    "",
    `Contact Person: ${enquiry.contactName}`,
    `Company: ${enquiry.companyName || "—"}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    "",
    `Product(s): ${enquiry.productNames}`,
    "",
    "Description / Specifications:",
    enquiry.productDescription,
    "",
    `MOQ: ${enquiry.moq || "—"}`,
    `Target Price (USD): ${enquiry.targetPrice || "—"}`,
    `Industry / Application: ${enquiry.industry || "—"}`,
    `Urgency: ${getUrgencyLabel(enquiry.urgency)}`,
    "",
    "Product Links:",
    enquiry.productLinks || "—",
    "",
    `Submitted via ${SITE.domain}`,
  ].join("\n");
}

export async function sendSourcingEnquiryEmail(
  enquiry: SourcingEnquiry,
  enquiryId: number,
  attachments: SavedAttachment[],
) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error(
      "Email is not configured. Set SMTP_USER and SMTP_PASS environment variables.",
    );
  }

  const uploadsDir = path.join(process.cwd(), "data", "uploads", String(enquiryId));
  const mailAttachments = await Promise.all(
    attachments.map(async (file) => ({
      filename: file.originalName,
      content: await fs.readFile(path.join(uploadsDir, file.storedName)),
      contentType: file.type || undefined,
    })),
  );

  const to = process.env.NOTIFICATION_EMAIL || SITE.notificationEmail;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"${SITE.name}" <${from}>`,
    to,
    replyTo: enquiry.email,
    subject: `[${SITE.name}] New sourcing enquiry from ${enquiry.contactName}`,
    text: formatEnquiryText(enquiry, enquiryId),
    attachments: mailAttachments,
  });
}
