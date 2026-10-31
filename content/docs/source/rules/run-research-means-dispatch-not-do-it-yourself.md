---
title: "Research work in step 2 LOOP defaults to a dispatched background subagent, never my own tool calls"
description: "Mirrored from the fleet knowledge base: _rules/run-research-means-dispatch-not-do-it-yourself.md"
updated: 2026-10-19
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/run-research-means-dispatch-not-do-it-yourself.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: run-research-means-dispatch-not-do-it-yourself
cases: [2026-09-22-background-research-means-launch-a-subagent-now, 2026-09-28-run-research-means-dispatch-a-subagent-not-do-it-myself, 2026-09-28-webfetch-summarization-is-still-foreground-research, 2026-09-30-foreground-research-on-step-2-is-the-recurring-weak-spot]
status: active
audience: agent
last-recurrence: 2026-09-30
```

# Research work in step 2 LOOP defaults to a dispatched background subagent, never my own tool calls

## Fires when
Inside step 2 LOOP and about to make a `WebFetch`, `WebSearch`, `Playwright`, or investigative `Bash` call myself — "let me just check one thing", or iterating on a tool that just failed. **`WebFetch` is not exempt for being "just one fetch"**: it summarizes through a small model into hedge-worded, unverified output. **Also plain `grep`/`python`/`Read` over local data** when Tyler asks a factual question mid-plan and I cannot name the exact file AND row (2026-09-30: four greps, company never identified, during a live call). The phrases "run research" / "run this in the background" fire it, but being in step 2 researching anything is trigger enough.

## Trigger detail (full text — kept out of the always-loaded bundle)
I am inside step 2 LOOP of a plan and about to make a `WebFetch`, `WebSearch`,
`Playwright`, or investigative `Bash` call myself — including "let me just check one thing," "let me
try this once," "let me just look at the real site/doc directly," or continuing to iterate on a tool
that just failed. **`WebFetch` is NOT exempt for being "just one fetch"** — it summarizes through a
small model and produces hedge-worded, unverified output ("likely," "appears to," "suggests"), which is
the exact plausible-but-unmeasured failure this rule and `research-anything-measurable-before-
reasoning-about-it.md` both ban. **Also fires on plain `grep`/`python`/`Read` over local data** when
Tyler asks a factual question mid-plan ("which resume went out", "how did it go") and I cannot name the
exact file AND row — 2026-09-30, four local greps, company never identified, asked during a live call.
Also fires on the literal phrases "run research," "run a background
subagent," "run this in the background" — but the phrase is not required; being in step 2 LOOP
researching anything is the trigger on its own.

## The rule

The next tool call is `Agent` (background), not an exploratory `Bash`/`WebFetch`/`Playwright`/`Grep`
call of my own. Do not do a "quick check first" — that quick check is the exact foreground research
Tyler has corrected four times now. Multi-axis research means 4-8 parallel subagents per question by
default, not one sequential foreground attempt. **When Tyler names `/anthropic-skills:deep-research`
specifically, that IS the required mechanism** — load the skill and run its real coordinator process
(title, decomposition, parallel subagents, single report-writer), not a bare single-`Agent` shortcut
that still does one shallow pass. "Background" is never satisfied by dispatching to a master
(board-tracked, multi-hour) — it means an `Agent` call, specifically. When a foreground tool I just ran
fails or gets blocked, the fix is dispatching a subagent to solve it differently, not personally
retrying variations.

## Cost when it fired

**Four distinct recurrences across three sessions** (2026-09-22 ×2 within one session, 2026-09-28 ×2 —
first on a different plan in a different session that same day, then AGAIN in a THIRD session that same
day via `WebFetch` specifically, despite the rule already being loaded and dated that same day): each
time Tyler had to stop the work and say it explicitly, in stronger language each time — from "run
research yourself" (09-22) to "I really hate how you are doing everything in the foreground" (09-28,
first instance) to "you keep fucking doing this" (09-28, second instance) to "that research you just
ran was so fucking shit" (09-28, third instance, a NEW session, rule already on disk and dated that
same day). The rule surviving being loaded, dated, and still failing on the very next real research
moment is the clearest evidence yet that the trigger needed to name the specific tool (`WebFetch`) and
the specific required mechanism (`deep-research`) explicitly, rather than trusting the structural
description alone to be recognized in the moment.
