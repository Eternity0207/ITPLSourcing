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
| `GOOGLE_DRIVE_FOLDER_ID` | No | Drive folder that RFQ folders are created in |
| `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET` / `GOOGLE_OAUTH_REFRESH_TOKEN` | No | Save to a regular Gmail account's Drive (option A) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | No | Save to a Workspace Shared Drive (option B) |

### Saving RFQ attachments to Google Drive

When `GOOGLE_DRIVE_FOLDER_ID` and one set of credentials below are set, each sourcing enquiry gets its own folder (`RFQ-<id> - <company>`) containing the uploaded files and a text copy of the enquiry, and the notification email links to it. Files are still attached to the email, and if Drive fails the enquiry is emailed anyway.

Either way, start in [Google Cloud Console](https://console.cloud.google.com/): create a project and enable the **Google Drive API**. If both credential sets are present, option A is used.

#### Option A: a regular Gmail account (e.g. a company @gmail.com)

1. **APIs & Services → OAuth consent screen:** choose **External**, fill in the app name and emails, add the Gmail account under **Test users**, then click **Publish app** so the status is **In production**. (In Testing status Google expires the token after 7 days. The app does not need Google verification for your own account; you will just see an "unverified app" warning once.)
2. **APIs & Services → Credentials → Create credentials → OAuth client ID:** type **Web application**, with authorized redirect URI `https://developers.google.com/oauthplayground`. Copy the client ID and secret.
3. Open the [OAuth Playground](https://developers.google.com/oauthplayground), click the gear icon, tick **Use your own OAuth credentials** and paste the client ID and secret.
4. In the scope box enter `https://www.googleapis.com/auth/drive`, click **Authorize APIs**, sign in as the Gmail account and allow access (click **Advanced → Go to app** on the unverified warning).
5. Click **Exchange authorization code for tokens** and copy the **Refresh token**.
6. In that account's Google Drive, create a folder (e.g. "RFQ Attachments") and copy its ID from the URL: `https://drive.google.com/drive/folders/<FOLDER_ID>`.
7. In Vercel, set `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN` and `GOOGLE_DRIVE_FOLDER_ID`, then redeploy.

The refresh token stops working if the account's password is changed or access is removed at myaccount.google.com → Security → Third-party connections; repeat steps 3–5 to get a new one.

#### Option B: a Google Workspace Shared Drive

1. Under **IAM & Admin → Service Accounts**, create a service account, then **Keys → Add key → JSON** and download the key file.
2. In Google Drive, create a **Shared Drive** (a service account cannot store files in a personal My Drive). Add the service account's email as a member with the **Content manager** role.
3. Open the Shared Drive (or a folder inside it) and copy the ID from the URL: `https://drive.google.com/drive/folders/<FOLDER_ID>`.
4. In Vercel, set `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the key file's `client_email`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` to its `private_key` (the whole `-----BEGIN PRIVATE KEY-----...` value), and `GOOGLE_DRIVE_FOLDER_ID` to the ID. Redeploy.
5. Delete the downloaded JSON key file once it is in Vercel.

## API Endpoints

All backend routes live under `/api/endpoints/`:

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/endpoints/contact` | POST | General contact inquiries |
| `/api/endpoints/rfq` | POST | RFQ / sourcing requests |
| `/api/endpoints/newsletter` | POST | Ebook download signups |
| `/api/endpoints/products` | GET | Product catalog with filtering |
| `/api/endpoints/content` | GET | Stats, testimonials, modules |

Form submissions are not stored on the server; they are emailed to `NOTIFICATION_EMAIL` (and RFQ attachments optionally saved to Google Drive).

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Swiper (testimonial carousel)
- Lucide React (icons)

## License

Proprietary — IntraTrade Private Limited
