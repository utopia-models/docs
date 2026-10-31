import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * The pages that moved out of the flat `content/docs/` list, and the module folder each landed
 * in. One map, read by `redirects()` — the folder names are also `content/docs/meta.json`'s `pages`,
 * so a page moved between modules without updating this line is a 308 pointing at a 404.
 */
const MOVED = {
  architecture: 'structure',
  surfaces: 'structure',
  decisions: 'structure',
  operations: 'operating',
  work: 'operating',
};

/**
 * Pages that stopped existing under their old path when every module but the root became Claude
 * Code only (knowledge#8025). `operating/harnesses` ("More than one harness") was deleted — its whole
 * subject was running several harnesses side by side — and its nearest surviving page is the skills
 * layer, which now says where a Claude Code skill lives. Both old URLs were public, so they 308
 * rather than 404.
 */
const RETIRED = {
  harnesses: 'structure/skills-layer',
  'operating/harnesses': 'structure/skills-layer',
};

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // THE SIX PAGES MOVED INTO MODULES, AND THE OLD URLS ARE PUBLIC (2026-09-04, PLAN-281 P3 —
  // knowledge#7509). The flat `content/docs/` list became two module folders, so `/docs/architecture`
  // is now `/docs/structure/architecture`. Every reference INSIDE this repo was rewritten in the same
  // commit, but the old URLs did not only live here: they were published in `/llms.txt` and crawled,
  // and `https://docs.utopiamodels.ai/docs/architecture#the-vocabulary` was written into a published
  // prompt whose whole purpose was to be pasted into a READER'S own agent, so copies of that URL exist
  // on machines this repo cannot reach and cannot fix.
  //
  // This is not the root redirect P1 deleted. That one made a healthy documentation host answer its
  // OWN front door with a hop, which is why `/` is a rewrite and stays one. These are moved-resource
  // redirects on six paths that genuinely moved, which is the one thing a 308 is for.
  //
  // The `.md` twin needs its own entry: redirects run BEFORE rewrites in Next, so `/docs/architecture`
  // never matches `/docs/architecture.md`. Redirecting the twin to `/docs/structure/architecture.md`
  // hands it to the `/docs/:slug*.md` rewrite below on the second pass.
  async redirects() {
    const moved = Object.entries(MOVED).map(([from, to]) => [from, `${to}/${from}`]);
    return [...moved, ...Object.entries(RETIRED)].flatMap(([from, to]) => [
      { source: `/docs/${from}`, destination: `/docs/${to}`, permanent: true },
      { source: `/docs/${from}.md`, destination: `/docs/${to}.md`, permanent: true },
    ]);
  },
  // THE ROOT IS A REWRITE, NOT A REDIRECT (2026-09-04, PLAN-281 P1 — knowledge#7509).
  //
  // This host was retired 2026-08-30 (`proxy.ts`, 301 everything to school.utopiamodels.ai) because
  // 5am was being pushed as an agency. 5am is now frozen, so the fold-in has no reason left and the
  // proxy is deleted. What replaces it is NOT the pre-retirement root redirect.
  //
  // Before retirement `/` served a 307 to `/docs`, mirroring ocp.wiki. That shape makes the root of a
  // documentation host answer with a redirect, and a checker that reads the first code and expects
  // `200` calls a healthy surface broken — this site's own `/docs/structure/surfaces` page carries
  // that exact row as its worked example. The un-retirement acceptance (#26) is `200` at `/` with no redirect
  // anywhere in the chain, so the root now REWRITES to `/docs`: same page, same content, one hop
  // fewer, and the URL a reader shares still resolves to what they were reading.
  //
  // ocp.wiki serves a raw-markdown twin of every page at `<path>.md`; Fumadocs' own route emits it at
  // `/llms.mdx/docs/<path>/content.md`. Both shapes now resolve to the same handler, so a reader (or an
  // agent fanning subagents over `llms.txt`) can append `.md` to any published path, which is the shape
  // PLAN-178's acceptance names. Not a redirect — the `.md` URL serves the markdown directly.
  async rewrites() {
    return [
      { source: '/', destination: '/docs' },
      { source: '/docs.md', destination: '/llms.mdx/docs/content.md' },
      { source: '/docs/:slug*.md', destination: '/llms.mdx/docs/:slug*/content.md' },
    ];
  },
  // Since PLAN-211 P5 the docs pages carry generated blocks that read the knowledge base per request,
  // so they must never be served from a copy — and neither may both of their machine-readable twins. `force-dynamic` governs the RENDER; this
  // governs every cache in front of it. A Vercel route marked ƒ (Dynamic) has been measured serving a
  // previous deployment's HTML from the edge, so being dynamic is not on its own sufficient — a
  // generated value behind a CDN copy is a stored copy, which is the one property this site trades
  // everything else for.
  async headers() {
    const noStore = [
      { key: 'Cache-Control', value: 'no-store, must-revalidate' },
      { key: 'CDN-Cache-Control', value: 'no-store' },
      { key: 'Vercel-CDN-Cache-Control', value: 'no-store' },
    ];
    return [
      // `/` is a REWRITE of `/docs`, so header matching sees the literal `/` and the rule below does
      // not cover it. The root serves the docs index — same per-request generated blocks, same rule.
      { source: '/', headers: noStore },
      { source: '/docs/:path*', headers: noStore },
      { source: '/docs.md', headers: noStore },
      { source: '/llms.mdx/:path*', headers: noStore },
      { source: '/llms-full.txt', headers: noStore },
    ];
  },
};

export default withMDX(config);
