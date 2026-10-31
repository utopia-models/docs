import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

const ctaClass =
  'inline-flex items-center rounded-full bg-fd-primary px-3 py-1 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // `nowrap`: the header splits into two `flex-1` halves, so with the mobile pill beside it the
      // title wrapped onto three lines at 320px. Unwrapped, its half grows to fit and the icons take the rest.
      title: <span className="whitespace-nowrap">{appName}</span>,
      // Below `lg` Fumadocs hides every text link in the header (`max-lg:hidden`) and moves them into
      // the drawer behind the "Open Sidebar" icon — which reads as a page tree, not a menu, so a
      // recruiter on a phone (the population this site exists to serve) had no visible way to the
      // resume (knowledge#8088). `nav.children` renders in the header's always-visible title block,
      // so the pill is repeated there for small screens only; `lg:hidden` hands back to the link below
      // at the width where it shows. `ms-auto` pins it to the right, beside the search/menu icons.
      children: (
        // The wrapper's `ps-3` is the gap to the title: that block has no `gap`, and at 320px `ms-auto`
        // has no free space to push with, so without it the pill butted against "Wiki".
        <div className="ms-auto me-1 shrink-0 ps-3 lg:hidden">
          <a href="/resume.pdf" data-nav-cta-mobile="" className={ctaClass}>
            Resume
          </a>
        </div>
      ),
    },
    // `Resume` (knowledge#8024) is the way back from the evidence to the document it backs: this site
    // exists to substantiate the resume's fleet bullet. `external` makes it a real `<a>` —
    // `/resume.pdf` is a route handler 308-ing to https://tyleryouk.com/resume.pdf (knowledge#10883), which a
    // client-side Next navigation cannot follow. Relative on purpose: the hop through this host is what proxy.ts counts.
    //
    // It renders as a filled pill (knowledge#8065), modelled on ocp.wiki's own nav CTA. The pill is
    // the `text`, not a `custom` item: Fumadocs still renders the `<a>` — same href, same slot in this
    // array, same entry in the mobile menu — so the change is visual only, which is all it was meant
    // to be. `text-fd-primary-foreground` on the span wins over the anchor's hover colour, so the
    // label stays legible on the fill in both themes.
    links: [
      {
        text: (
          <span
            data-nav-cta=""
            className={ctaClass}
          >
            Resume
          </span>
        ),
        url: '/resume.pdf',
        external: true,
      },
    ],
    // The site's own source, public since knowledge#10761 (a fresh repo: the private docs-wiki's history
    // held personal data its tree did not).
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
