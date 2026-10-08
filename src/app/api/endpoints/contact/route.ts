import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, type, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sendNotificationEmail({
      subject: `New contact inquiry from ${firstName} ${lastName}`,
      replyTo: email,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Company: ${company || "—"}`,
        `Inquiry Type: ${type || "—"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({
      success: true,
      message: "Contact inquiry received. Our team will respond within 24 hours.",
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
