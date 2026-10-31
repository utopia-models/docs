/**
 * The markdown half of the generated core — the `.md` twin of everything `components/generated.tsx`
 * renders as JSX, produced from the SAME `runBlock()` result at the same moment.
 *
 * This site is written for agents as much as for people: every page is served as raw markdown at the
 * same path with `.md` appended, and `/llms-full.txt` is the whole corpus in one fetch. A generated
 * fact that appeared only in the HTML would mean the two representations of one page disagree — and
 * the machine-readable one, which is the one a fleet of agents actually reads, would still be
 * carrying the stale value this phase exists to remove.
 */
import { BLOCK_IDS, type BlockResult, runBlock } from './blocks';

const cell = (s: string) => s.replace(/\|/g, '\\|');

function bodyMarkdown(r: BlockResult): string[] {
  const L: string[] = [];
  if (!r.body) return L;
  const b = r.body;
  if (b.kind === 'table') {
    L.push(`| ${b.head.map(cell).join(' | ')} |`);
    L.push(`| ${b.head.map(() => '---').join(' | ')} |`);
    for (const row of b.rows) L.push(`| ${row.map(cell).join(' | ')} |`);
    if (b.note) {
      L.push('');
      L.push(b.note);
    }
  } else if (b.kind === 'code') {
    L.push('```' + b.lang);
    for (const line of b.lines) L.push(line);
    L.push('```');
    if (b.note) {
      L.push('');
      L.push(b.note);
    }
  } else {
    for (const line of b.lines) L.push(line);
  }
  return L;
}

/** One block, as the markdown that replaces its tag in a `.md` twin. */
export function blockMarkdown(r: BlockResult): string {
  const L: string[] = [];
  if (r.error) {
    L.push(`> GENERATED — ${r.title}`);
    L.push('>');
    L.push(`> This block could not be read and therefore renders nothing: ${r.error}`);
  } else {
    L.push(...bodyMarkdown(r));
  }
  L.push('');
  L.push(
    `*Generated at request time (${r.readAt}) from \`utopia-models/knowledge\` @ \`${r.ref}\` — ` +
      r.sources.map((s) => `\`${s.path}\` (${s.what})`).join('; ') +
      '. Nothing here is stored: this page holds no copy of these values.*',
  );
  return L.join('\n');
}

/**
 * Substitute every `<Generated id="..." />` tag in a page's processed markdown.
 *
 * Fumadocs' processed markdown keeps an MDX component tag verbatim, so an unexpanded page would hand
 * an agent the literal string `<Generated id="fleet-accounts" />` — a pointer to a fact instead of
 * the fact. A tag naming an unregistered id is expanded too, into its own error: a silent passthrough
 * is how a typo would ship as an invisible hole in the corpus.
 */
export async function expandGenerated(markdown: string): Promise<string> {
  const tag = /<Generated\s+id=["']([^"']+)["']\s*\/>/g;
  const ids = [...markdown.matchAll(tag)].map((m) => m[1]);
  if (ids.length === 0) return markdown;

  const unique = [...new Set(ids)];
  const rendered = new Map<string, string>();
  await Promise.all(
    unique.map(async (id) => {
      rendered.set(id, blockMarkdown(await runBlock(id)));
    }),
  );
  return markdown.replace(tag, (_whole, id: string) => rendered.get(id) ?? _whole);
}

export { BLOCK_IDS };
