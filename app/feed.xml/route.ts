import { Feed } from 'feed';
import { feedEntries, SITE } from '@/lib/feed';
import { appName } from '@/lib/shared';

// The Atom twin of `/feed.json` (knowledge#10739) — same entries, same ids, for readers that want XML.
export const revalidate = false;

export function GET() {
  const entries = feedEntries();
  const feed = new Feed({
    id: `${SITE}/`,
    link: SITE,
    title: appName,
    description: 'Every change to the Utopia fleet documentation, newest first.',
    copyright: 'Utopia Models',
    language: 'en',
    updated: entries[0] ? new Date(`${entries[0].date}T00:00:00Z`) : new Date(0),
    feedLinks: { atom: `${SITE}/feed.xml`, json: `${SITE}/feed.json` },
    author: { name: 'Utopia Models', link: 'https://utopiamodels.ai' },
  });
  for (const e of entries) {
    feed.addItem({
      // Atom requires an IRI id; the entry's own anchor URL ends in the same permanent slug that
      // `/feed.json` uses as its item id.
      id: e.url,
      link: e.url,
      title: e.title,
      description: e.summary,
      content: [e.summary, ...e.pages.map((p) => `${SITE}${p}`)].join('\n'),
      date: new Date(`${e.date}T00:00:00Z`),
    });
  }
  return new Response(feed.atom1(), {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
}
