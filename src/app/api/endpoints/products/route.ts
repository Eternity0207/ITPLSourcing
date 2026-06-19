import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/site";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const id = searchParams.get("id");

  if (id) {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  }

  if (category) {
    const filtered = PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    return NextResponse.json({ products: filtered, total: filtered.length });
  }

  const categories = [...new Set(PRODUCTS.map((p) => p.category))];
  return NextResponse.json({ products: PRODUCTS, categories, total: PRODUCTS.length });
}
