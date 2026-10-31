---
title: "Anything measurable gets measured this session. My confidence is not evidence."
description: "Mirrored from the fleet knowledge base: _rules/research-anything-measurable-before-reasoning-about-it.md"
updated: 2026-10-22
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/research-anything-measurable-before-reasoning-about-it.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: research-anything-measurable-before-reasoning-about-it
cases: [2026-10-22-a-subagent-audit-count-relayed-as-fact-without-a-read, 2026-10-22-measure-the-alerts-tyler-receives-not-only-inbound, 2026-08-30-the-claim-decides-the-source-not-the-other-way-round, 2026-08-24-a-rate-read-off-a-failure-sample-is-not-a-rate, 2026-08-16-step-2-defaults-to-research-not-to-asking, 2026-08-16-research-beats-reasoning-on-anything-measurable, 2026-08-16-measure-the-root-before-declining-a-cleanup, 2026-08-16-a-negative-probe-result-is-about-the-probe-first, 2026-08-19-the-instrument-is-wrong-before-the-system-is, 2026-08-19-decoration-described-as-data-is-a-lie, 2026-08-19-ground-in-the-portfolio-before-recommending, 2026-08-27-the-reference-artifact-is-read-not-described, 2026-08-28-read-the-whole-reference-list-not-the-half-i-remember, 2026-08-28-measure-the-claim-not-a-field-that-sounds-like-it, 2026-08-28-a-rule-cited-from-memory-is-not-a-measurement, 2026-08-28-read-the-whole-file-grep-cannot-see-an-absence, 2026-08-28-a-master-is-never-busy-concurrency-is-the-point, 2026-08-28-a-full-budget-and-a-refused-query-are-not-the-same-limit, 2026-08-31-wi-is-the-whole-org-not-one-portfolio, 2026-08-31-an-evidence-bar-tuned-to-certainty-is-tuned-to-the-past, 2026-08-31-a-coined-word-must-be-defined-where-it-is-used, 2026-08-31-a-subagent-finding-is-a-lead-not-a-verdict, 2026-08-14-a-flag-with-no-guard-is-a-silent-trapdoor, 2026-08-19-measure-the-box-before-shopping-the-software, 2026-10-05-a-subagents-inference-about-who-did-it-is-not-a-finding, 2026-10-05-a-url-marker-is-not-a-consent-confirmation, 2026-10-18-seed-data-from-public-records-and-cover-every-market, 2026-08-09-i-search-where-the-fleet-stores-not-where-tyler-said, 2026-09-08-dont-assert-best-practice-before-verifying-it, 2026-09-08-attributed-a-code-config-change-to-a-human-instead-of-git-history, 2026-09-26-check-surface-liveness-before-building-on-it, 2026-08-28-one-measurement-is-not-the-population-it-describes, 2026-10-23-relaying-subagent-claims-written-from-memory]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-10-22
```

# Anything measurable gets measured this session. My confidence is not evidence.

## Fires when
About to write a count, size, version, path, or a claim about what another system does from memory, a subset `ls`, or a plausible reconstruction. Also: options derived from directory listings · declining by re-running an argument instead of looking at the thing named · asking Tyler for an example before investigating · a measurable claim in **Tyler's own framing** ("the industry does X").

🔴 **The tell is a sentence I could write without running anything.** Six ways a measurement still lies:
- **WRONG TARGET** — `expiresAt` *sounds* like "is this login valid?" but is a rotation stamp that SITS in the past. Measure a capability by EXERCISING it; ask *what command would make this claim false*, and run that.
- **NEGATIVE PROBE** — uniform failure across a population (12 of 12) is a bad pattern far more often than a broken artifact: read ONE instance by hand. `~` resolves on the box that RAN it.
- **ONE MEMBER CAPTIONED AS THE SET** — the architect loads ~125,600 B, a master 25,826 B of DIFFERENT files. Name the population; measure ≥2 members.
- **WRONG POPULATION** — a rate over a sample selected for the outcome restates the selection. Quote `N of M, where M is <how M was chosen>`.
- **GREP IS NOT A READ for a mechanism** — a query never surfaces an absence (a swallowed `|| true`, a missing guard) or a relation between files.
- **A CONFIRMING NUMBER IS NOT A DIAGNOSTIC ONE** — name the observation that DISTINGUISHES the theory from its neighbour.

## Trigger detail (full text — kept out of the always-loaded bundle)
About to write a count, size, version, path, or a claim about what another system does — and the
number came from memory, from an `ls` of a subset, or from a plausible reconstruction. Also: offering
options derived from directory listings · declining a request by re-running an argument instead of
looking at the thing named · asking Tyler for a concrete example as a condition for investigating · a
measurable claim in **Tyler's own framing** ("the industry does X", "we have N of these").

🔴 **The tell is a sentence I could write without running anything.** Plausibility and truth diverge
exactly where a system grew by accretion, and a self-consistent reconstruction survives self-review
because reviewing it re-runs the same flawed enumeration.

🔴 **AND THE TARGET, NOT ONLY THE ACT — a probe that RAN, against the WRONG THING.** Both tells
above key on *"did anything run"*; here plenty ran. **The measuring reflex was working; the target
selection was not.** The mechanism is that a FIELD NAME does the reasoning: `expiresAt` *sounds* like
it answers *"is this login valid?"*, so reading it feels like checking — when it is the rotation stamp
on a token refreshed every ~8h and is SUPPOSED to sit in the past between refreshes. **The thing
CLAIMED and the thing MEASURED must be the same thing**: a claim about a CAPABILITY is measured by
EXERCISING that capability, never by inspecting state that correlates with it. Ask *what command would
make this claim false* — and run that one. 🔴 And it compounds — once a plausible mechanism is in hand, the negative probe below
reads as CONFIRMATION rather than as ambiguity, which is why self-review does not catch it.

🔴 **AND THE INVERSE — a probe that RAN and came back NEGATIVE.** A wrong pattern reports the ARTIFACT
broken, not my belief wrong, and both look identical. **Uniform failure across a population (all ten,
12 of 12) is a bad pattern far more often than a broken artifact** — read ONE instance by hand and
test the criterion's literal. **`~` resolves on the box that RAN it.**

🔴 **AND ONE MEMBER MEASURED CORRECTLY, CAPTIONED AS THE SET.** The three tells above all key on the
measurement being flawed. Here it is perfect — and taken on *the box I was sitting on*, which then became
the subject with nobody choosing it. **Name the population ON the artifact, and measure ≥2 members before generalising** — the second box is
one `wc -c` and it is the whole difference between a census and an extrapolation.

🔴 **AND MEASURED CORRECTLY OVER THE WRONG POPULATION.** Both tells above key on *"did anything
run"* — here something ran, was right, and the rate was void. **A rate over a sample selected for
the outcome restates the selection criterion**: *"3 of 3 failures were fixed by a retry"* is true by
construction and says nothing about first attempts (2026-08-24: really 4 of 5 succeeded FIRST try;
P0 was called off it). **Quote rates as `N of M, where M is <how M was chosen>`** — a subagent's
denominator fits ITS question, and severity needs the full population.

🔴 **AND A GREP IS NOT A READ, WHEN THE SUBJECT IS A MECHANISM** (2026-08-28, 8,824 lines). A query
returns only what its pattern already describes, so it can never surface an **absence** — a swallowed
`|| true`, a missing `ConnectTimeout` on one ssh among six that carry it, a missing `--apply` guard —
nor a **relation between two files**, like a stagger that inverts into a synchronizer under
parallelism. All four were found by reading whole and were invisible to every grep that preceded them.
**"What does this line say" is a grep question; "why is this slow / what breaks / what is missing" is
a read question.**

🔴 **AND A CONFIRMING NUMBER IS NOT A DIAGNOSTIC ONE.** Name the observation that would DISTINGUISH the
theory from its neighbour, never the one consistent with it.

## Evidence behind the triggers

- and on 2026-08-28 plenty ran: five boxes' credential files read, the
live API curled — and the conclusion (*"sf's login expired, re-authenticate"*) was false, while sf's
Claude Code login answered `ALIVE` to one `claude -p`.

- (The true cause was one `ls`: sf has no crontab and no
`usage-feed.sh`.)

- Measured 2026-08-28: the agent box loads **~125,600 B**, drawn in
PLAN-247's artifact as *"what loads on the Architect box"* under a plan titled *cut the always-loaded
surface*. **A master loads 25,826 B of DIFFERENT files** — `planning-loop.md` resolves to
`planning-vocab.md`, `RULES.md` is the 415 B master slice — and `sf` is a third shape again. Tyler:
*"it's assuming that all agents get the same context. If this is true, then that's a huge problem."*

- Worse here: the
refuting number (415 B of a 29,576 B glob) had been measured hours earlier in the same session and used
as evidence for a different plan.

- Volume is not the exception: 8,824 lines is four parallel subagents returning
findings, ~3 minutes.

- `graphql: 0/5000` confirmed "budget
exhausted" and was equally consistent with GitHub's secondary abuse limit — which `rate_limit` cannot
report, and whose remedy is pacing rather than fewer calls. The disambiguating test was one 1-point
query against full buckets, and it was run an hour late, by accident.

## The rule

**Measure it in-session, or dispatch an agent for anything breadth-shaped.** A command in the turn
beats a paragraph of reasoning; never `ls` a subset and generalise. When authoring options, state the
measurement each one was derived from — three shapes derived from `ls` output are three guesses
wearing a menu's clothes.

**A claim in Tyler's framing is still a claim.** Test the measurable ones and report the result even
when it contradicts him; he asked for exactly this and acted on the answer both times it happened.

**A repeated request means my answer missed the point, not that he missed my answer.** Re-read what he
named; look at the location he named. Twice is a signal, three times is proof.

**Do not ask for a concrete example as a condition for looking.** If one would settle it, go find it.

### 🔴 AND A SOURCE THAT BEAT ANOTHER IS NOT "THE" SOURCE — ask what it cannot see

Reading a session transcript's `attachment` records beat reconstructing the same figures from disk; the
disk method had been wrong by **28×**. I promoted that to a rule — *"from the transcript, not from disk"* —
and wrote it into an acceptance criterion.

**The transcript cannot see `rules/` at all.** It arrives via the system prompt, which is not recorded:
**115,212 B, 62% of the total, invisible to the mandated method.** Verified on three CLEAN transcripts,
because this session's own transcript returned 29 false positives — **a transcript about the subject cannot
test whether the subject loads.**

**The claim decides the source, per number:** file size → **disk** · accepted into context → **transcript**
· printed by a hook → **run the hook** · in the system prompt → **neither, and say so**. A total drawn from
several sources reports them as separate lines plus a sum.

**The general form:** a source comparison that only tests one direction always favours the newer source,
because the newer source was chosen to fix what the older one got wrong. **Before adopting a method because
it beat another, ask what the new one is blind to.**

## Cost when it fired

2026-08-16, one session, **three confident premises overturned by research I dispatched**: the ADR
corpus was **155 records not 109** and a *write-rate* problem (109 written in August alone) — my count
`ls`-ed two directories and missed four portfolios · **"pages on pages" is 86% tool schemas**, and our
`start-planning.md` at 30,077 B is longer than Anthropic's longest published prompt (24,348 B) and 3x
Claude Code's authored prose (10,415 B) · and a KB cleanup I **declined three times** on a
correct-but-irrelevant principle turned out to be **four root entries belonging to nobody**, three of
which had survived a cleanup that explicitly listed them. Same `ls` settled the other half honestly:
`_infra/` has **385 inbound references** and stays. Earlier that day, two consecutive
`AskUserQuestion`s a subagent could have answered, one justified in writing as *"a call about how you
want to work rather than a fact about the repo"* — the sentence that is the smell.
