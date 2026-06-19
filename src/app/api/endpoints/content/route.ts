import { NextResponse } from "next/server";
import { PRODUCTS, STATS, TESTIMONIALS, MODULES } from "@/data/site";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  switch (type) {
    case "products":
      return NextResponse.json({ products: PRODUCTS });
    case "stats":
      return NextResponse.json({ stats: STATS });
    case "testimonials":
      return NextResponse.json({ testimonials: TESTIMONIALS });
    case "modules":
      return NextResponse.json({ modules: MODULES });
    default:
      return NextResponse.json({
        products: PRODUCTS,
        stats: STATS,
        testimonials: TESTIMONIALS,
        modules: MODULES,
      });
  }
}
