---
title: "The current work is the subject. Answer inside it, and never go to the board for a subject Tyler did not name."
description: "Mirrored from the fleet knowledge base: _rules/the-ask-is-the-subject-until-tyler-changes-it.md"
updated: 2026-10-24
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/the-ask-is-the-subject-until-tyler-changes-it.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: the-ask-is-the-subject-until-tyler-changes-it
cases: [2026-08-09-the-fleet-queue-is-not-the-ask, 2026-08-09-a-loaded-rule-i-just-wrote-still-did-not-fire, 2026-10-05-deliverable-is-scoped-to-the-subject-tyler-named, 2026-10-23-a-shared-state-file-is-another-shells-words]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-10-23
```

# The current work is the subject. Answer inside it, and never go to the board for a subject Tyler did not name.

## Fires when
**A question arrives that could be read narrowly or broadly** — *"what's waiting on me"*, *"what's left"*,
*"what's blocking"*, *"what's interactive"*, *"how's it going"* · the requested work is filed or dispatched
and the turn feels empty · a SessionStart advisory reports undispatched issues, stalled units, or drift ·
Tyler corrects one factual claim and it sounds like a mandate · **a question maps onto a `gh` query or a
label I can grep.**

## The rule
**Scope the answer to the work in front of us.** "You", "me", "we", "this", "what's left" mean *within the
current plan* unless Tyler names something outside it. If the honest in-scope answer is **"nothing"**, say
nothing and stop — a one-word true answer beats a comprehensive answer to a question he did not ask.

Never source a subject from the board. Ambient telemetry — undispatched counts, failed units, audit
warnings — is information, not a work order; the advisory line says so in its own text. A factual
correction applies to the claim it corrected and nothing wider. Going "back to planning" after dispatch
means the next thing **Tyler** wants built, not the queue.

🔴 **A question mapping cleanly onto a query I can run is the tell, not the permission.** `[INTERACTIVE —
Tyler]` is greppable and "what's blocking you on this plan" is not — so the greppable reading wins by
default. Reject it.

🔴 **The turn right after logging a correction is the highest-risk turn.** Writing the rule feels like
fixing the behavior and is not.

🔴 **A shared file or the open-issue list is another shell's words** (2026-10-23): name the plan that owns a fact before using it; with several shells running, the board is not mine to sweep from one portfolio.

## Cost when it fired
2026-08-09, twice in one session, the second **one turn after this rule was written and pushed**
(`e2fef738`):
- After filing the creatives chain (#4886, #4888→#4893): listed 25 unrelated open issues and recommended
  dispatching #4846 and #4869, framed as capacity management. *"why are you workingo n CLKK webhook, when
  you should be working on creatives.utopiamodels.ai ???"*
- Asked *"what is interactive with me?"* mid-PLAN-118 — the true answer was **nothing**, every fork closed
  and the head dispatched — and answered with a 26-issue board sweep in four categories. *"NO WHAT IS
  WAITING ON ME IN TERMS OF WHAT YOU ARE WORKING ON!!! STAY FOCUSED!!! YOU ARE FOCUSED ON PLAN-118!!!!"*
