import { getLLMText, source } from '@/lib/source';

// The whole corpus in one fetch — including its generated blocks, which is why it cannot be built
// once and served forever.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
// Several knowledge-base reads, each with its own 8s timeout.
export const maxDuration = 60;

export async function GET() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
