import nodemailer from "nodemailer";
import { SITE, URGENCY_OPTIONS } from "@/data/site";

export type EnquiryAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type SourcingEnquiry = {
  contactName: string;
  companyName: string;
  email: string;
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

function formatConfirmationText(enquiry: SourcingEnquiry, enquiryId: number) {
  return [
    `Dear ${enquiry.contactName},`,
    "",
    `Thank you for your product sourcing enquiry with ${SITE.name}.`,
    `We have received your submission (RFQ-${enquiryId}) and our team will respond within 24 hours.`,
    "",
    "Summary of your enquiry:",
    "",
    `Product(s): ${enquiry.productNames}`,
    `MOQ: ${enquiry.moq || "—"}`,
    `Target Price (USD): ${enquiry.targetPrice || "—"}`,
    `Urgency: ${getUrgencyLabel(enquiry.urgency)}`,
    "",
    "If you need to add anything, reply to this email with your reference number.",
    "",
    `Best regards,`,
    `${SITE.name}`,
    SITE.email,
  ].join("\n");
}

export async function sendSourcingEnquiryEmail(
  enquiry: SourcingEnquiry,
  enquiryId: number,
  attachments: EnquiryAttachment[],
) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error(
      "Email is not configured. Set SMTP_USER and SMTP_PASS environment variables.",
    );
  }

  const inbox = process.env.NOTIFICATION_EMAIL || SITE.notificationEmail;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await Promise.all([
    transporter.sendMail({
      from: `"${SITE.name}" <${from}>`,
      to: inbox,
      replyTo: enquiry.email,
      subject: `[${SITE.name}] New sourcing enquiry from ${enquiry.contactName}`,
      text: formatEnquiryText(enquiry, enquiryId),
      attachments,
    }),
    transporter.sendMail({
      from: `"${SITE.name}" <${from}>`,
      to: enquiry.email,
      replyTo: inbox,
      subject: `[${SITE.name}] We received your sourcing enquiry — RFQ-${enquiryId}`,
      text: formatConfirmationText(enquiry, enquiryId),
    }),
  ]);
}

export async function sendNotificationEmail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error(
      "Email is not configured. Set SMTP_USER and SMTP_PASS environment variables.",
    );
  }

  const inbox = process.env.NOTIFICATION_EMAIL || SITE.notificationEmail;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"${SITE.name}" <${from}>`,
    to: inbox,
    replyTo,
    subject: `[${SITE.name}] ${subject}`,
    text,
  });
}
