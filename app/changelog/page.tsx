import type { Metadata } from 'next';
import Link from 'next/link';
import { feedEntries } from '@/lib/feed';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Every change to this documentation, newest first. Also at /feed.json and /feed.xml.',
  alternates: { canonical: '/changelog' },
};

// The human face of the feed (knowledge#10739): the same entries `/feed.json` and `/feed.xml` serve,
// each anchored by its item id so a feed link lands on its own entry.
export default function Changelog() {
  const entries = feedEntries();
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Changelog</h1>
      <p className="mt-2 text-fd-muted-foreground">
        Every change to <Link href="/docs" className="underline">the fleet docs</Link>, newest first.
        Subscribe: <a href="/feed.json" className="underline">/feed.json</a> (JSON Feed 1.1) ·{' '}
        <a href="/feed.xml" className="underline">/feed.xml</a> (Atom).
      </p>
      {entries.length === 0 && <p className="mt-8">No entries yet.</p>}
      {entries.map((e) => (
        <section key={e.id} id={e.id} className="mt-10 border-t border-fd-border pt-6">
          <p className="text-sm text-fd-muted-foreground">
            <time dateTime={e.date}>{e.date}</time> · <code>{e.id}</code>
          </p>
          <h2 className="mt-1 text-xl font-semibold">{e.title}</h2>
          <p className="mt-2">{e.summary}</p>
          {e.pages.length > 0 && (
            <ul className="mt-3 list-disc ps-6">
              {e.pages.map((p) => (
                <li key={p}>
                  <a href={p} className="underline">{p}</a>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
