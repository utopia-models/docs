---
title: "Step 2 — LOOP ⟳"
description: "Mirrored from the fleet knowledge base: _process/steps/2-loop.md"
updated: 2026-10-25
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/steps/2-loop.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect]
step: 2
load: on-demand
reader: the /plan-start and /plan-continue skills — read at step 2
```

# Step 2 — LOOP ⟳

**Research ⇄ questions, alternating and repeating, until the plan is complete.** Derived — an open Plan issue with no
Feature filed is in steps 1-2; nothing reports which.

*"rough note → research → questions → research → questions, iterating until the plan is complete."* **That alternation
IS the step, not a preamble to it.** The step does not advance on a loop-back and does not advance on an answer; the
round count rides in the label as `LOOP ⟳N`.

🔴 **Research and questions are step 2 of EVERY plan, and the mode (`dispatch` or `interactive`) only decides who
executes after filing** — no mode skips, shortens or replaces this loop (Tyler, 2026-10-18, PLAN-389).

**Parked is a POSITION, not a label: step 2 LOOP.** A parked plan is one whose loop STOPPED, not one declared
complete. It stays a Planning row, its `gh:` references stay open and dispatchable, its board fraction is still
reported.

---

## The asking discipline

**`AskUserQuestion`, one question per call, options with your recommendation first.** Every place two readings of the
goal produce materially different work is a question for Tyler.

🔴 **Ask BEFORE researching.** Research spent on the wrong target is the expensive mistake. Rank the gaps by how much
the answer would change the work and ask the highest-impact one first.

🔴 **Do not write acceptance criteria at step 1.** A criterion written before the forks are settled locks in the wrong
target. Hold them until the shape is decided.

## The research discipline

**The rule: subagent for *"what is out there / what changed"*; direct read for *"what does this file say."***
Dispatching a subagent to read a file you can name is a slower Read.

**The standing drift question, dispatched as one subagent scoped to a single question:** *what has drifted since this
file was written?* That question is breadth-shaped and unknown-shape, which is what a subagent is for. Point it at the
Plan-issue scripts (`plan-open.sh`, `plan-stamp.sh`, `plan-loop.sh`), the filing script's real flags, the doctrine
lifecycle, and any writer that touches the spec folder — and ask it to report **contradictions** between what those say and what the frame claims.

**Then read directly, in parallel:** the Plan issue (body, board fields, comments), the step files, and the portfolio
`CLAUDE.md` for whatever area the work touches.

🔴 **Recalling instead of reading is one of the four things that go wrong.** Every exact value — path, issue number,
count, error string — is read from its source **this session**.

## The fork discipline

**Skipping the fork dialogue is the single most common way these sessions go wrong.** Tyler's message is the goal; it
is never approval to begin producing a plan.

🔴 **Converting the ask into existing machinery.** Tyler, 2026-08-04: *"I convert every request into the domain I
already have machinery for."* **Name the overlap in one line, then describe what you would build if it did not exist —
and plan from that.** Plan the work as it should be built, including new machinery when that is the right answer.

---

## The order inside one round: research LANDS, then the card

After an answer: dispatch the research it opened, **end the turn with no card, and wait for the task-notification**. Read the findings and what the repo, board and fleet already hold, then ask. The card **names the findings it was built from**. A card asked while a research agent is still running is built on your own prior (PLAN-397: 8 cards, 2 answered `[No preference]`, one anger; Tyler, 2026-10-20). The Stop backstop stands down while research is in flight (fleet-doctrine 0.83.0). Rule: `_rules/research-and-clarify-before-producing.md`.

---

## Two things end LOOP, and BOTH options are always on the card (#6932)

**Every step-2 turn ends in an `AskUserQuestion` whose last two options are, in this order, `research more` and `file
it, move to step 3`.** The loop ends when Tyler either:

- **SELECTS `file it, move to step 3`** — *"the click ends it"* (Tyler, 2026-08-27; the rule itself is his,
  2026-08-22: *"Step 2 ends on Tyler clicking an option in an `AskUserQuestion` dialogue"*); **or**
- **types** *"Plan is good, proceed with step 3, file it"*.

🔴 **An approving remark is NEITHER.** *"looks good"*, *"nice"*, *"yes"* file nothing — the click is deliberate, a
compliment is not, and that distinction is why the typed sentence exists. It survives.

**Both are read by a MECHANISM, not remembered.** A click returns as a **tool result**, not a prompt, so the per-turn
injector structurally cannot see it: `plan-loop.sh` (fleet-doctrine ≥ `0.94.0`, which folded in the 0.61.0
`posttooluse-step2-exit.sh`, ADR-9839) reads `tool_response.answers` — **and only `answers`, because `questions` echoes
every option that was OFFERED** — turns the press into an instruction in the same turn, and writes `loop: closed` to
the session's state file `~/.claude/state/plan-issue/<sid>`. No Stop gate demands a card any more (the step-2
backstop retired with ADR-9839), so nothing blocks the turn that obeys the click. Until then the exit was **displayed and inert**,
which is worse than absent: it teaches the reader the card is decoration, and PLAN-225 ran 22 rounds and 16 questions
in step 2 without ever reaching step 3. Full reasoning:
`wi/decisions/ADR-9839-the-plan-issue-is-the-only-record.md`.

🔴 **Neither exit advances the STEP by itself.** Step 3 is still DERIVED — it becomes true when a Feature is connected to
the Plan issue (a sub-issue, or a ref on its `Features:` line) (#4509, #4561). **The click ends the *loop*;
filing is what moves the *step*.**

### He never decides blind — the three-things report

Before Tyler can end the loop, say plainly where the plan stands on three things:

1. whether **any fork is still open**;
2. whether the **research answered what it was sent for**;
3. whether the **artifact reflects the plan as it now is**.

**If any of those is false, name which one rather than waiting to be asked.** "Ready" is a claim about those three;
anything less is reported as what is still missing.

---

## The artifact iterates in place

The rough draft was published at step zero (step 1). **Republish that SAME artifact as the plan changes** — same file
path keeps the same URL, so Tyler watches one page evolve through the loop instead of seeing it appear at the end.

**Republish when a fork closes, when research lands, and when phases take shape** — not once at the end of the loop.

---

## Writing the plan document

The plan document is the spec folder `plan-open.sh` published — `<project>/work/specs/<issue#>-<slug>/spec.md` and
`plan.md` — linked from the Plan issue. **There is one copy, on `origin/main`;** edit it there (a branch + PR or a
path-scoped commit), then verify against the REMOTE (`git show origin/main:<path> | wc -c`), never the working tree.

**Phase headings are exactly `### P1 · Title`** — the form every reader expects. 🔴 **Zero headings is not zero
phases** — a plan whose headings do not parse declares nothing. **Count your own phases and say the number.**

**Commit and push.** The OCC reads GitHub at request time and has no writable store, so an unpushed change
is invisible.

---

## The four things that go wrong

1. **Skipping the fork dialogue.** Ask **before** researching.
2. **Writing acceptance criteria at step 1.** They lock in the wrong target.
3. **Converting the ask into existing machinery.** Name the overlap; plan from what you would build.
4. **Recalling instead of reading.** Every exact value read from its source this session.

---

## The units of TIME — Cycle · Week · Day (PLAN-219)

**Orthogonal to PLAN / Feature / issue, never nested inside them.** Those say *what* the work is; these say *when*.
**A cycle does not contain plans and a plan does not span weeks.**

| unit | length | artifact | board field |
|---|---|---|---|
| **CYCLE** | 60 days | `wi/work/cadence/cycles/NN-name/kickoff.md` | `Cycle` (iteration, `PVTIF_lADOEZ-Tjc4Bb8OGzhgQeQI`) |
| **WEEK** | Sat → Fri | `wi/work/cadence/weeks/YYYY-Www.md` | `Week` (iteration, `PVTIF_lADOEZ-Tjc4Bb8OGzhWow6E`) |
| **DAY** | 1 day | `wi/work/cadence/days/YYYY-MM-DD.md` | — |

🔴 **A WEEK NAMES A SUBJECT. IT NEVER LISTS PLANS.** The week file is written on Saturday and names what the week is
*about* — `SF`, `Network`, `Research`. **On Saturday those plans do not exist.** A plan is created when that subject
is actually worked, and it then RECORDS the week it was born in. The reference runs one direction only, backwards from
the plan to the week; a week file that enumerates plans is asserting a future it cannot know.

That backward reference is **mechanical, not remembered**: `file-issue.sh` stamps the board's **current** `Week`
iteration onto every issue it files (#6778), resolved live at filing time because an iteration id rotates whenever the
field is edited. **It is advisory end to end** — no week ever refuses a filing, and the cadence gates nothing
anywhere.

🔴 **`Cycle` and `Week` are UI-MANAGED ONLY — never write either by API.** Schema evidence and what an API write costs:
`wi/work/reference/win/board.md`.

---

## Picking a plan back up — resuming the loop after a session ended

**Resuming is the DEFAULT and needs no permission.** Tyler: *"most times, I will want to continue the plan."*
**The mechanism is `/plan-continue [<issue#>]`** (`plan-open.sh resume`): with no number it takes the newest OPEN
`planning` issue for this session's project, restores Mode · Recipe · Portfolio from the board item, re-runs
`project-session.sh load`, and prints `plan.md` and the issue's last comment. **State is reconstructed from the
board and the issue; nothing is resumed by handle.**

### Which plan — ask first, before any tool call

If Tyler named a plan in the message, the ask is answered. Otherwise ask with `AskUserQuestion` **before any tool
call**, building the options from what is already in context. A bare number or a title typed as "Other" are both
valid; take it verbatim.

🔴 **Label a parked plan (label `parked`) as parked in its option text** — never fold it in with the quiet ones. They
are the two states that look alike on the surface and want opposite handling.

### SCOPE FENCE

**This plan only.** Read its state, reconcile it, resume it. Do NOT audit the Planning section, the hooks, or the
sweeper. If what you find implicates one of them, **name it in one line, file it if it is real, and keep working the
plan Tyler asked about.** A status check that becomes a machinery rewrite has answered a question nobody asked.

### SETTLED — do not reopen these

**Liveness is a ten-minute age check on the board's `Last active` field, and nothing else** — `plan-stamp.sh` writes
it; the row shows `● live` when it is ≤ 10 minutes old. **There is no flag anyone sets and no heartbeat file.** A
quiet row is not a stalled plan; never report it as a diagnosis.

🔴 **A PARKED plan is not a QUIET one, and they need opposite defaults.** Quiet is derived — nobody has typed in ten
minutes — and resuming is right. Parked is **DECLARED**: Tyler deliberately set this plan down. For a parked plan,
read the `## Parked <ISO>` block in the Plan issue body BEFORE resuming, and ask whether its unpark condition has
changed. **Resuming a parked plan because it looked quiet is the failure this paragraph exists to prevent — the
reason it was parked is usually still true.** Unparking: step 5.

**No Feature on the Plan issue means the plan was never filed, whatever else the body says.**

### TRAPS

- **A plan can be complete and still look abandoned.** Check whether the spec folder has its phases and the body its
  artifact before assuming work is missing — what it may lack is only a filed Feature.
- **A CLI exit code is not the thing you are measuring.** Read the issue back after any write.
- **The local `utopia` checkout is behind origin.** **Read OCC code with `git show origin/main:<path>`**, never from
  the working tree.

**THE METHOD THAT LIES:** looking at the OCC and reporting what the row says. It renders the last state GitHub
served; **the Plan issue is the fact; the render is a view of it.**

### Research before acting, then resume

Find out **four things**, and treat any disagreement between them as **the finding** rather than something to resolve
silently:

1. **What the Plan issue claims** — its body, labels, board fields, and its Features.
2. **What the plan document says** — the spec folder's phases, what it declared done, and whether it still describes
   the work Tyler wants.
3. **What the artifact shows** — the claude.ai URL in the issue body. Fetch it if the document's account is thin.
4. **What actually happened since** — for every Feature, the live issue state.

That is four named sources, so **read them directly.**

Then tell Tyler where the plan stands in a few lines — **what is done, what is open, and where two sources disagree.
Not a dump.** Then keep going: continue the loop from the first thing that is genuinely unfinished, and **do not ask
permission to start. If what is unfinished is filing, file it.**

🔴 **The fork that matters most before you resume anything: is this plan unfinished, or is it finished and merely
UNFILED?** Those look identical on the dashboard and they need opposite actions — one goes back into the loop, the
other goes straight to step 3.

---

## Repair rule

**A dead pointer in a frame is repaired in place and reported, never worked around.** A stale pointer is information
about drift, never a blocker — fix it and tell Tyler in one line.
