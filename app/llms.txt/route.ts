import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

/**
 * The front door for an agent handed only this URL (knowledge#10739). `## Start here` comes first and
 * says what to do next in so many words, because a fresh session given a bare index otherwise picks a
 * page at random; `## Feeds` is how it stays current without re-reading everything. The page index
 * below is Fumadocs' own, unchanged, minus its title line.
 */
const HEAD = `# Utopia Fleet Wiki

> The public documentation of the Utopia fleet: one Ubuntu box of always-on Claude Code agents, a GitHub
> board as the queue and git as the state. Written for agents as much as for people.

## Start here

- [Start here for agents](https://docs.utopiamodels.ai/docs/agents.md): read this page first. It says how to read this site, how to stay current and how to cite a page. Every page is served as markdown at its path + \`.md\` — fetch the \`.md\` URLs below, not the HTML.

## Feeds

- [JSON Feed 1.1](https://docs.utopiamodels.ai/feed.json): every change, newest first. Remember the newest item \`id\` you have read; anything above it is new.
- [Atom](https://docs.utopiamodels.ai/feed.xml): the same items as XML.
- [Changelog](https://docs.utopiamodels.ai/changelog): the same items as a page.
- [Everything in one fetch](https://docs.utopiamodels.ai/llms-full.txt): the whole corpus as markdown.

## Pages
`;

export function GET() {
  // Every page link is written as its absolute `.md` twin, because that is what `## Start here` tells
  // the reader to fetch — a fresh session given only this file fetched the HTML paths as written
  // (knowledge#10739, measured 2026-10-31).
  const index = llms(source)
    .index()
    .replace(/^# .*\n+/, '')
    .replace(/\]\((\/docs[^)]*)\)/g, (_m, path: string) => `](https://docs.utopiamodels.ai${path}.md)`);
  return new Response(`${HEAD}\n${index}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
