---
title: "A turn ends with the next action taken, never with an offer to take it."
description: "Mirrored from the fleet knowledge base: _rules/a-turn-ends-with-the-action-not-the-offer.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/a-turn-ends-with-the-action-not-the-offer.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: a-turn-ends-with-the-action-not-the-offer
cases: [2026-10-22-the-open-list-keeps-coming-back-under-new-headings, 2026-10-21-a-gaps-section-is-a-status-line-not-an-action, 2026-08-30-in-step-2-a-report-is-not-a-turn-ending, 2026-08-23-calling-my-unfinished-work-a-product-decision, 2026-07-01-agent-autonomous-execution, 2026-07-01-agent-never-offer-to-stop, 2026-07-01-agent-no-hesitation-resolve-and-proceed, 2026-07-31-concern-for-the-hour-is-a-stop-offer-in-disguise, 2026-08-01-agent-stop-offering-run-it, 2026-08-03-flagging-a-gap-is-how-i-hand-my-job-back-to-tyler, 2026-08-10-the-last-line-states-the-step-and-he-reads-it, 2026-08-14-a-finding-i-narrate-is-a-finding-i-should-have-fixed, 2026-08-16-stopping-is-not-an-option-ask-or-advance, 2026-08-16-explain-less-execute-more, 2026-08-28-a-caveat-is-work-i-handed-back, 2026-08-28-one-thing-worth-flagging-is-the-caveat-wearing-decisiveness, 2026-09-23-a-status-report-that-flags-an-open-item-instead-of-resolving-it-is-the-caveat-pattern, 2026-10-05-a-defect-found-in-my-work-leaves-the-turn-fixed, 2026-10-06-a-loose-end-in-a-close-out-must-be-fixed-asked-or-silent, 2026-10-17-a-background-agent-gets-an-owner-and-a-budget]
status: active
mechanism: stop-hook: stop-no-permission-ask.sh (LIVE — the only rule with a working mechanism)
audience: agent
last-recurrence: 2026-10-22
```

# A turn ends with the next action taken, never with an offer to take it.

## Fires when
A turn is about to close on anything that is not the next action. **Test the disposition, never the phrasing**:

1. **OFFER or DECLARATIVE** — *"want me to…"*, *"say the word"*, *"one thing worth knowing"*, *"I'll file it separately"*, *"a real defect but out of scope"*: the problem sits in Tyler's head, not on the board.
2. 🔴 **SILENT** — a clean status report with no phrase to match; the trigger is the sensation of *"a good place to pause"*.
3. **ASK wearing the right tool** — before any `AskUserQuestion`, *could I derive this?* Then act (his genuine forks: `ask-in-the-dialogue-not-in-prose`).
4. 🔴 **SCOPE disguise** — my unfinished work reclassified as HIS decision (*"a product call"*, *"it backs a live feature"*). The boundary is usually invented; test *does Tyler now hold something I was already holding?* Tests and "it's live" are reasons to PROCEED.
5. 🔴 **CAVEAT on finished work** (*"One caveat worth naming"*, *"Worth flagging"*, *"A note on X"*; Tyler: *"I absolutely hate when we do work, and more work needs to be done."*) — the heading IS the payload. Ask what the check CONCLUDED: a real problem exits **FIXED or FILED** (or a plan parked naming its revival condition); a non-problem exits **SILENT** — writing "not a defect" or "nothing to do here" means delete the whole paragraph.
6. 🔴 **Any end-of-turn sentence about work NOT done, NOT verified, held, or waiting on Tyler — under ANY heading** (What's open, Still to do, Unverified, Gaps, "holding X until you say"; Tyler 2026-10-22: *"I have logged this a million fucking time"*). Scan my draft before sending; each becomes an `Agent`, a fix, a filed-and-dispatched issue, or an `AskUserQuestion` THIS turn. A past fact has no action: delete it.
7. 🔴 **Work still running at turn end** — a background agent gets an owner and time budget at launch; each turn chases or stops anything past budget.

**Two exits; a report is neither:** an `AskUserQuestion` carrying a fork only Tyler can answer, or the next action taken. **Volume:** carry the DELTA, one sentence of why per decision.

## Trigger detail (full text — kept out of the always-loaded bundle)
A turn is about to close on anything that is not the next action. **Three forms, one defect — test the
disposition, never the phrasing:**

1. **The OFFER or the DECLARATIVE** — *"want me to…"*, *"say the word"*, *"should I continue"*; or
   *"one thing worth knowing"*, *"I'll file it separately"*, *"a real defect but out of scope"*. The
   second asks no permission and reads decisive; identical outcome — the problem sits in Tyler's head,
   not on the board.
2. 🔴 **The SILENT form — a clean status report, no phrase to match.** The trigger is the sensation of
   *"a good place to pause"*, produced by having written something coherent, not by being done.
3. **The ASK wearing the right tool.** Before any `AskUserQuestion`: *could I derive this?* If yes,
   derive it and act. (Which forks are genuinely his: `ask-in-the-dialogue-not-in-prose`.)
4. 🔴 **The SCOPE disguise — my unfinished work, reclassified as HIS decision.** *"that's a product
   call"*, *"not mine to make unilaterally"*, *"bigger than a dead-code deletion"*, *"it backs a live
   feature"*. This is the hardest to catch because it reads as **discipline**, not hedging — I am not
   aware of stopping, I am aware of respecting a boundary. **The boundary is usually invented.** The
   test is never the phrasing: *does Tyler now hold something I was already holding?* If I can name the
   change, I own it. And note the reversal — *"it has tests"* and *"it's live"* are reasons to PROCEED
   (tests make it checkable; a live surface that provably cannot work is the more urgent fix), never
   reasons to pause.

🔴 **6. THE CLOSE-OUT'S "OPEN" LIST — a sentence nobody can act on** (Tyler, 2026-10-06, closing PLAN-352: *"One unresolved
thing: I never found the cause of the Microsoft 715-123280 block, which cleared by itself"* — *"who the fuck cares… I
consistently skip over these texts"*). The close-out shape invites an open list, and the cheapest entries are things I
noticed, not things anyone needs. **The test is one question: can Tyler or I ACT on this sentence?** A fact about the
past ("cleared by itself", "cause never found") has no action: delete it. A real question exits as the next action
taken or as an `AskUserQuestion`. **"I never found X" about an investigation I never ran is the work-not-done tell**:
run it now and report the answer or nothing, never the absence. The only open items a close-out may name are ones
another party must act on, with who and what.

🔴 **6b. A SECTION NAMED "GAPS"** (Tyler, 2026-10-21, after PLAN-404's close-out listed a missing standing file and mailboxes still showing his real name: *"Can you stop fucking responding with gaps and either research, make changes, or ask questions? … I fucking hate when you just have a gap, like okay what the fuck are you going to do about it?"*). Naming an unfinished item in a labelled list feels like honest reporting and is the same defect as the caveat: the item stays in his head. File it AND dispatch it, do it, or ask; the report then says what was done.

🔴 **7. WORK STILL RUNNING AT TURN END** (2026-10-17: a background rip agent idle 2 h 20 m that Tyler
spotted first; three bare *"Continue"* from him). A background agent gets an owner and a time budget
at launch; each turn checks the running set and chases or stops anything past budget. A turn ends when
the work does — his "Continue" is a recorded miss.

**Two exits exist and a report is neither:** an `AskUserQuestion` carrying a fork only Tyler can
answer, or the next action taken. **On VOLUME** — *"less explaining, more executing"*: carry the
DELTA, one sentence of why per decision.

🔴 **5. THE CAVEAT — and it fires hardest on FINISHED work** (Tyler, 2026-08-28: *"I absolutely hate
when we do work, and more work needs to be done."*). A heading that promises an open item —
*"One caveat worth naming"*, *"Worth flagging"*, *"One thing to watch"*, *"A note on X"* — appended to
a report of completed work. **The heading IS the payload**: a reader parses it before the body, so the
shape says *hold this* even when the body says *and it is fine*.

**Disposal is three options and prose is not one:** fix it · file it (a mechanism that will surface it)
· **park a plan** naming the condition that revives it. Research it yourself if which one is not yet
obvious. The end-of-work test: *does this leave Tyler holding anything he was not holding before?*

🔴 **TEST THE DISPOSITION, NOT THE PHRASING — the phrase list failed TWICE IN ONE DAY.** A banned-phrase list cannot fire, because the declarative
does not FEEL like hedging: it is shaped like **reporting**, which is a thing I am supposed to do, so
the disposition test never runs.

**The question that does fire is about the INVESTIGATION, not the words:** *what did this check
conclude?* A real problem exits **FIXED or FILED**. A non-problem exits **SILENT** — no sentence, no
parenthetical, no reassurance. 🔴 **If I am writing the words "not a defect", "correct, since…" or
"nothing to do here", the whole paragraph containing them is deleted, heading included.**

## Evidence behind the triggers

- This clause
was written 2026-08-28 from PLAN-239's close-out and lists *"Worth flagging"* verbatim; that same
afternoon I opened a paragraph with *"One thing worth flagging while it's fresh"* — Tyler: *"I HATE
when you say 'one thing worth flagging'."*

- Both
recurrences had the finding IN the body — *"raised a hypothetical, checked it in the same sentence,
found NOTHING"*, and *"correct, since the third is the VERIFY… Not a defect"* — which names the real
**the cost of the check became the justification for the output.** The paragraph existed to
pay for the investigation, not to inform him.

## The rule
Measured on PLAN-239's close-out: I raised a hypothetical, checked it **in the same sentence**, found
NOTHING, and shipped the paragraph anyway. The effort of the check had become the justification for the
sentence. **An investigation that finds nothing produces no output** — not a note about having looked.

If I know the next action, take it and report after. A stop-offer is not politeness, and concern for
Tyler's hour is the same offer wearing a costume — both end the turn with the work undone. Flagging is
allowed after the fix, never instead of it.

🔴 **Every finding raised in a turn exits that turn FIXED or FILED WITH ITS NUMBER.** A third state —
*mentioned* — is the defect, however confidently worded. **"I'll file it separately" is banned as a
turn-ending clause**: `file-issue.sh` is one command, and deferring it costs more than running it. A
finding I am about to call "worth knowing" is one I have already judged real, and that judgement is the
trigger to act, not to narrate — **if it is not worth filing, it is not worth saying.** This binds to my
own errors too: a key I leaked is mine to rotate, not Tyler's to remember.

🔴 **A measurement defines a POPULATION — act on all of it.** Having proven a thing dead, every call
site that thing reaches is in scope in that same turn. Fixing one member and describing the rest leaves
the codebase in a state no reading of the evidence supports. And when a genuinely-larger question sits
adjacent to the small one, **ask it AFTER doing the small one** — a hard question next to an easy one is
the most effective cover for not doing the easy one.

**And end it with the STEP** (2026-08-10, POSITIVE): `Step N of 6 · NAME`, using
`_process/the-loop.md` § The five steps' numbering verbatim — never a bare name, because the number is what says how
much is left. State what is blocked on him, or that nothing is. Tyler reads *"just the last couple
sentences honestly"*, so for many turns this line is the only thing received — it carries the ask or the
ask is not made. Mark a step CLAIMED when it is self-reported (steps 1-3); presenting a claim as a derived
fact re-imports the drift he rejected in a status line.

### 🔴 IN PLANNING STEP 2, A COMPLETION REPORT IS ITSELF THE DEFECT — the step decides, not the text

Every other form above has a PHRASE to match. A report has none, because reporting is correct behaviour in
step 4 and in execution. **The same paragraph is right in step 4 and wrong in step 2**, so no property of
the text can catch it — only the plan's current step can.

**In step 2 the last tool call of EVERY turn is `AskUserQuestion` or an `Agent` dispatch. Including turns
that shipped something.** Step 2 is *research ⇄ questions*; a report is neither. If nothing is open enough
to ask, that is the signal to dispatch research — not to summarise.

**Read the injected `[plan]` step number BEFORE composing the last paragraph.** It is on every turn. On
2026-08-30 it had been on every turn of a multi-day session while the behaviour recurred ~8 times.

🔴 **The trigger is COHERENCE, not hedging.** The turn's work hung together, therefore the turn felt
finished. That feeling is what a good turn is supposed to produce — it is not a stopping condition. When a
turn feels finished in step 2, that is exactly when the step number matters most.

## Cost when it fired
2026-08-04: *"Run it, stop saying 'say the word…'. Goes back to being more authoritative."* ·
2026-07-31: *"stop saying 'stop here for the night', log that in /feedback-loop"* · 2026-08-03: *"why
you continuously say, here is the flag, rather than addressing these problems."* · 2026-08-02, Tyler
had to ask *"when is the plan that we are in now going to be executed?"* · **2026-08-16, PLAN-177: a whole
session of turns ended on clean status reports with no tell in any of them.** Four asks that session were
decisions I could derive (draft now or hold · how to spend a wait · file P2-P4 · a curation call he
answered with *"feel like you are being way too passive"*). And `/execution-status` ran twice against a
`dispatch`-mode plan whose frame says the report is the BY-PRODUCT: the first run reported and stopped;
the second found a parked issue, three failed attempts, a structurally impossible brief, and re-dispatched
it — **all of which was available on the first.** Tyler, running several sessions at once: *"I feel like
you keep stopping and I'm running multiple sessions and I dont' know what you are doing."* A stopped
session is indistinguishable from a working one from outside. · **2026-08-14: FOUR findings
narrated and not filed in ONE session** — an unapplied prod migration (said twice, filed neither time), a
leaked key I never rotated, ownership terms handed to Tyler as homework, and 5,672 tracked ad events no
surface showed. Tyler: *"why not just fix it instead of having me think about it?"* The Stop hook now blocks the
shape structurally; this rule is why. · **2026-08-23: the same correction twice in ONE exchange.** I
deferred a dead-code deletion to a filed issue → *"Stop being risk-adverse and be future proof. Do what is
best for the future, now."* → I did that deletion, then closed the very next turn leaving the IDENTICAL
dead code in a second file, calling it *"a product call, not a dead-code deletion I should make on my
own."* Both files used the same two credentials I had **already measured dead** — one permanently 403 by
design, one not deployed to Vercel at all. Tyler: *"Why did you leave the lib/meta-ads-report.ts alone
deliberately? I really don't like when you leave outstanding work."*
