import { feedEntries, SITE } from '@/lib/feed';
import { appName } from '@/lib/shared';

// JSON Feed 1.1 (https://jsonfeed.org/version/1.1), written directly — the format is a plain object,
// so a library would add a dependency and nothing else (knowledge#10739). An agent polls this and
// remembers the newest `id` it has seen; everything above that id in the list is new to it.
export const revalidate = false;

export function GET() {
  const body = {
    version: 'https://jsonfeed.org/version/1.1',
    title: appName,
    home_page_url: SITE,
    feed_url: `${SITE}/feed.json`,
    description:
      'Every change to the Utopia fleet documentation, newest first. Poll by item id; fetch any page as markdown by appending .md.',
    language: 'en',
    authors: [{ name: 'Utopia Models', url: 'https://utopiamodels.ai' }],
    items: feedEntries().map((e) => ({
      id: e.id,
      url: e.url,
      title: e.title,
      summary: e.summary,
      content_text: [e.summary, '', ...e.pages.map((p) => `${SITE}${p}`)].join('\n'),
      date_published: `${e.date}T00:00:00Z`,
      tags: e.pages,
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  });
}
