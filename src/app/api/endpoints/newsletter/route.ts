import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
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
  existing.push({ ...(data as object), id: Date.now(), createdAt: new Date().toISOString() });
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await appendJson("newsletter.json", { firstName, lastName, email });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your download link will be sent to your email.",
      downloadUrl: "/import-from-india-tutorial",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const filePath = path.join(DATA_DIR, "newsletter.json");
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json([]);
  }
}
