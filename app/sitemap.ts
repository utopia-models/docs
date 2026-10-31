import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { feedEntries, SITE } from '@/lib/feed';

// Every docs page with the date it last changed (its required `updated:` frontmatter), plus the
// changelog (knowledge#10739).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((p) => ({
    url: `${SITE}${p.url}`,
    lastModified: p.data.updated,
  }));
  const latest = feedEntries()[0]?.date;
  return [...pages, { url: `${SITE}/changelog`, ...(latest ? { lastModified: latest } : {}) }];
}
