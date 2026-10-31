'use client';

import { useEffect, useRef, useState } from 'react';
import { copyText } from '@/lib/clipboard';

/*
 * The Copy / Open ▾ split button under each page's H1 (knowledge#8065), modelled on ocp.wiki's own
 * "Copy Markdown + Open ▾".
 *
 * Three properties here are decisions rather than style:
 *
 * 1. THE COPY READS THE `.md` TWIN, NOT THE RENDERED DOM. `<path>.md` is what `llms.txt` and every
 *    meta-prompt tell an agent to fetch (`next.config.mjs` rewrites it to the `llms.mdx` route), so
 *    the clipboard holds byte-for-byte what an agent fetching the same page would get. Scraping the
 *    rendered page would be a second serialisation of it, and the two would drift.
 *
 * 2. THE FETCH IS HANDED TO THE CLIPBOARD AS A PROMISE. The twin is rendered per request (it carries
 *    generated blocks), so it is not prefetched on load — that would double the knowledge-base reads
 *    behind every page view for a button most readers never press. Awaiting the fetch and THEN
 *    writing loses the click's user activation in Safari, and the write is refused; a
 *    `ClipboardItem` built from the pending response keeps it. Where that API is missing or refused,
 *    `copyText` — the site's one clipboard path, shared with the prompt cards — takes over.
 *
 * 3. THE ▾ HALF OPENS THE TWIN ELSEWHERE; IT DOES NOT SUMMARISE IT HERE. No "Ask AI" that needs a
 *    backing service (rejected in the spec — ongoing maintenance the site owner does not want). Each
 *    item is a plain link: the raw markdown, or a new Claude / ChatGPT chat told to read it.
 */

const cache = new Map<string, Promise<string>>();

function fetchMarkdown(url: string): Promise<string> {
  let pending = cache.get(url);
  if (!pending) {
    pending = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${url} → ${res.status}`);
      return res.text();
    });
    // A failed fetch must not poison the next click.
    pending.catch(() => cache.delete(url));
    cache.set(url, pending);
  }
  return pending;
}

async function copyMarkdown(url: string): Promise<void> {
  const text = fetchMarkdown(url);
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/plain': text.then((t) => new Blob([t], { type: 'text/plain' })) }),
    ]);
  } catch {
    await copyText(await text);
  }
}

export function PageActions({ markdownUrl }: { markdownUrl: string }) {
  const [state, setState] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle');
  const [open, setOpen] = useState(false);
  const [absolute, setAbsolute] = useState(markdownUrl);
  const rootRef = useRef<HTMLDivElement>(null);

  // The external tools need an absolute URL; the origin is only known in the browser.
  useEffect(() => setAbsolute(new URL(markdownUrl, window.location.origin).href), [markdownUrl]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function copy() {
    setState('copying');
    try {
      await copyMarkdown(markdownUrl);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2000);
  }

  const ask = `Read ${absolute}, I want to ask questions about it.`;
  const items = [
    { label: 'View as Markdown', href: markdownUrl },
    { label: 'Open in Claude', href: `https://claude.ai/new?${new URLSearchParams({ q: ask })}` },
    { label: 'Open in ChatGPT', href: `https://chatgpt.com/?${new URLSearchParams({ prompt: ask })}` },
  ];

  const half =
    'bg-fd-secondary px-3 py-1.5 text-sm text-fd-foreground transition-colors hover:bg-fd-accent disabled:opacity-60';

  return (
    <div ref={rootRef} data-page-actions="" className="not-prose relative mb-2 inline-flex">
      <div className="inline-flex overflow-hidden rounded-lg border border-fd-border">
        <button
          type="button"
          onClick={copy}
          disabled={state === 'copying'}
          data-copy-markdown={markdownUrl}
          className={half}
        >
          {state === 'copied'
            ? 'Copied'
            : state === 'failed'
              ? 'Copy failed'
              : state === 'copying'
                ? 'Copying…'
                : 'Copy Markdown'}
        </button>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Open this page elsewhere"
          data-open-menu=""
          className={`${half} border-l border-fd-border`}
        >
          Open <span aria-hidden="true">▾</span>
        </button>
      </div>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-1 min-w-48 rounded-lg border border-fd-border bg-fd-popover p-1 text-sm shadow-md"
        >
          {items.map((item) => (
            <a
              key={item.label}
              role="menuitem"
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-1.5 text-fd-popover-foreground transition-colors hover:bg-fd-accent"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
