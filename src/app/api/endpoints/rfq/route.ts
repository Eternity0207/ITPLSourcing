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
  existing.push({
    ...(data as object),
    id: Date.now(),
    status: "pending",
    createdAt: new Date().toISOString(),
  });
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      type,
      message,
      productLink,
      targetPrice,
      moq,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await appendJson("rfqs.json", {
      firstName,
      lastName,
      email,
      phone,
      company,
      type,
      message,
      productLink,
      targetPrice,
      moq,
    });

    return NextResponse.json({
      success: true,
      message: "RFQ submitted successfully. Expect a sourcing report within 48 hours.",
      rfqId: `RFQ-${Date.now()}`,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
