import { source } from '@/lib/source';
// ocp.wiki renders `#nd-notebook-layout` with an `#nd-subnav` (measured in its served HTML
// on 2026-08-16), i.e. Fumadocs' NOTEBOOK layout in top-nav mode — not the docs layout.
// Ripping the shell means using the same one.
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { RootPathnameAsDocsIndex } from '@/components/root-pathname';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    // `/` rewrites here; the provider tells Fumadocs that pathname is `/docs` so the sidebar, the
    // TOC header and the footer card resolve on the root exactly as they do at `/docs`.
    <RootPathnameAsDocsIndex>
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions()}
        nav={{ ...baseOptions().nav, mode: 'top' }}
      >
        {children}
      </DocsLayout>
    </RootPathnameAsDocsIndex>
  );
}
