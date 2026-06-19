# ITPLSourcing — IntraTrade Private Limited

India sourcing platform for global buyers. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Brand

- **Company:** IntraTrade Private Limited
- **Brand:** ITPLSourcing
- **Market:** India sourcing for global buyers

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, audience sections, differentiators, testimonials |
| `/contact` | Contact form & RFQ submission |
| `/our-products` | Product category gallery |
| `/about-us` | Company overview & platform modules |
| `/blog` | Blog listing |
| `/pricing` | Sourcing & Purchasing |
| `/dropshipping` | Dropshipping service |
| `/quality-control-service` | QC services |
| `/import-from-india-tutorial` | Free sourcing tutorial |
| `/sourcing-agent-guide` | Sourcing agent guide |

## API Endpoints

All backend routes live under `/api/endpoints/`:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/endpoints/contact` | GET, POST | General contact inquiries |
| `/api/endpoints/rfq` | GET, POST | RFQ / sourcing requests |
| `/api/endpoints/newsletter` | GET, POST | Ebook download signups |
| `/api/endpoints/products` | GET | Product catalog with filtering |
| `/api/endpoints/content` | GET | Stats, testimonials, modules |

Form submissions are persisted to `data/*.json` files.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Swiper (testimonial carousel)
- Lucide React (icons)

## License

Proprietary — IntraTrade Private Limited
