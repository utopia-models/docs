import { createSign } from 'node:crypto';

/**
 * `/resume.pdf` — Tyler's CURRENT resume, read from its one source at request time (knowledge#8024).
 *
 * This site is the public evidence behind the resume's "Autonomous Engineering Fleet" bullet
 * (knowledge `net/README.md`, "The differentiating artifact"), so the topbar links back to the resume.
 *
 * 🔴 NO COPY LIVES IN THIS REPO, AND NEITHER DOES A FILE ID (knowledge#8540). The resume has exactly
 * ONE source (PLAN-225): the file NAMED `Tyler_Youk_resume.pdf`, not trashed, in the Drive folder
 * `net/resume` (`1nMxo8kke5eKl_1_QtO8ndHz74I4UG_u1`). This handler resolves that name on each request
 * and proxies the bytes, the same way `net/work/_tools/resume-fetch.sh` in utopia-models/knowledge does.
 *
 * A stored id was the defect: the file it pointed at was moved aside and replaced by a new one, and
 * Drive keeps serving a superseded file by id with no error, so this route answered 200 with an old
 * resume for days. Resolving by name with `trashed=false` cannot do that. A replaced file is picked up
 * on the next request with no change here.
 *
 * The folder is private. The route reads it as a dedicated service account that holds `reader` on that
 * one folder and nothing else (no project role, no domain-wide delegation), with the `drive.readonly`
 * scope. Its key is the `RESUME_DRIVE_SA_JSON_B64` env var on the Vercel project (base64 of the key
 * JSON); the source of that value is Infisical `fleet-infra/DOCS_WIKI_RESUME_READER_SA_JSON_B64`.
 *
 * Every failure is a 502 naming the cause, never an HTML page or a stale file served as a PDF.
 *
 * Probe (the served bytes ARE the Drive bytes):
 *   diff <(curl -sL https://docs.utopiamodels.ai/resume.pdf | sha256sum) \
 *        <(bash net/work/_tools/resume-fetch.sh /tmp/r.pdf 2>/dev/null >/dev/null; sha256sum < /tmp/r.pdf)
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FOLDER_ID = '1nMxo8kke5eKl_1_QtO8ndHz74I4UG_u1';
const FILE_NAME = 'Tyler_Youk_resume.pdf';
const DRIVE = 'https://www.googleapis.com/drive/v3/files';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

let cachedToken: { value: string; expiresAt: number } | undefined;

const b64url = (input: string | Buffer) => Buffer.from(input).toString('base64url');

/** An access token for the reader service account, reused until a minute before it expires. */
async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const raw = process.env.RESUME_DRIVE_SA_JSON_B64;
  if (!raw) throw new Error('RESUME_DRIVE_SA_JSON_B64 is not set on this deployment');
  const key = JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) as {
    client_email: string;
    private_key: string;
  };
  const now = Math.floor(Date.now() / 1000);
  const unsigned =
    b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) +
    '.' +
    b64url(
      JSON.stringify({
        iss: key.client_email,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        aud: TOKEN_URL,
        iat: now,
        exp: now + 3600,
      }),
    );
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key);
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${b64url(signature)}`,
    }),
  });
  if (!res.ok) throw new Error(`the token exchange answered HTTP ${res.status}`);
  const body = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 };
  return cachedToken.value;
}

export async function GET() {
  let token: string;
  try {
    token = await accessToken();
  } catch (e) {
    return fail(`no Drive credential: ${e instanceof Error ? e.message : String(e)}`);
  }
  const auth = { Authorization: `Bearer ${token}` };

  // Resolve by NAME in the live folder, trash excluded. Newest first, so a stray duplicate cannot
  // shadow the file that was just delivered.
  const query = new URLSearchParams({
    q: `name='${FILE_NAME}' and '${FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id,size,modifiedTime)',
    orderBy: 'modifiedTime desc',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });
  let file: { id: string; size?: string } | undefined;
  try {
    const res = await fetch(`${DRIVE}?${query}`, { cache: 'no-store', headers: auth });
    if (!res.ok) return fail(`Drive answered HTTP ${res.status} resolving ${FILE_NAME}`);
    file = ((await res.json()) as { files?: { id: string; size?: string }[] }).files?.[0];
  } catch (e) {
    return fail(`the Drive lookup threw: ${String(e)}`);
  }
  if (!file) return fail(`no file named ${FILE_NAME} (not trashed) in Drive folder ${FOLDER_ID}`);

  let bytes: Uint8Array<ArrayBuffer>;
  try {
    const res = await fetch(`${DRIVE}/${file.id}?alt=media&supportsAllDrives=true`, {
      cache: 'no-store',
      headers: auth,
    });
    if (!res.ok) return fail(`Drive answered HTTP ${res.status} for file ${file.id}`);
    bytes = new Uint8Array(await res.arrayBuffer());
  } catch (e) {
    return fail(`the Drive fetch threw: ${String(e)}`);
  }
  // Same two gates as resume-fetch.sh: a short body or a non-PDF never leaves this function as a 200.
  if (file.size && bytes.length !== Number(file.size)) {
    return fail(`truncated: got ${bytes.length} bytes, Drive declared ${file.size} for file ${file.id}`);
  }
  const magic = new TextDecoder().decode(bytes.subarray(0, 4));
  if (magic !== '%PDF') return fail(`Drive served ${bytes.length} bytes that are not a PDF (file ${file.id})`);

  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${FILE_NAME}"`,
      // A minute at the edge: fresh enough to track a delivery, and a burst of visitors costs one
      // Drive read instead of one each.
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

function fail(reason: string): Response {
  return new Response(
    `The resume could not be read from its source: ${reason}.\n` +
      'See app/resume.pdf/route.ts in utopia-models/docs for how the source is resolved.\n',
    { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}
