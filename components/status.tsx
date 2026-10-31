/*
 * The module status chip.
 *
 * WHAT IT CLAIMS. Not "how finished is this page" — how settled is the THING the page describes. A
 * module here documents a real component of a running fleet, and those components are at genuinely
 * different stages: one is two scripts with four test harnesses around them, another is a single
 * instance permitted by an amendment to the rule that forbids its whole class. A reader deciding
 * whether to copy something needs to know which of those they are reading, and the frontmatter is
 * invisible to them, so the claim goes on the page.
 *
 * THE THREE VALUES, and the evidence each one is asserted from — stated here rather than in a
 * legend on some page, because a legend on a page is a second place for this to drift:
 *
 *   stable        the mechanism is in a repository, bound by assertions that re-check on every pull
 *                 request, and exercised by tests.
 *   in-flux       it works, and its own documentation carries open defects — or part of it lives
 *                 outside any repository with nothing comparing the two.
 *   experimental  one instance, no second implementation, and the rules were amended to permit it.
 *
 * EVERY PAGE STATES ITS OWN REASON under the badge, in one sentence naming the specific evidence.
 * The word alone is a rating; the word plus its reason is a claim someone can argue with, which is
 * the only kind worth publishing.
 *
 * `value` IS REQUIRED, deliberately. The component shipped with a default, and a default here is a
 * badge that asserts something nobody chose — the exact shape of the unearned confidence the rest of
 * this site is written against.
 */

/** Dot colour per value. An unrecognised value renders neutral rather than guessing. */
const DOT: Record<string, string> = {
  stable: 'bg-emerald-500',
  'in-flux': 'bg-amber-500',
  experimental: 'bg-violet-500',
};

export function Status({ value }: { value: string }) {
  return (
    <p
      data-status={value}
      className="not-prose mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-secondary px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fd-muted-foreground"
    >
      <span
        className={`inline-block size-1.5 rounded-full ${DOT[value] ?? 'bg-fd-muted-foreground'}`}
        aria-hidden
      />
      {value}
    </p>
  );
}
