import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_PAGES } from "@/data/site";
import ServicePageTemplate from "@/components/pages/ServicePageTemplate";

type Props = { params: Promise<{ slug: string }> };

const SERVICE_SLUGS = Object.keys(SERVICE_PAGES);

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = SERVICE_PAGES[slug];
  if (!page) return { title: "Page Not Found" };
  return { title: page.title, description: page.description };
}

export default async function DynamicServicePage({ params }: Props) {
  const { slug } = await params;
  const page = SERVICE_PAGES[slug];
  if (!page) notFound();

  return (
    <ServicePageTemplate
      title={page.title}
      subtitle={page.subtitle}
      description={page.description}
      features={page.features}
      image={page.image}
    />
  );
}
