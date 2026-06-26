export const SITE = {
  name: "IntraTrade Global",
  legalName: "IntraTrade Private Limited",
  domain: "intratradeglobal.com",
  url: "https://intratradeglobal.com",
  tagline: "Your Trusted India Sourcing Partner",
  description:
    "IntraTrade Global helps international buyers source quality products from India — from supplier discovery and production oversight to quality checks and global delivery. One partner for e-commerce sellers, brands, and importers.",
  email: "inquiry@intratradeglobal.com",
  notificationEmail: "inquiry@intratradeglobal.com",
  address: "Udaipur, Rajasthan, India",
  founded: "2015",
  headquarters: "Udaipur, Rajasthan, India",
  workingHours: {
    weekdays: "Monday to Friday, 9:00 AM – 6:00 PM",
    saturday: "Saturday, 9:00 AM – 4:00 PM",
    timezone: "India Standard Time (IST)",
  },
};

export const POINTS_OF_CONTACT = [
  { name: "Ayush", phone: "+91 88755 15444" },
  { name: "Nitesh Tripathi", phone: "+91 81055 35577" },
] as const;

export const URGENCY_OPTIONS = [
  { value: "immediate", label: "Immediate (Within 1–2 months)" },
  { value: "high", label: "High (Within 3–6 months)" },
  { value: "standard", label: "Standard (Over 6 months)" },
  { value: "exploratory", label: "Exploratory / Research" },
] as const;

export const NAV = {
  services: [
    { label: "Sourcing & Purchasing", href: "/pricing" },
    { label: "Dropshipping Service", href: "/dropshipping" },
    { label: "Photos & Designs", href: "/graphics-and-design-service" },
    { label: "Extra Service", href: "/extra-service" },
  ],
  solutions: [
    { label: "Private Label", href: "/private-label-packaging-service" },
    { label: "Product Development", href: "/product-development" },
    { label: "Shipping Solution", href: "/shipping-and-cargo-consolidation-service" },
    { label: "E-commerce Fulfillment", href: "/amazon-fba-prep-service" },
    { label: "Quality Control", href: "/quality-control-service" },
    { label: "Credit Payment Terms", href: "/credit-payment-terms" },
    { label: "Affiliate Program", href: "/affiliates" },
  ],
  about: [
    { label: "Payment Information", href: "/payment" },
    { label: "About Us", href: "/about-us" },
    { label: "About Founder", href: "/founder" },
  ],
  resources: [
    { label: "Our Blog", href: "/blog" },
    { label: "Import from India Tutorial", href: "/import-from-india-tutorial" },
    { label: "Sourcing Agent Guide", href: "/sourcing-agent-guide" },
  ],
};

export const BUSINESS_HIGHLIGHTS = [
  { value: "250+", label: "Verified Indian Manufacturers" },
  { value: "30+", label: "Product Categories" },
  { value: "12+", label: "Buyer Countries" },
  { value: "95%", label: "Supplier Verification Success Rate" },
  { value: "24h", label: "Initial Response Time" },
  { value: "End-to-End", label: "Sourcing & Export Support" },
  { value: "Flexible", label: "MOQ for Small & Large Buyers" },
];

/** @deprecated Use BUSINESS_HIGHLIGHTS */
export const STATS = BUSINESS_HIGHLIGHTS;

export const HOW_WE_WORK = [
  { step: 1, description: "Buyer shares product requirements." },
  { step: 2, description: "We shortlist 3–5 suitable manufacturers." },
  { step: 3, description: "We verify supplier credentials and production capability." },
  { step: 4, description: "Samples are arranged for approval." },
  { step: 5, description: "Commercial terms and production are finalized." },
  { step: 6, description: "Quality inspection is conducted before shipment (if required)." },
  { step: 7, description: "Export documentation and customs are managed." },
  { step: 8, description: "Shipment is coordinated until delivery." },
];

export const PRACTICAL_SERVICES = [
  {
    title: "Verified Manufacturer Network",
    description:
      "Access to 250+ pre-screened Indian manufacturers across 30+ product categories, with credentials and production capability checked before introduction.",
    icon: "building-2",
  },
  {
    title: "Multiple Supplier Quotations",
    description:
      "We collect and compare quotes from shortlisted factories so you can evaluate pricing, lead times, and terms side by side.",
    icon: "file-text",
  },
  {
    title: "Product Customization & Private Labeling",
    description:
      "Support for OEM/ODM modifications, packaging changes, branding, and private label runs aligned to your specifications.",
    icon: "package",
  },
  {
    title: "Third-Party Quality Inspection",
    description:
      "Pre-shipment inspection through independent agencies or our on-ground team — sample, in-line, and final checks as needed.",
    icon: "shield-check",
  },
  {
    title: "Export Documentation Assistance",
    description:
      "Help preparing invoices, packing lists, certificates of origin, and other paperwork required for customs clearance.",
    icon: "clipboard-check",
  },
  {
    title: "Logistics & Shipping Coordination",
    description:
      "Air, sea, and express freight options with consolidation, tracking, and handoff to your warehouse or fulfillment center.",
    icon: "truck",
  },
  {
    title: "Dedicated Sourcing Manager",
    description:
      "Every inquiry is assigned a sourcing manager who coordinates suppliers, updates, samples, and production through delivery.",
    icon: "user-check",
  },
];

/** @deprecated Use PRACTICAL_SERVICES */
export const DIFFERENTIATORS = PRACTICAL_SERVICES;

export const AUDIENCE_SECTIONS = [
  {
    id: "ecommerce",
    title: "Built for e-commerce sellers",
    subtitle: "Sourcing for marketplace and D2C brands",
    description:
      "We help online sellers source from verified Indian factories with support for custom branding, packaging, and product specifications. From sample approval to bulk production, we coordinate suppliers around your MOQ and margin targets.",
    image: "/images/hero/amazon-warehouse.jpg",
    imageAlt: "E-commerce fulfillment and product preparation",
    reverse: false,
  },
  {
    id: "dropshipping",
    title: "Dropshipping at factory-direct prices",
    subtitle: "Factory-direct sourcing with flexible MOQs",
    description:
      "Source from verified manufacturers with quoted lead times and shipping options suited to dropship and low-inventory models. We coordinate production, packing, and export logistics for each order.",
    image: "/images/hero/dropshipping-logistics.jpg",
    imageAlt: "Global dropshipping logistics and delivery",
    reverse: true,
  },
  {
    id: "retailers",
    title: "Reliable sourcing for retailers",
    subtitle: "Multi-SKU procurement from India",
    description:
      "We connect retailers with verified manufacturers across product categories, coordinate multiple vendors when needed, and consolidate shipments to simplify import logistics.",
    image: "/images/hero/retail-sourcing.jpg",
    imageAlt: "Retail store product sourcing",
    reverse: false,
  },
  {
    id: "enterprises",
    title: "Procurement for enterprises and institutions",
    subtitle: "Documented sourcing and QC workflows",
    description:
      "Government agencies, institutions, and large buyers use us for structured procurement — supplier verification, sample approval, inspection reports, and export documentation at each stage.",
    image: "/images/hero/enterprise-procurement.jpg",
    imageAlt: "Enterprise procurement and supply chain",
    reverse: true,
  },
];

export const VALUE_ADDED = PRACTICAL_SERVICES.slice(0, 4);

export const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Founder, D2C Brands India",
    image: "/images/clients/steve.png",
    text: "When my original supplier fell behind schedule, IntraTrade Global found a replacement factory within weeks. The products arrived on spec within two months. Their production tracking and QC saved us both time and rework costs.",
  },
  {
    name: "Priya Mehta",
    role: "E-commerce Entrepreneur",
    image: "/images/clients/janelle.jpg",
    text: "I have partnered with IntraTrade Global for several years. My account manager sources, assembles, and packs products before arranging shipping — all at fair prices. I would not go back to sourcing on my own.",
  },
  {
    name: "Iconic Retail",
    role: "Retail Chain",
    image: "/images/clients/iconic-retail.jpg",
    text: "Straightforward to work with and consistently honest about product quality. They flag issues before shipment rather than after — exactly what a retail buyer needs.",
  },
  {
    name: "Arjun Patel",
    role: "Online Marketplace Seller",
    image: "/images/clients/bilal.jpg",
    text: "Reliable agents and consistently good product quality. Three successful orders this year, and we are already planning the next production run.",
  },
  {
    name: "Ananya Reddy",
    role: "Shopify Brand Owner",
    image: "/images/clients/angela.jpg",
    text: "Responsive, personable, and efficient. They coordinated overlapping time zones so we could resolve questions in real time — the process felt fast and well managed.",
  },
  {
    name: "Cynthia Blue",
    role: "Import Business",
    image: "/images/clients/cynthia.jpg",
    text: "Discovered IntraTrade Global through an industry channel and have been impressed ever since. My assigned agent is thorough, patient, and clearly experienced with India manufacturing.",
  },
  {
    name: "Teresa H. Neria",
    role: "Private Label Seller",
    image: "/images/clients/teresa.jpg",
    text: "They made sourcing from India straightforward for a first-time importer. Products matched my specifications, packaging was solid, and quality met our standards throughout.",
  },
  {
    name: "Crystal Smith",
    role: "New E-commerce Seller",
    image: "/images/clients/crystal.jpg",
    text: "As a complete beginner, I needed guidance at every step. IntraTrade Global walked me through supplier selection, sampling, and production — and even caught a design error I had missed.",
  },
  {
    name: "Hanna Zeidan",
    role: "Long-Term Client",
    image: "/images/clients/hanna.jpg",
    text: "A client since 2018. Professional team, clear communication, and genuine care for outcomes. Highly recommended for anyone importing from India.",
  },
  {
    name: "Ander Seli",
    role: "Test Order Client",
    image: "/images/clients/ander.png",
    text: "Started with a small trial order and everything arrived as expected. Friendly support, practical advice, and better options than I had found independently.",
  },
];

export const EBOOK_BULLETS = [
  "How to vet reliable Indian manufacturers",
  "High-margin product categories to explore",
  "Tips for accurate quotes and specifications",
  "Shipping options balanced for cost and speed",
  "And more practical import guidance",
];

export const FOOTER_LINKS = {
  main: [
    { label: "Home", href: "/" },
    { label: "Our Products", href: "/our-products" },
    { label: "About IntraTrade Global", href: "/about-us" },
    { label: "Payment Information", href: "/payment" },
    { label: "Sourcing Tutorial", href: "/import-from-india-tutorial" },
    { label: "Our Blog", href: "/blog" },
  ],
  services: [
    { label: "Sourcing & Purchasing", href: "/pricing" },
    { label: "Dropshipping Service", href: "/dropshipping" },
    { label: "Extra Service", href: "/extra-service" },
    { label: "Who We Support", href: "/about-us" },
  ],
  solutions: [
    { label: "Private Label", href: "/private-label-packaging-service" },
    { label: "Product Development", href: "/product-development" },
    { label: "Shipping Solution", href: "/shipping-and-cargo-consolidation-service" },
    { label: "E-commerce Fulfillment", href: "/amazon-fba-prep-service" },
    { label: "Quality Control", href: "/quality-control-service" },
    { label: "Credit Payment Terms", href: "/credit-payment-terms" },
    { label: "Graphic Design", href: "/graphics-and-design-service" },
    { label: "Affiliates Program", href: "/affiliates" },
  ],
};

export const MODULES = [
  {
    id: "supplier-discovery",
    title: "Supplier Discovery",
    features: ["RFQ Management", "Supplier Search", "Factory Verification", "Quote Comparison", "Negotiation Management"],
  },
  {
    id: "product-development",
    title: "Product Development",
    features: ["OEM/ODM Customization", "Prototype Requests", "Sample Management", "Cost Estimation", "Packaging Recommendations"],
  },
  {
    id: "manufacturing",
    title: "Manufacturing Management",
    features: ["Production Planning", "Order Management", "Production Monitoring", "Multi-Factory Coordination"],
  },
  {
    id: "quality-control",
    title: "Quality Control",
    features: ["Sample Inspection", "During Production Inspection", "Final Inspection", "100% Inspection", "QC Reporting"],
  },
  {
    id: "packaging",
    title: "Packaging & Branding",
    features: ["Private Label", "Packaging Design", "Logo Printing", "Branding Assets"],
  },
  {
    id: "logistics",
    title: "Logistics Platform",
    features: ["Air & Sea Freight", "Freight Quote Engine", "Shipment Tracking", "Customs Support", "Consolidated Shipping"],
  },
  {
    id: "warehousing",
    title: "Warehousing & Fulfillment",
    features: ["Inventory Storage", "Inventory Dashboard", "Pick Pack Ship", "Returns Processing"],
  },
  {
    id: "ecommerce",
    title: "E-commerce Seller Platform",
    features: ["Marketplace Prep", "Shopify Integration", "Dropshipping", "Order Fulfillment"],
  },
];

export const PRODUCTS = [
  { id: 1, name: "Electronics & Gadgets", category: "Electronics", image: "/images/products/electronics.webp", moq: "100 units" },
  { id: 2, name: "Home & Kitchen", category: "Home", image: "/images/products/home-kitchen.webp", moq: "200 units" },
  { id: 3, name: "Fashion & Apparel", category: "Fashion", image: "/images/products/fashion.webp", moq: "500 units" },
  { id: 4, name: "Beauty & Personal Care", category: "Beauty", image: "/images/products/beauty.webp", moq: "300 units" },
  { id: 5, name: "Sports & Outdoors", category: "Sports", image: "/images/products/sports.webp", moq: "150 units" },
  { id: 6, name: "Office & Stationery", category: "Office", image: "/images/products/office.webp", moq: "250 units" },
  { id: 7, name: "Toys & Games", category: "Toys", image: "/images/products/toys.jpg", moq: "400 units" },
  { id: 8, name: "Industrial Supplies", category: "Industrial", image: "/images/products/industrial.webp", moq: "50 units" },
];

export const BLOG_POSTS = [
  {
    slug: "how-to-source-from-india",
    title: "How to Source Products from India: A Complete Guide",
    excerpt: "A practical walkthrough for finding Indian manufacturers, comparing quotes, and managing your first production run.",
    date: "2026-03-15",
    image: "/images/products/blog-sourcing.webp",
    category: "Sourcing Guide",
  },
  {
    slug: "amazon-fba-india-sourcing",
    title: "E-commerce Sourcing from India: What Sellers Should Know",
    excerpt: "Key considerations for online sellers sourcing private-label and branded products from Indian factories.",
    date: "2026-02-28",
    image: "/images/products/blog-amazon.webp",
    category: "E-commerce",
  },
  {
    slug: "quality-control-best-practices",
    title: "Quality Control Best Practices for Indian Manufacturing",
    excerpt: "Inspection checkpoints and protocols that protect product quality when manufacturing in India.",
    date: "2026-02-10",
    image: "/images/products/blog-qc.webp",
    category: "Quality Control",
  },
  {
    slug: "shipping-from-india-guide",
    title: "Shipping from India: Air vs Sea Freight Comparison",
    excerpt: "Compare methods, costs, and transit times when importing goods from India to your market.",
    date: "2026-01-22",
    image: "/images/products/blog-shipping.webp",
    category: "Logistics",
  },
  {
    slug: "private-label-india",
    title: "Private Label Manufacturing in India: Opportunities & Tips",
    excerpt: "How to build a branded product line using India's manufacturing strengths and export infrastructure.",
    date: "2026-01-05",
    image: "/images/products/blog-private-label.webp",
    category: "Private Label",
  },
  {
    slug: "dropshipping-india-2026",
    title: "Dropshipping from India in 2026: Trends & Strategies",
    excerpt: "Why factory-direct Indian dropshipping is gaining traction and how to structure a profitable model.",
    date: "2025-12-18",
    image: "/images/products/blog-dropshipping.webp",
    category: "Dropshipping",
  },
];

export const SERVICE_PAGES: Record<string, { title: string; subtitle: string; description: string; features: string[]; image: string }> = {
  pricing: {
    title: "Sourcing & Purchasing",
    subtitle: "End-to-end procurement from Indian factories",
    description: "From supplier discovery to final delivery, our sourcing team manages the full procurement cycle. Submit your product enquiry and receive an initial response within 24 hours.",
    features: ["RFQ creation & tracking", "Multi-supplier quote comparison", "Factory verification & audits", "Negotiation management", "Purchase order management", "Production follow-up"],
    image: "/images/hero/amazon-warehouse.jpg",
  },
  dropshipping: {
    title: "Dropshipping Service",
    subtitle: "Factory-direct dropshipping at competitive rates",
    description: "Use our India network for dropshipping with lower unit costs, shorter lead times, and protection against lost or defective shipments.",
    features: ["Product sourcing", "Order fulfillment", "Packaging customization", "Inventory management", "Fast shipping options", "Quality guarantee"],
    image: "/images/hero/dropshipping-logistics.jpg",
  },
  "graphics-and-design-service": {
    title: "Photos & Designs",
    subtitle: "Professional product photography and design",
    description: "High-quality product images, packaging concepts, and brand assets that help your listings and marketing stand out.",
    features: ["Lifestyle photography", "Product photography", "Packaging design", "Logo design", "Listing images", "Brand asset creation"],
    image: "/images/hero/retail-sourcing.jpg",
  },
  "extra-service": {
    title: "Extra Service",
    subtitle: "Value-added support beyond core sourcing",
    description: "Factory visits, custom bundling, accessory sourcing, and specialized packaging for orders that need extra attention.",
    features: ["Factory visits", "Custom bundling", "Accessory sourcing", "Special packaging", "Product assembly", "Gift set creation"],
    image: "/images/hero/enterprise-procurement.jpg",
  },
  "private-label-packaging-service": {
    title: "Private Label & Packaging",
    subtitle: "Build your brand with custom packaging",
    description: "Logo printing, custom labels, and packaging tailored to your brand — from small batches to full production runs.",
    features: ["Logo printing", "Custom branding", "Product labels", "Product inserts", "Box design", "Packaging sourcing"],
    image: "/images/hero/amazon-warehouse.jpg",
  },
  "product-development": {
    title: "Product Development",
    subtitle: "From concept to production",
    description: "Turn ideas into manufacturable products: prototyping, sampling, cost modeling, and production planning under one roof.",
    features: ["Prototype development", "Factory matching", "Cost estimation", "Material recommendations", "Sample management", "Manufacturing planning"],
    image: "/images/hero/dropshipping-logistics.jpg",
  },
  "shipping-and-cargo-consolidation-service": {
    title: "Shipping Solution",
    subtitle: "Door-to-door logistics from India",
    description: "Air, sea, and express options with customs support, consolidated shipments, and shipment tracking.",
    features: ["Air & sea freight", "Express shipping (DHL, FedEx, UPS)", "Freight quote comparison", "Customs documentation", "Consolidated shipping", "Shipment tracking"],
    image: "/images/hero/retail-sourcing.jpg",
  },
  "amazon-fba-prep-service": {
    title: "E-commerce Fulfillment Prep",
    subtitle: "Ready for marketplace and 3PL warehouses",
    description: "We prepare your products for marketplace fulfillment centers and third-party logistics — labeling, bundling, poly bagging, and compliance checks included.",
    features: ["SKU labeling", "Carton labeling", "Product bundling", "Poly bagging", "Compliance checks", "Direct-to-warehouse shipping"],
    image: "/images/hero/enterprise-procurement.jpg",
  },
  "quality-control-service": {
    title: "Quality Control",
    subtitle: "Rigorous inspection at every stage",
    description: "Sample, in-line, final, and full-piece inspections with photo and video reports — included with every managed order.",
    features: ["Sample inspection", "During production inspection", "Final inspection", "Piece-by-piece inspection", "Photo & video reports", "Defect categorization"],
    image: "/images/hero/amazon-warehouse.jpg",
  },
  "credit-payment-terms": {
    title: "Credit Payment Terms",
    subtitle: "Flexible payment for growing businesses",
    description: "Qualified accounts can access credit terms after goods are received, improving cash flow as you scale.",
    features: ["Credit after delivery", "Flexible payment schedules", "Volume-based terms", "Enterprise accounts", "Invoice management", "Payment tracking"],
    image: "/images/hero/dropshipping-logistics.jpg",
  },
  affiliates: {
    title: "Affiliate Program",
    subtitle: "Earn by referring clients to IntraTrade Global",
    description: "Consultants, trainers, and industry partners can earn commissions for every qualified referral.",
    features: ["Competitive commissions", "Dedicated affiliate dashboard", "Marketing materials", "Real-time tracking", "Monthly payouts", "Priority support"],
    image: "/images/hero/retail-sourcing.jpg",
  },
};
