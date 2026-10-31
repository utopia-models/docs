import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { HarnessNote, HarnessToggle, Pre$ } from '@/components/prompt';
import { Img } from '@/components/diagram';
import { Generated } from '@/components/generated';
import { Status } from '@/components/status';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // A fence tagged `title="prompt-N"` renders as a collapsed prompt card; every other code block
    // on the site falls through to the same Fumadocs `CodeBlock` as before.
    pre: Pre$,
    // An image under /diagrams/ is inlined as themed SVG in a scrolling box; every other image
    // falls through to Fumadocs' own. See components/diagram.tsx for why it is an `img` override.
    img: Img,
    HarnessToggle,
    HarnessNote,
    // The module status chip. Shown on the page rather than kept in frontmatter, because
    // frontmatter is invisible to the reader it is about. See components/status.tsx.
    Status,
    // A generated block: a volatile fact read from the knowledge base at request time rather than
    // typed into the page. The registry of what may be generated is lib/generated/blocks.ts.
    Generated,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
