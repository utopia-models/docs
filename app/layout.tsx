import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { appName } from '@/lib/shared';

const inter = Inter({
  subsets: ['latin'],
});

// knowledge#8114 — theme-color lives in `viewport`, not `metadata`, since Next 14 split them.
// Colors are this site's own `--color-fd-background` tokens (app/global.css), confirmed against
// the live OG card background (`curl -s .../og/docs/structure/architecture/image.png` samples
// solid #0c0c0c) — not invented, the value already rendered everywhere on the dark-by-default site.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0d' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s — ${appName}`,
  },
  description:
    'The public, fully open documentation of the Utopia fleet — how it is built, how work flows through it, and what is actually running.',
  metadataBase: new URL('https://docs.utopiamodels.ai'),
  // `<link rel="alternate">` — a feed reader or an agent given any page finds the feed from it
  // (knowledge#10739).
  alternates: {
    types: {
      'application/feed+json': [{ url: '/feed.json', title: 'Utopia Fleet Wiki — JSON Feed' }],
      'application/atom+xml': [{ url: '/feed.xml', title: 'Utopia Fleet Wiki — Atom' }],
    },
  },
  // knowledge#PLAN-246 — Tyler, 2026-08-28: *"could you put the same message / link preview for Utopia
  // models utopiamodels.ai for docs.utopiamodels.ai so that I can put it on my LinkedIn."* Before this,
  // this site served ZERO og: tags, so LinkedIn rendered a bare card with no image.
  //
  // 🔴 `og:image` is NOT declared here on purpose. Next.js file-based metadata discovers
  // `app/opengraph-image.tsx` and injects og:image + width/height/type/alt automatically; declaring one
  // here would OVERRIDE the generated card with a static URL and silently win.
  // 🔴 The card says "Utopia Models / 24X7 Engineering Operations", NOT `appName`
  // ("Utopia Fleet Wiki"). Tyler asked for the SAME preview as utopiamodels.ai, and that is the
  // wording on the LinkedIn Featured card he showed. `appName` remains the site's own title.
  // ⚠ These are only the FALLBACK card (routes with no metadata of their own). Every docs page —
  // `/` included, since it rewrites to `/docs` — states its own og: and twitter: set in full in
  // `app/docs/[[...slug]]/page.tsx` (knowledge#8096); change the per-page card there, not here.
  openGraph: {
    type: 'website',
    siteName: 'Utopia Models',
    title: 'Utopia Models',
    description: '24X7 Engineering Operations',
    url: 'https://docs.utopiamodels.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utopia Models',
    description: '24X7 Engineering Operations',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {/*
          DARK BY DEFAULT (Tyler, 2026-08-30). `defaultTheme` is what a visitor with no stored
          preference and no OS signal gets; `enableSystem={false}` is what stops next-themes from
          overriding it with the OS setting on first paint. Both are needed — `defaultTheme` alone
          loses to a light-mode OS, which is the common case on a work laptop. The toggle still works
          and the choice still persists.
        */}
        <RootProvider theme={{ defaultTheme: 'dark', enableSystem: false }}>
          {children}
        </RootProvider>
        {/* Browser pageviews. Agents run no script — `proxy.ts` counts those. See README, Usage. */}
        <Analytics />
      </body>
    </html>
  );
}
