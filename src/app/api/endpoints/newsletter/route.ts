import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sendNotificationEmail({
      subject: `New e-book download from ${firstName} ${lastName}`,
      replyTo: email,
      text: [`Name: ${firstName} ${lastName}`, `Email: ${email}`].join("\n"),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your download link will be sent to your email.",
      downloadUrl: "/import-from-india-tutorial",
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
