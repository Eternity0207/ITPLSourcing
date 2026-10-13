import { createSign, randomUUID } from "crypto";

// Uploads RFQ attachments to Google Drive, either into a Workspace Shared Drive
// with a service account, or into a regular Gmail account's My Drive with an
// OAuth refresh token. Talks to the Drive REST API directly to avoid a large
// SDK dependency.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_FILES_URL = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

export type DriveFile = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

type DriveAuth =
  | { type: "oauth"; clientId: string; clientSecret: string; refreshToken: string }
  | { type: "serviceAccount"; clientEmail: string; privateKey: string };

type DriveConfig = {
  auth: DriveAuth;
  parentFolderId: string;
};

function getDriveAuth(): DriveAuth | null {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (clientId && clientSecret && refreshToken) {
    return { type: "oauth", clientId, clientSecret, refreshToken };
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    // Vercel stores multi-line values fine, but keys pasted with literal "\n" are common.
    return { type: "serviceAccount", clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") };
  }

  return null;
}

function getDriveConfig(): DriveConfig | null {
  const auth = getDriveAuth();
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!auth || !parentFolderId) return null;
  return { auth, parentFolderId };
}

export function isDriveConfigured() {
  return getDriveConfig() !== null;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

async function requestToken(params: Record<string, string>) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  if (!res.ok) {
    throw new Error(`Google auth failed (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function getAccessToken(auth: DriveAuth) {
  if (auth.type === "oauth") {
    return requestToken({
      grant_type: "refresh_token",
      client_id: auth.clientId,
      client_secret: auth.clientSecret,
      refresh_token: auth.refreshToken,
    });
  }

  const { clientEmail, privateKey } = auth;
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: DRIVE_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(privateKey));

  return requestToken({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: `${header}.${claims}.${signature}`,
  });
}

async function createFolder(token: string, name: string, parentId: string) {
  const res = await fetch(`${DRIVE_FILES_URL}?supportsAllDrives=true&fields=id,webViewLink`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: FOLDER_MIME_TYPE, parents: [parentId] }),
  });

  if (!res.ok) {
    throw new Error(`Drive folder creation failed (${res.status}): ${await res.text()}`);
  }

  return (await res.json()) as { id: string; webViewLink: string };
}

async function uploadFile(token: string, file: DriveFile, parentId: string) {
  const boundary = `rfq-${randomUUID()}`;
  const metadata = JSON.stringify({ name: file.filename, parents: [parentId] });
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
        `--${boundary}\r\nContent-Type: ${file.contentType || "application/octet-stream"}\r\n\r\n`,
    ),
    file.content,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const res = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart&supportsAllDrives=true&fields=id`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Drive upload of "${file.filename}" failed (${res.status}): ${await res.text()}`);
  }
}

/**
 * Creates a folder for the enquiry inside GOOGLE_DRIVE_FOLDER_ID and uploads the
 * files into it. Returns the folder's link, or null when Drive is not configured.
 */
export async function saveEnquiryToDrive(folderName: string, files: DriveFile[]) {
  const config = getDriveConfig();
  if (!config) return null;

  const token = await getAccessToken(config.auth);
  const folder = await createFolder(token, folderName, config.parentFolderId);
  await Promise.all(files.map((file) => uploadFile(token, file, folder.id)));
  return folder.webViewLink;
}
