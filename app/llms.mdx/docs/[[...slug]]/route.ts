import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';

// Was `revalidate = false`. A `.md` twin now carries generated values, so a build-time copy of it
// would be a stored copy of exactly the volatile facts this site stopped storing.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
// Several knowledge-base reads, each with its own 8s timeout.
export const maxDuration = 60;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = source.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

// No `generateStaticParams`: prerendering these would freeze the generated blocks at build time.
// The route is reached by proxy rewrite from `<path>.md` for every published page either way.
