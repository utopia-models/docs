import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { defineCollections, defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';
import { expandGenerated } from '@/lib/generated/markdown';
import { expandAsk, pageHarness } from '@/lib/harness';

/**
 * `updated` is REQUIRED on every page (knowledge#10739): a reader — above all an agent deciding whether
 * its cached copy is stale — needs the date a page last changed, on the page and in its `.md` twin.
 * A page without it fails the build; `scripts/check-updated.sh` fails a PR that edits an `.mdx` page
 * without bumping it.
 */
const ISO_DATE = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'updated: must be YYYY-MM-DD');

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({ updated: ISO_DATE }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/**
 * THE CHANGELOG — the feed's only source (knowledge#10739). One file per entry,
 * `content/changelog/YYYY-MM-DD-<slug>.mdx`; `/changelog`, `/feed.xml` and `/feed.json` all read this one
 * collection, so the page and both feeds cannot disagree. An entry's id is its file slug, which never
 * changes once published: a feed reader dedupes on it.
 */
export const changelog = defineCollections({
  type: 'doc',
  dir: 'content/changelog',
  schema: z.object({
    title: z.string(),
    date: ISO_DATE,
    // the docs paths the entry changed, e.g. `/docs/agents`
    pages: z.array(z.string()).default([]),
    summary: z.string(),
  }),
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImageUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: '/' + [page.locale, ...docsImageRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: '/' + [page.locale, ...docsContentRoute.split('/'), ...segments].filter(Boolean).join('/'),
  };
}

/**
 * The markdown a machine reads — `<path>.md`, `/llms-full.txt`.
 *
 * `expandGenerated` substitutes every `<Generated id="..." />` tag with the value read from the
 * knowledge base at this instant. Without it the twin would hand an agent the literal tag: the two
 * representations of one page would disagree, and the machine-readable one — the one this site's
 * agent readers actually fetch — would be the poorer of the two.
 *
 * `expandAsk` does the same for `{{ASK}}`, the token a meta prompt writes where it needs to name
 * the reader's own interactive-question tool. On the page that token becomes whatever the harness
 * toggle is set to; here there is no toggle, so it becomes the LOOKUP across all six rather than
 * any one harness's answer. Picking one would reintroduce the exact defect this token exists to
 * kill — one harness's tool name handed to every reader — in the representation an agent fetches.
 *
 * That lookup is the ROOT's alone now: every other page is written for Claude Code only
 * (`pageHarness`, knowledge#8025), so its twin expands the token to Claude Code's tool, exactly as
 * its rendered page does.
 */
export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = expandAsk(
    await expandGenerated(decodeCharRefs(await page.data.getText('processed'))),
    pageHarness(page.slugs),
  );

  return `# ${page.data.title} (${page.url})

Updated: ${page.data.updated}

${processed}`;
}

/**
 * Undo the serializer's character references (knowledge#10739). Fumadocs' processed markdown runs through
 * mdast-util-to-markdown, which writes a `*`, `` ` `` or `)` it considers ambiguous as `&#x2A;`, `&#x60;`,
 * `&#x29;`. A browser would decode them; an agent reading the `.md` twin does not, so the live corpus
 * carried 63 of them — `**bold**` read as `**bold*&#x2A;`, and one link's closing paren became part of
 * its URL (`/docs/operating/dispatch-runtime&#x29;`, a dead link). The source `.mdx` holds the real
 * character every time, so decoding restores exactly what the author wrote. A literal `&#x2A;` typed in
 * a page reaches here as `&amp;#x2A;` and is left alone.
 */
export function decodeCharRefs(markdown: string): string {
  return markdown.replace(/&#x([0-9a-f]{1,6});/gi, (_m, hex: string) =>
    String.fromCodePoint(parseInt(hex, 16)),
  );
}
