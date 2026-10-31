import { getPageImageUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { FixedHarness } from '@/components/prompt';
import { PageActions } from '@/components/page-actions';
import { pageHarness } from '@/lib/harness';
import type { Metadata } from 'next';
import { appName } from '@/lib/shared';
import { createRelativeLink } from 'fumadocs-ui/mdx';

// These pages carry GENERATED blocks (`<Generated id="..." />`, lib/generated/blocks.ts) that read
// the knowledge base on every request. Prerendering them would bake a value into the deployment and
// reintroduce exactly the stored copy this site's boundary rule forbids — a page that was true when
// it was built is the defect, not the fix. So the docs route renders at request time, with all four
// statements of intent below, and the CDN in front of it is told to hold nothing.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
// Several knowledge-base reads, each with its own 8s timeout.
export const maxDuration = 60;

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  /*
   * The INDEX page opens straight on its first heading (Tyler, 2026-08-30). Its frontmatter title
   * and description STAY — they drive the browser tab, the OG image and the `llms.txt` line, none
   * of which are this rendered block — but a landing page whose job is "copy a prompt" should not
   * spend its first screen restating its own name.
   */
  const isIndex = page.url === '/docs';

  return (
    // The Copy Markdown / Open ▾ row (knowledge#8065) replaces the Fumadocs scaffold toolbar that
    // #6243 removed: that one was two loose buttons placed ABOVE the title, so a page opened on
    // chrome. This one sits under the H1 and description, reads the same `.md` twin
    // (`app/llms.mdx/docs/[[...slug]]/route.ts`, reached as `<path>.md`), and copies through the
    // site's one clipboard path — `components/page-actions.tsx` says why each of those holds. The
    // index has no rendered H1, so there it is the first thing above the body.
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {!isIndex && <DocsTitle>{page.data.title}</DocsTitle>}
      {!isIndex && <DocsDescription>{page.data.description}</DocsDescription>}
      {/* The required `updated:` date (knowledge#10739) — also the first line of the `.md` twin. */}
      <p className="text-sm text-fd-muted-foreground" data-updated={page.data.updated}>
        Updated <time dateTime={page.data.updated}>{page.data.updated}</time>
      </p>
      <PageActions markdownUrl={`${page.url}.md`} />
      <DocsBody>
        {/* Every page but the root is Claude Code only — `pageHarness` (knowledge#8025). */}
        <FixedHarness harness={pageHarness(page.slugs)}>
          <MDX
            components={getMDXComponents({
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(source, page),
            })}
          />
        </FixedHarness>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // EVERY SHARE CARD IS THIS PAGE'S OWN (knowledge#8096). Next.js merges `openGraph` and `twitter`
  // SHALLOWLY and separately: declaring `openGraph` here replaced the layout's whole object (so
  // og:site_name and og:url vanished), while `twitter` was never declared here and was inherited
  // verbatim — every page's X card read "Utopia Models / 24X7 Engineering Operations" beside its own,
  // correct og: tags. So both objects are stated in full, from ONE set of values, and cannot disagree.
  const title = `${page.data.title} — ${appName}`;
  const description = page.data.description;
  const image = getPageImageUrl(page).url;

  return {
    title: page.data.title,
    description,
    // Stating `alternates` here replaces the layout's whole object, so the feed links are restated.
    alternates: {
      canonical: page.url,
      types: {
        'application/feed+json': [{ url: '/feed.json', title: 'Utopia Fleet Wiki — JSON Feed' }],
        'application/atom+xml': [{ url: '/feed.xml', title: 'Utopia Fleet Wiki — Atom' }],
      },
    },
    openGraph: {
      type: 'article',
      siteName: appName,
      url: page.url,
      title,
      description,
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image,
    },
  };
}
