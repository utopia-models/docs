import fs from 'node:fs';
import path from 'node:path';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { ComponentProps } from 'react';

/*
 * Diagrams: an `img` override, so the MDX source stays plain markdown.
 *
 * 🔴 NO PAGE EMBEDS A DIAGRAM TODAY. The six embeds and the six SVGs came off on 2026-08-17
 * (#6242) because the generated pictures read badly on the live site. This override is therefore
 * inert — every `img` falls through to `Fallback` — and it is kept deliberately: it is the site's
 * only mechanism for inlining an SVG into a page, and PLAN-196 needs exactly that for an
 * `Architecture Diagrams` tab. Do not delete it as dead code; it would be rebuilt days later.
 *
 * Four properties here are decisions rather than style choices.
 *
 * 1. THE MDX WRITES `![caption](/diagrams/<name>.svg)` — ordinary markdown, no new component.
 *    `getLLMText()` emits *processed* markdown and leaves JSX standing (ADR-178/004), so a
 *    `<Diagram/>` element would arrive in `/docs.md` and `/llms-full.txt` — the exact payload
 *    prompts 2-5 tell a stranger's agent to fetch — as a meaningless tag. A markdown image comes
 *    out the other side as a markdown image, pointing at a URL that really serves the file.
 *
 * 2. THE SVG IS INLINED, NOT `<img src>`. An `<img>` is an isolated document: it cannot see the
 *    page's `--color-fd-*` tokens, so it can only follow `prefers-color-scheme` and would fight
 *    the site's own theme toggle. Inlined, the `<style>` block the generator injects resolves
 *    against the real theme. The same file still serves standalone at its URL, because every
 *    element also carries a literal light-theme colour as a presentation attribute.
 *
 * 3. IT KEEPS ITS REAL WIDTH INSIDE A SCROLLING BOX. `max-width:none` lives in app/global.css,
 *    keyed on the `.fd-diagram` class the generator puts on the SVG root. Shrunk to fit, a 1180px
 *    diagram lands at 353px on a phone and every label in it becomes unreadable — scrolling a
 *    readable diagram beats seeing all of an illegible one.
 *
 * 4. IT RENDERS SPANS, NOT A `<figure>`. Markdown wraps an image in a paragraph, and a `<figure>`
 *    inside a `<p>` is one the HTML parser splits the paragraph around — so the server's markup
 *    and the browser's tree disagree and React throws #418 (hydration failed), measured here
 *    before this was changed. `display:block` spans nest legally and look identical.
 *
 * 5. NOTHING HERE IS HAND-DRAWN. `public/diagrams/*.svg` is written by
 *    `_infra/scripts/gen-wiki-diagrams.py` in utopia-models/knowledge, out of components.yaml,
 *    organization.yaml, the dispatch scripts, planning-loop.md, the ADR frontmatter and this
 *    site's own surfaces table. Re-run it; never edit a file under public/diagrams by hand.
 */

const DIAGRAM = /^\/diagrams\/([a-z-]+)\.svg$/;

const Fallback = defaultMdxComponents.img as (props: ComponentProps<'img'>) => React.ReactNode;

export function Img(props: ComponentProps<'img'>) {
  const match = typeof props.src === 'string' ? DIAGRAM.exec(props.src) : null;
  if (!match) return <Fallback {...props} />;

  // Read at build time. A missing file throws the build rather than rendering a blank figure:
  // a diagram that silently disappears is the failure mode this whole phase exists to prevent.
  const svg = fs.readFileSync(
    path.join(process.cwd(), 'public', 'diagrams', `${match[1]}.svg`),
    'utf8',
  );

  return (
    <span
      data-diagram={match[1]}
      className="not-prose my-6 block overflow-hidden rounded-xl border border-fd-border bg-fd-card"
    >
      <span className="block overflow-x-auto p-4" dangerouslySetInnerHTML={{ __html: svg }} />
      {props.alt ? (
        <span className="block border-t border-fd-border px-4 py-2 text-sm text-fd-muted-foreground">
          {props.alt}
        </span>
      ) : null}
    </span>
  );
}
