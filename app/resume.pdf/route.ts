/**
 * `/resume.pdf` — a 308 to the resume's one public URL, https://tyleryouk.com/resume.pdf (knowledge#10883).
 *
 * The resume moved to Tyler's personal domain: this host's root is the fleet wiki, and a corporate screener who
 * lands on "his own company" reads a flight risk. The Drive-proxy that served the PDF here (knowledge#8024, #8540)
 * now lives in utopia-models/tyleryouk-site `app/resume.pdf/route.ts`, unchanged. The topbar's `Resume` and every
 * copy of this URL already handed out keep working through this hop.
 *
 * A route handler rather than a `redirects()` entry on purpose: Next runs config redirects BEFORE `proxy.ts`, so a
 * config 308 would stop the usage event for `/resume.pdf` (proxy.ts matcher) from ever being recorded.
 *
 * Probe: curl -sI https://docs.utopiamodels.ai/resume.pdf | grep -iE '^(HTTP|location)'
 */
export const dynamic = 'force-dynamic';

const RESUME_URL = 'https://tyleryouk.com/resume.pdf';

export function GET() {
  return new Response(null, { status: 308, headers: { Location: RESUME_URL, 'Cache-Control': 'no-store' } });
}
