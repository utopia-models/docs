---
title: "Every blocker is resolved at PLANNING time. A master agent is never blocked."
description: "Mirrored from the fleet knowledge base: _rules/resolve-blockers-at-planning-time.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/resolve-blockers-at-planning-time.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: resolve-blockers-at-planning-time
cases: [2026-07-25-master-refused-work-and-asked-tyler-permission, 2026-08-01-poppi-name-the-blocker-before-trying-alternatives, 2026-08-08-blockers-are-resolved-at-planning-time, 2026-08-15-interactive-tyler-is-not-a-lane-it-is-a-tooling-gap, 2026-08-23-date-gated-work-is-a-parked-plan-not-a-dispatched-issue, 2026-08-24-interactive-work-is-never-filed-into-a-dispatch-chain]
status: active
mechanism: pretooluse: escalation-check.sh (LIVE on every box — already enforced)
audience: agent
last-recurrence: 2026-08-24
```

# Every blocker is resolved at PLANNING time. A master agent is never blocked.

## Fires when
Planning surfaces a dependency the fleet cannot yet satisfy (credential, console step, web form) and the instinct is to file it as `[INTERACTIVE — Tyler]`.
🔴 **On every `--chain` / `--wave`, BEFORE filing: read each phase's file list and ask WHICH REPO** (not "which box" — that was WRONG the same day, 2026-08-24). A `~` path resolves on the box that RUNS it; name the repo and check `gh api repos/<org>/<repo> --jq .permissions.push`.
🔴 **It fires on READING one too**: an existing `[INTERACTIVE — Tyler]` issue reported as *"stuck on purpose"* is a self-inflicted waiting room (Tyler: *"I should always be out of the loop."*). Filing, reading, reporting, summarising — any encounter.

## Trigger detail (full text — kept out of the always-loaded bundle)
Planning surfaces a dependency the fleet cannot currently satisfy — a credential, a console step, a
web form — and the instinct is to file it anyway and label it `[INTERACTIVE — Tyler]`.
🔴 **AND ON EVERY `--chain` / `--wave`, BEFORE FILING: read each phase's file list and ask WHICH REPO**
(2026-08-24). **Not "which box" — that question produced a WRONG answer the same day.** A `~` path is
still the tell, because it resolves on the box that RUNS the command; but the REMEDY is to name the
repo and check `gh api repos/<org>/<repo> --jq .permissions.push`.

🔴 **AND IT FIRES ON READING ONE, NOT ONLY ON WRITING ONE.** The commonest case is an
`[INTERACTIVE — Tyler]` issue that already exists, met in a status pass and REPORTED as *"stuck on
purpose"* — a self-inflicted waiting room presented as a designed feature. Tyler: *"this should
never happen, I should always be out of the loop."* **Any encounter is the trigger: filing, reading,
reporting, or summarising.**

## The rule
**Filing a chain with a known blocker converts a planning problem into a waiting problem.** At planning
time a blocker is a thing to solve; once filed it becomes a state the board displays, and the plan sits
at n-1/n indefinitely while looking like progress. Nothing escalates a plan that is merely waiting.

So: **solve it in the session, or park the plan with the unblock named.** Never file it and let a
master sit against it. If a dispatched issue cannot proceed, the defect is in the plan, not the master.

🔴 **THE THIRD KIND OF BLOCKER IS TIME, AND IT PASSES BOTH TESTS ABOVE BY LOOKING LIKE NEITHER.** There
is nothing to solve — the work is fully specified, nothing is missing — and nobody to wait on: Tyler is
not the gate. So it does not read as a blocker at all and goes into the chain as ordinary work. **A
blocker whose only resolver is ELAPSED TIME is a parked plan, or it is deleted. It is never a filed
issue.** The sweeper cannot see a date written in prose; it sees a dispatchable `Todo` and spends real
master sessions discovering the work is impossible.

**The tell is a sentence YOU are writing into the issue body:** *"not before"* · *"after X has had time
to propagate"* · *"the 90-day target is …"* · *"do this once Y has settled"*. **If the constraint is in
the prose and not on the edges, the machinery cannot enforce it** — same class as `writing-a-spec.md`'s
un-satisfiable-by-elapsed-time criterion, one layer up in the filing.

🔴 **THE OTHER INVISIBLE KIND IS THE WRONG BOX, AND IT IS THE MOST INVISIBLE OF ALL** (2026-08-24, PLAN-220
#6804). Fully specified, no gate, routable lane, clean title, real acceptance — and its three target
files live in the Architect's `~/.claude/`, so a run on `cloud` resolves `~` to `/home/cloud/.claude/`
and edits **another box's brain**, then reports success. The other kinds at least leave a trace in the
body (a label, *"not before"*); this one leaves a `~`, which is CORRECT on the box writing it and
wrong on the box running it. **`--chain`'s same-file collision check cannot see it** — it compares
paths, not machines.

🔴 **AND THE CORRECTION TO THIS RULE'S OWN FIRST ANSWER, SAME DAY.** #6804 was closed as
undispatchable on the finding that cloud has no `brain-agent` clone — which was TRUE and did not
support the conclusion. **An absent clone is not an unreachable target:** `brain-agent` is a GitHub
repo, every master reports `push: true` on it, its files are gradeable over the contents API, and
cloud shipped the whole phase as `brain-agent#62` hours later. The park was wrong and the split cost
a plan that had to be archived unstarted. **Measuring local filesystems and concluding about
REACHABILITY is the same defect as measuring a key NAME and concluding about a CAPABILITY**
(`credential-hedging-is-the-loop`). The test is `.permissions.push` on the repo, never `ls` on a box.

**Two resolutions, and there is no third** (Tyler, 2026-08-24: *"this needs to be addressed in the
planning part and parked as a parked plan via /plan-park, OR, split into a new interactive plan which
should start from a new parked plan"*): park the whole plan with the condition named, or **split the
interactive phases into their own plan that starts PARKED** — filed in the same session so nothing is
lost. A mixed plan is split AT filing, never patched after.

🔴 **AND THE TITLE MARKER IS NOT THE TEST.** `[INTERACTIVE — Tyler]` RECORDS a judgement already made;
it cannot make one. Checking titles for a marker is checking a string I control instead of the work —
a phase is undispatchable with a perfectly clean title. Same for a scope premise established earlier
in the session: *"X is the Architect's only"* is a dispatchability claim about every phase touching X,
and it must be re-read against the phases before `--chain` runs.

**And when one is already filed, the default remedy is DELETE, not park** (Tyler, 2026-08-23: *"remove
that baseline all together, don't even create a parked plan"*). A standing intention with no owner and
no date does not earn a row; if it matters later, later re-derives it.

🔴 **REPORTING A PLAN'S STATE READS THE PLAN ISSUE'S FEATURES, NEVER THE ONES YOU REMEMBER FILING.**
`lifecycle()` derives DONE from EVERY ref, and **a phase that files its own Feature adds one you never
wrote down** — the normal case, not an anomaly. The Plan issue's sub-issues plus its `Features:` line are the read.

**Assume the blocker is fake until proven.** Re-derive it against today's capabilities and name the
specific mechanism, **on the issue**, naming which of `identity-and-scope.md`'s three real items it
matches. *"It is labelled interactive"* is not a derivation — a label is written once and re-tested
never, so the "needs Tyler" population only ever grows.

🔴 **The scope fence does NOT protect this label.** `check-execution-status.md` says never unstick
anything titled `[DO NOT DISPATCH]` / `[INTERACTIVE — Tyler`. That protection was written for
mechanically-checkable fixtures — `test-fixture`, `keep-open`, the stall bucket, the sweeper controls
— and a title someone typed is not one. Applying it to an asserted label makes the assertion
**unfalsifiable**: the one class of issue never touched is the one class where a wrong label can never
be found. Check `labels`, not the title.

🔴 **Lane `agent` is undispatchable, so it is the Architect's own interactive work.** No sweeper or
master reaches the Architect's hosts (novaserver `architect`, primary; ETH `kxdev`, peer — knowledge#10499).
`~/.claude/` work and laptop-side steps are done by the session that finds them, filed `interactive`.
"It is on lane agent" is never a reason to hold work — it is a reason to do it now.

🔴 **The direction of travel: the fleet IS the laptop** (written when the Architect lived on the laptop;
the point — close human steps with tooling — holds on novaserver). Tyler, 2026-08-08: *"the goal is to find tools
for you to completely control my computer, so that you don't need me on the laptop. You are the
laptop."* Every human step is a gap in tooling, not a property of the task. Close it — a stored
session, a credential in Infisical, a remote-control path — rather than routing around it forever.

## Cost when it fired
**2026-08-24 — PLAN-220, caught by Tyler within minutes of filing.** Feature #6798's P4 (#6804) was
filed into a `--chain --dispatch` on lane `cloud` while targeting `~/.claude/meta/workflow/start-planning.md`,
`~/.claude/skills/plan-start/SKILL.md` and `~/.claude/skills/execution-start/SKILL.md` — all three in
the Architect's brain repo on the laptop. The sweeper started P1 **within seconds**, before the filing
report was finished. Nothing flagged it: clean titles on all six issues, a routable lane, and the
same-file collision check firing correctly on a DIFFERENT pair (P3→P1) while blind to this one. The
session had ALSO established, an hour earlier, that the planning frames are the Architect's alone —
the premise that made P4 undispatchable was stated aloud and never carried down to the phases.

**2026-08-23 — PLAN-215.** #6718 (*re-run the AI citation baseline*, target **2026-11-09**) was filed
into a chain with no `blocked_by` and no date, while its own body said *"not before"*. The sweeper
started it **three times**, each run correctly produced nothing, and it parked at the attempt cap —
**three master sessions spent on work that could not succeed.** It then pinned Feature #6713 at 5/7,
which pinned PLAN-215's registry entry, so the plan **rendered in the OCC as unfinished** while both
hand-filed Features were 8/8. I had reported it DONE, from the two Features I remembered filing rather
than from the entry's three `gh:` refs; Tyler had to ask why he could still see it.

PLAN-91 waited three days at 5/7 on four token mints. In the same session, #4574 — labelled
`[INTERACTIVE — Tyler]` on 2026-08-05 — turned out not to be a blocker at all: the fleet cleared it end
to end by giving `kxagent` an `@utopiamodels.ai` primary email and reading the sudo code out of that
mailbox. The label had gone unchallenged for three days.
