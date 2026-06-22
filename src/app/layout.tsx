import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { SITE } from "@/data/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "India sourcing",
    "sourcing agent India",
    "e-commerce sourcing India",
    "dropshipping India",
    "private label India",
    "IntraTrade Global",
    "IntraTrade Private Limited",
    "intratradeglobal.com",
  ],
  openGraph: {
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    url: SITE.url,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
