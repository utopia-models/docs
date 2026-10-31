import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import { track } from '@vercel/analytics/server';

/**
 * USAGE MEASUREMENT — one Web Analytics event per read of this site, counted on the server.
 * The same measurement as `proxy.ts` in utopia-models/work-hub (knowledge#8567).
 *
 * Many of this site's readers are agents and crawlers, and an agent fetching `/llms.txt` or a `.md` twin
 * runs no JavaScript, so the browser script in `app/layout.tsx` never sees it. This runs before
 * every page and every machine-readable route instead, and records who read what.
 *
 * Two properties, because that is what the plan stores per event:
 *   path    the pathname that was requested
 *   reader  `<tag>|<agent>` — the per-recipient link tag, then the user-agent class
 *
 * THE LINK TAG is `?r=<tag>` on any URL handed to a recipient (`/?r=resume`). It changes
 * nothing about what is served. A URL with no tag, or with one that is not a short lowercase slug,
 * counts as `untagged` — the value is never stored as typed, so a tag cannot be used to write
 * arbitrary text into the analytics store.
 *
 * It never delays or fails a read: the event is sent after the response, and `track` swallows its
 * own errors. How to query what this records: README, "Usage".
 */

const TAG = /^[a-z0-9][a-z0-9-]{0,31}$/;

/** First match wins, so the specific agents sit above the generic `Mozilla` every browser sends. */
const AGENTS: Array<[string, RegExp]> = [
  ['claude', /claude|anthropic/i],
  ['openai', /chatgpt|gptbot|oai-searchbot|openai/i],
  ['gemini', /google-extended|gemini|googleother/i],
  ['perplexity', /perplexity/i],
  ['cursor', /cursor/i],
  ['curl', /^curl\//i],
  ['wget', /^wget\//i],
  ['python', /python|httpx|aiohttp/i],
  ['node', /^node|undici|axios|got \(|bun\//i],
  ['go', /^go-http-client/i],
  ['crawler', /bot\b|crawl|spider|slurp|preview|facebookexternalhit/i],
  ['browser', /mozilla/i],
];

export function agentOf(userAgent: string | null): string {
  if (!userAgent) return 'none';
  return AGENTS.find(([, re]) => re.test(userAgent))?.[0] ?? 'other';
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  // A hover-prefetch is the router warming a link, not a read.
  const prefetch =
    request.headers.has('next-router-prefetch') || request.headers.get('purpose') === 'prefetch';
  if (request.method === 'GET' && !prefetch) {
    const r = request.nextUrl.searchParams.get('r') ?? '';
    const tag = TAG.test(r) ? r : 'untagged';
    event.waitUntil(
      track(
        'read',
        {
          path: request.nextUrl.pathname,
          reader: `${tag}|${agentOf(request.headers.get('user-agent'))}`,
        },
        { request },
      ),
    );
  }
  return NextResponse.next();
}

export const config = {
  // Pages, their machine-readable twins, and the resume the topbar links to. Not assets, not the
  // search API, not share images.
  matcher: ['/', '/changelog', '/feed.json', '/feed.xml', '/.well-known/agent-card.json', '/ocp/:path*', '/docs/:path*', '/docs.md', '/llms.txt', '/llms-full.txt', '/llms.mdx/:path*', '/resume.pdf'],
};
