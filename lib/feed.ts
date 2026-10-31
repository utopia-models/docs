import { changelog } from '@/lib/source';

export const SITE = 'https://docs.utopiamodels.ai';

export interface FeedEntry {
  /** the file slug, e.g. `2026-10-30-docs-feed` — the item id, stable forever */
  id: string;
  url: string;
  title: string;
  date: string;
  pages: string[];
  summary: string;
}

/**
 * Every changelog entry, newest first. ONE reader for `/changelog`, `/feed.xml` and `/feed.json`
 * (knowledge#10739), so the page and both feeds cannot list different things.
 */
export function feedEntries(): FeedEntry[] {
  return changelog.entries
    .map((e) => {
      const id = e.info.path.replace(/\.mdx?$/, '').split('/').pop()!;
      return {
        id,
        url: `${SITE}/changelog#${id}`,
        title: e.title,
        date: e.date,
        pages: e.pages,
        summary: e.summary,
      };
    })
    .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
}
