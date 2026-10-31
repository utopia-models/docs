import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/feed';

// Everything here is public on purpose, agents included (knowledge#10739). The search API is the one
// path with nothing to index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
