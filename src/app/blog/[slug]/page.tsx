import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, SITE } from "@/data/site";
import CTASection from "@/components/home/CTASection";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="section-padding relative">
          <div className="container-main">
            <Link href="/blog" className="mb-4 inline-block text-sm text-primary hover:underline">
              ← Back to Blog
            </Link>
            <span className="mb-2 block text-sm font-medium text-primary">{post.category}</span>
            <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">{post.title}</h1>
            <time className="text-sm text-text-muted">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <Image
            src={post.image}
            alt={post.title}
            width={1000}
            height={657}
            className="mb-8 w-full rounded-2xl object-cover shadow-lg"
          />
          <div className="prose prose-lg max-w-none text-text-light">
            <p className="text-lg leading-relaxed">{post.excerpt}</p>
            <p className="mt-4 leading-relaxed text-text-muted">
              Sourcing products from India offers significant advantages for global businesses —
              competitive factory pricing, diverse manufacturing capabilities, and growing export
              infrastructure. At {SITE.name}, we help you navigate every step of the process.
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              Whether you are an e-commerce seller, Shopify brand owner, or enterprise procurement
              team, our expert agents provide end-to-end support from supplier discovery to final
              delivery. Contact us to share your requirements — initial response within 24 hours.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/contact" className="btn-primary">
              Get a Free Consultation
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
