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

## Environment Variables

Set these in Vercel → Project → Settings → Environment Variables (for Production and Preview), then redeploy.

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_USER` | Yes | Email account used to send form notifications |
| `SMTP_PASS` | Yes | Its password (for Google, a 16-character app password) |
| `SMTP_HOST` / `SMTP_PORT` | No | Defaults to `smtp.gmail.com` / `587` |
| `SMTP_FROM` | No | From address, defaults to `SMTP_USER` |
| `NOTIFICATION_EMAIL` | No | Inbox for enquiries, defaults to `inquiry@intratradeglobal.com` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | No | Service account that saves RFQ attachments to Google Drive |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | No | The `private_key` value from the service account's JSON key |
| `GOOGLE_DRIVE_FOLDER_ID` | No | Shared Drive folder that RFQ folders are created in |

### Saving RFQ attachments to Google Drive

When the three `GOOGLE_*` variables are set, each sourcing enquiry gets its own folder (`RFQ-<id> - <company>`) containing the uploaded files and a text copy of the enquiry, and the notification email links to it. Files are still attached to the email, and if Drive fails the enquiry is emailed anyway.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Google Drive API**.
2. Under **IAM & Admin → Service Accounts**, create a service account, then **Keys → Add key → JSON** and download the key file.
3. In Google Drive, create a **Shared Drive** (a service account cannot store files in a personal My Drive). Add the service account's email as a member with the **Content manager** role.
4. Open the Shared Drive (or a folder inside it) and copy the ID from the URL: `https://drive.google.com/drive/folders/<FOLDER_ID>`.
5. In Vercel, set `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the key file's `client_email`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` to its `private_key` (the whole `-----BEGIN PRIVATE KEY-----...` value), and `GOOGLE_DRIVE_FOLDER_ID` to the ID. Redeploy.
6. Delete the downloaded JSON key file once it is in Vercel.

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
