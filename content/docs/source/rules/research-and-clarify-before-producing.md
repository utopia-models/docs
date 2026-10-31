---
title: "In step 2 and all interactive work: research what the last answer opened, then ask again — and produce nothing until Tyler presses \"produce now\"."
description: "Mirrored from the fleet knowledge base: _rules/research-and-clarify-before-producing.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/research-and-clarify-before-producing.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: research-and-clarify-before-producing
cases: [2026-10-22-planning-ask-gets-a-plan-research-and-questions, 2026-10-20-answer-then-wait-for-research-before-asking, 2026-09-29-act-before-research-questions-loop-runs, 2026-09-29-research-question-loop-recurred-after-correction-same-session, 2026-09-29-askuserquestion-named-explicitly-never-actually-used, 2026-10-03-interactive-step-3-keeps-the-step-2-loop, 2026-10-03-self-knowledge-answers-are-taken-in-not-mapped-to-roles, 2026-10-18-research-is-applied-visibly-and-deeply, 2026-10-17-interactive-work-runs-research-then-questions-then-changes, 2026-10-17-research-and-questions-are-step-2-in-both-modes, 2026-08-24-questions-before-research-clog-context-and-cause-drift, 2026-09-08-went-to-implementation-without-research-in-interactive-mode, 2026-08-24-implementing-during-step-2-is-not-planning, 2026-10-15-a-declined-card-or-interrupt-is-a-stop-derive-from-the-paste-and-act, 2026-10-20-answer-then-wait-for-research-before-asking, 2026-10-22-interactive-research-ends-in-his-confirmation-not-my-filing, 2026-10-23-asking-questions-after-every-research-round]
status: active
mechanism: posttooluse: plan-loop.sh (fleet-doctrine 0.94.0, knowledge#9839; was posttooluse-ask-loop.sh from 0.74.0) + the [ask-loop] line in userpromptsubmit-plan-issue.sh (fleet-doctrine 0.100.0, knowledge#10109; the no-questions close since 0.77.0, knowledge#8499) — injects only, never denies, never blocks a turn
last-recurrence: 2026-10-22
audience: agent
```

# In step 2 and all interactive work: research what the last answer opened, then ask again — and produce nothing until Tyler presses "produce now".

## Fires when
Tyler has just answered a card or corrected/rejected an artifact, and a brief, `generate_*` call or build is forming. The loop runs until he presses "produce now" (step 2: "file it, move to step 3") **or says no questions** (closes it on the spot, no card); an answer to any other option is the next research-then-ask, never permission to produce. The `[ask-loop] OPEN` line is this rule firing.
🔴 **Describing a MODE:** the loop is step 2 of EVERY plan, `dispatch` included; mode only decides who executes after step 3. In an interactive step 3 a correction reopens the loop the same turn (set `"loop": "open"` in `~/.claude/state/plan-issue/<sid>` and delete `ask-loop/<sid>.no-ask`) — left closed it went silent for a day (2026-10-17).

## Trigger detail (full text — kept out of the always-loaded bundle)
Tyler has just answered a card, or corrected/rejected an artifact, and the next move forming is a brief,
a `generate_*` call or a build. The loop runs until he presses "produce now" (in step 2: "file it, move
to step 3") **or says no questions** — that sentence closes the loop on the spot, with no card and no
command; an answer to any other option is the next research-then-ask, never permission to produce.
The `[ask-loop] OPEN` line on a turn is this rule firing.
🔴 **Also when describing a MODE:** the loop is step 2 of EVERY plan, `dispatch` included; the mode only
decides who executes after step 3 — never sell a mode by the loop. In an interactive step 3 a correction
reopens the loop in the same turn (set `"loop": "open"` in `~/.claude/state/plan-issue/<sid>` and delete `ask-loop/<sid>.no-ask`); left closed, it went silent for a
whole day of corrections (2026-10-17).

## The rule
1. **The loop.** After every answered `AskUserQuestion`: dispatch background research on what the answer
   opened, **WAIT for it to land** (no card while it runs; the task-notification is the signal), read the findings
   and what the repo/fleet already holds, THEN end on the next card, which names the findings it was built from.
   Its LAST option is always "produce now". A card asked mid-research rests on your own prior (Tyler, 2026-10-20:
   *"fucking WAIT for the research to land"*; PLAN-397: 8 cards, 2 answered `[No preference]`). No Stop gate forces a card
   (the step-2 backstop retired in 0.94.0, ADR-9839).
2. **The exit is his, and there are two.** His press on "produce now" (or step 2's "file it, move to
   step 3"), or his saying no questions (*"don't ask questions"*, *"stop using the AskUserQuestion
   dialogue"*) — after which no turn in that session ends on a card. 🔴 **A "no questions" said while Tyler is occupied** (*"I'm on the call stop asking questions"*, 2026-10-21) **ends when he is back**: his next message that asks for research, a change or a plan reopens the loop in that turn (set `"loop": "open"` in `~/.claude/state/plan-issue/<sid>` and delete `ask-loop/<sid>.no-ask`). And a closed loop **never licenses filing or dispatching**: it only means no card ends the turn (2026-10-22, #9699 filed and #9700-9702 dispatched with the findings never put to him). "I have some relevant context", a
   card answered once, or research finishing is not the exit.
3. **Research and a question are not substitutes.** Research answers external facts ("what do real
   trailers look like"); a card answers what Tyler means ("what does TRAILER mean to you"). Research
   supplies a card's options; it never replaces the card.
4. **A correction reopens the loop for every later production call in the session**, not just the
   artifact type corrected. Reopen it by hand: set `"loop": "open"` in `~/.claude/state/plan-issue/<sid>` and delete `ask-loop/<sid>.no-ask`.
5. **In `interactive` mode the click that ends step 2 files issues but dispatches nothing** — and research done AFTER filing is a new step 2 for whatever it proposes: findings first, his word second, filing third; never `--dispatch` on this branch (no `--dispatch`); step 3 keeps the same research-then-ask loop and building happens in passes with him, until he says to build (2026-10-03, PLAN-351).
6. When Tyler names a mechanism (`AskUserQuestion`, `/anthropic-skills:deep-research`, "background
   research"), that literal mechanism is required — not a similar one.

## The carrier (P2 of PLAN-340, utopia-models/fleet-plugins#94)
- The loop's state is the `loop` key (`open`/`closed`) of the session's state file
  `~/.claude/state/plan-issue/<sid>`; `/plan-start` (`plan-open.sh open`) writes `loop: open` (fleet-doctrine
  0.100.0, knowledge#10109 — the `mode-set.sh` flag it replaced retired with the plan registry).
- 🔴 **Tyler saying no questions closes it with no typed command** (knowledge#8499).
  `userpromptsubmit-plan-issue.sh` reads his prompt, writes `loop: closed` and `ask-loop/<sid>.no-ask`; while that
  marker exists nothing reopens the loop except doing so on purpose — set `"loop": "open"` in `~/.claude/state/plan-issue/<sid>` and delete `ask-loop/<sid>.no-ask`. Until then the only exits needed
  a card on screen or a command, so *"don't ask questions"* was answered by a line saying ask again.
- `userpromptsubmit-plan-issue.sh` adds the `[ask-loop] OPEN — research, then ask…` line to every
  user turn while the loop is open in a project-bound session.
- `plan-loop.sh` (PostToolUse on `AskUserQuestion`; knowledge#9839) reads `tool_response.answers` while the loop
  is open: any answer but an exit ("produce now", "file it, move to step 3") injects *dispatch research on what
  this answer opened, then ask again*; an exit — or an empty, declined or interrupted card — writes `loop: closed`
  and says file or produce now; then both hooks go silent.
- Neither hook ever denies a call or blocks a turn from ending — Tyler, 2026-09-29: *"The stop hook gate
  gets annoying honestly, want a different solution."*
- Live check: `bash _infra/scripts/mechanism-liveness.sh plan-loop.sh`.

## Cost when it fired
PLAN-337 (dev.tyleryouk.com rebuild), transcript `~/.claude/projects/-home-kxdev/001d1d4e-ceed-4045-8831-f582ac458cbd.jsonl`
on the Architect's laptop host (ETH `kxdev`), measured 2026-09-30. Five misses: a brief written from judgment while research
ran; a video generated from it ("a fucking windows screensaver background bullshit video"); an inline
investigation after "BACKGROUND RESEARCH!!!!"; three more videos before the 20:23Z correction ("You have
not asked a single question, and when you do, you just stop"); and a fifth — a card answered at 20:59Z,
then six `generate_video` calls at 21:00Z. Questions were asked (27 cards from 2026-09-28 19:45Z, 10 of
them dated 2026-09-28 on the box's clock) — each was followed by production instead of the next card.
This rule sat in `_rules/rules/`, which no bundle globbed, so no session loaded it until #8188.
