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
  existing.push({ ...data as object, id: Date.now(), createdAt: new Date().toISOString() });
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, type, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await appendJson("contacts.json", { firstName, lastName, email, company, type, message });

    return NextResponse.json({
      success: true,
      message: "Contact inquiry received. Our team will respond within 48 hours.",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const filePath = path.join(DATA_DIR, "contacts.json");
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch {
    return NextResponse.json([]);
  }
}
