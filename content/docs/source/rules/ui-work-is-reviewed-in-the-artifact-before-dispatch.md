---
title: "For UI work, the plan artifact IS the interface — built for real, iterated to Tyler's sign-off, THEN dispatched."
description: "Mirrored from the fleet knowledge base: _rules/ui-work-is-reviewed-in-the-artifact-before-dispatch.md"
updated: 2026-10-19
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/ui-work-is-reviewed-in-the-artifact-before-dispatch.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: ui-work-is-reviewed-in-the-artifact-before-dispatch
cases: [2026-08-15-render-the-ui-in-the-plan-artifact-before-dispatch, 2026-08-15-tyler-ui-taste-signals-for-data-surfaces, 2026-08-15-solve-coupled-parameters-numerically-not-by-guess, 2026-08-19-ui-plan-artifact-carries-the-mockup-not-prose, 2026-08-19-copy-the-mockups-markup-do-not-paraphrase-it, 2026-08-31-the-design-goes-in-the-subsections-that-exist, 2026-10-18-redesign-is-mocked-up-and-approved-before-it-is-filed, 2026-08-28-mirrored-tabs-are-the-artifact-template, 2026-08-31-a-tab-per-shape-lets-him-compare-by-toggling, 2026-08-28-diagrams-are-read-from-docs-not-redrawn, 2026-08-28-pre-built-current-state-beats-research-on-demand, 2026-08-30-current-state-not-before-state, 2026-08-30-the-artifact-has-four-fixed-sections-in-one-order, 2026-08-31-the-artifact-carries-architecture-not-my-reasoning]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-10-18
```

# For UI work, the plan artifact IS the interface — built for real, iterated to Tyler's sign-off, THEN dispatched.

## Fires when
A plan involves a **visual surface** (page, dashboard, component, layout, chart, map, brand surface) and I am about to describe it in prose, sketch a wireframe, paste a reference screenshot, or file it for a master to build. Also whenever a UI plan's artifact would contain a *description* of the interface rather than the interface. (The review criterion that ends step 2 lives in `ask-in-the-dialogue-not-in-prose`.)
🔴 **`architecture-artifact`'s default tabs** (#6276) call the diagrams the deliverable and the rest *"an extra he asks for"* — followed on a UI plan, the artifact has no UI in it. **The mockup is the subject** and ships in the FIRST publish.

## Trigger detail (full text — kept out of the always-loaded bundle)
A plan involves a **visual surface** — a page, dashboard, component, layout, chart, map, brand surface —
and I am about to describe it in prose, sketch a wireframe, paste a screenshot of the reference, or file
the work so a master can build it and show Tyler a URL. Also whenever the artifact for a UI plan is about
to contain a *description* of the interface rather than the interface. **The plan-review criterion that
ends step 2 for EVERY plan lives in `ask-in-the-dialogue-not-in-prose`.**

🔴 **AND WHILE BUILDING THE ARTIFACT, against `architecture-artifact`'s default tabs** (#6276). That
skill calls the before/after ARCHITECTURE diagrams the deliverable and the rest *"an extra he asks
for"* — follow it exactly on a UI plan and the artifact has no UI in it. **The mockup is the subject,
not the extra**, and it ships in the FIRST publish. The tell: a plan about a thing Tyler will LOOK at
whose artifact does not contain that thing.

## The rule
**Build the working UI inside the plan artifact at step 2, iterate it with Tyler until he says it is right,
and only then file.** Tyler, 2026-08-15: *"this is the first time I actually get to see the rendered UI in
the plan artifact, rather than waiting for the dispatch and seeing it live on a URL. I would much rather
prefer this for UI work."*

1. **Tab 1 of the artifact is the real interface**, not a mockup. Artifacts run real JS — canvas, animation,
   interaction, hand-positioned SVG all work. The CSP blocks external requests only, so **inline the assets
   and hand-build the piece rather than downgrading fidelity**: a globe was hand-written when no CDN library
   was reachable, and it was the whole point of the review.
2. **Republish the same file path** so the URL is stable and he watches one page evolve.
3. **State what is real and what is invented, leading with the strongest true statement** — and strengthen
   that caveat every time the fidelity increases.
4. 🔴 **The loop ends on Tyler CLICKING AN OPTION in an `AskUserQuestion` dialogue in step 2** — his
   words, 2026-08-22. The filed spec then names the approved artifact as the source to port from, which
   turns his approval into a specification instead of a wish. **The last `AskUserQuestion` of a planning
   session is *"here is the plan — file it, or change it first?"*, and it goes BEFORE the
   `file-issue.sh` call**, never after. **No click, no filing** — and a click on a different question
   does not count.
5. **Two failed eyeball corrections in a row → stop and solve it numerically.** Coupled layout parameters
   (tilt × zoom × offset) are not intuitable by eye; the projection math is already in the page, so sweep it
   and take the argmin.
6. **Read a motion complaint as TWO parameters** — rate and amplitude. "Too much" is usually amplitude;
   "doesn't animate" is often a period slowed past perception. His settled taste: near-still, low-amplitude,
   colour-rich, dots not pins, and **a theme picker rather than one hardcoded choice**.
7. **Draw every mockup at the REAL measured width, and measure before drawing.** A mockup at an invented
   width is a promise the page cannot keep: PLAN-187's artifact showed seven agent cards across using a
   hardcoded 7-column grid, Tyler asked for that compaction back, and the measurement showed seven cards
   need 1960px against the 972px the live grid gets — the layout he liked had never been possible.
8. **Name the surface a screenshot came from.** A `localhost` render shown without that word reads as the
   live site; Tyler replied *"I still see the same OCC?"* to a production page that had not changed.

## Cost when it fired
PLAN-175 ran **~15 UI iterations pre-dispatch** — dots → smooth heat → hexbin → choropleth → dot-density →
thermal → six themes, plus pins removed, animation repaired, framing re-solved, swatches fixed. Under the old
shape each of those is a dispatch → build → merge → deploy → look → re-dispatch cycle; here each was an edit
and a republish. The loop also **changed the plan's shape**: an audit found 6 of 8 requested components
already shipped, and "homepage" resolved to the ADMIN home rather than the public storefront root — which,
built as first read, would have deleted the catalog the ad spend points at. Two of the fifteen turns were
avoidable overshoot from tuning coupled parameters by eye; one Python sweep landed the framing first try.

**2026-08-19 (PLAN-197):** the rule was four days old and did not fire. The artifact for a plan about the
OCC's Utopia section shipped two Graphviz diagrams, four tables and ~900 words with **no picture of the
section**. Tyler asked for the views explicitly, then had to repeat it — *"mockup in the artifact"* — and
the four rendered views immediately produced the 972px measurement that killed the layout he had asked
for. The mockups were not decoration on the plan; they were the step that made the plan correct.

**2026-08-22 (PLAN-211):** the rule did not fire at all, because its trigger named only visual surfaces
and I classified the plan as infrastructure — decision records, read-status maps, a staleness gate —
despite its subject being a live website and an artifact published for him to look at. I filed a Feature,
five phases and three dispatch runs while the plan document still read *"NOT reviewed by Tyler yet, NOT
filed"*, a line I edited twice that session without acting on. **Four phases had closed before he asked**,
including one that consolidated 132 decision records across 74 directories. Two `AskUserQuestion` calls
went out that session, both on downstream details, neither on the plan. Tyler: *"why are you in step 4 if
we haven't even verified the plan?"* — then chose to let it run and rebuild the review as a fresh plan,
*"so that I can actually review architecture."*
