'use client';

/*
 * `/` is a REWRITE of `/docs` (see `next.config.mjs`), so the root serves the docs index with a
 * `200` and no redirect. The rewrite is invisible to the server but NOT to the client router:
 * `usePathname()` reports the browser's `/`, which is not a node in the page tree. Measured on the
 * plain rewrite, before this provider existed — three things the index page owns went missing at
 * `/` while `/docs` rendered them correctly:
 *
 *   - the sidebar's own "Index" entry rendered `data-active="false"`
 *   - the table-of-contents panel was headed "On this page" instead of the page title
 *   - the "Architecture →" footer card was absent entirely
 *
 * Fumadocs resolves all three from `usePathname`, which it reads through its own framework context
 * rather than from Next directly — a documented extension point (`FrameworkProvider`, the same seam
 * its Tanstack and react-router adapters use). So the fix is to answer that one question correctly
 * for the one path the rewrite invents, and to delegate every other part of the framework to Next
 * exactly as `NextProvider` does.
 *
 * `/docs` and every page under it are untouched: the override fires only on a literal `/`.
 */
import { type Framework, FrameworkProvider } from 'fumadocs-core/framework';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname as useNextPathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

function usePathname(): string {
  const pathname = useNextPathname();
  return pathname === '/' ? '/docs' : pathname;
}

export function RootPathnameAsDocsIndex({ children }: { children: ReactNode }) {
  return (
    <FrameworkProvider
      usePathname={usePathname}
      useRouter={useRouter}
      useParams={useParams}
      // Identical to what `NextProvider` passes at runtime. The casts exist because Fumadocs types
      // its slots with `href`/`src`/`alt` optional while Next's components require them; upstream
      // hands over the same two components and its own `.d.ts` papers over the same gap.
      Link={Link as unknown as Framework['Link']}
      Image={Image as unknown as Framework['Image']}
    >
      {children}
    </FrameworkProvider>
  );
}
