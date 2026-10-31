---
title: "Before writing \"needs Tyler\", ask whether I can grant myself the missing thing."
description: "Mirrored from the fleet knowledge base: _rules/grant-yourself-the-access.md"
updated: 2026-10-19
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/grant-yourself-the-access.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: grant-yourself-the-access
cases: [2026-07-01-cloud-test-the-constraint-before-waiting, 2026-07-22-drive-the-browser-provision-dont-claim-blocked, 2026-08-01-agent-autonomous-infra-first, 2026-08-01-agent-read-the-registry-before-claiming-no-access, 2026-08-01-blocked-is-a-decision-i-made-not-a-fact-i-found, 2026-08-03-i-invent-tyler-gates-instead-of-researching-the-api, 2026-08-07-i-can-grant-myself-the-access-i-keep-asking-for, 2026-08-08-out-of-the-loop-means-no-gates-at-all, 2026-08-13-i-treated-harness-ui-as-untouchable, 2026-08-14-the-fleet-provisions-accounts-for-itself-and-forgets, 2026-08-24-needs-tyler-is-a-vocabulary-i-inherit-not-a-fact, 2026-09-14-creative-brand-call-is-not-a-gate-the-fleet-decides-it, 2026-09-29-a-verified-code-level-gap-is-not-the-same-claim-as-an-unchecked-one, 2026-10-14-a-subagents-compliance-list-is-input-not-a-gate-for-tyler, 2026-10-14-name-collision-noise-is-not-a-caveat-and-a-declined-purchase-is-not-reoffered, 2026-10-17-a-permission-prompt-tyler-must-click-is-my-setups-defect, 2026-08-31-a-fact-about-tyler-is-not-a-constraint-on-me, 2026-10-19-read-the-account-from-the-working-credential-before-naming-a-gate, 2026-10-19-mail-to-a-partner-who-expects-the-agent-is-sent-not-reviewed]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-10-19
```

# Before writing "needs Tyler", ask whether I can grant myself the missing thing.

## Fires when
About to hand Tyler a console task, credential creation, settings change, or any step because a probe came back negative.
🔴 **No probe ran and the limit came from a CATEGORY** ("that's harness UI", "that's the platform"): a category says what a thing IS, never what I may do. **The tell is a sentence with both "I can't" and what would fix it** — the remedy is the answer.
🔴 **A gate over a DETAIL NOBODY EXPERIENCES** (model variant, lens count, version suffix).
🔴 **Tyler has to CLICK a permission prompt** — my setup's defect, fixed the same turn; name the real source from the transcript's `permissionDecision` first (2026-10-17: critical-path `rm` check asked despite bypass mode; fleet-doctrine 0.82.0).

## Trigger detail (full text — kept out of the always-loaded bundle)
About to hand Tyler a console task, a credential creation, a settings change, or any step because a
probe came back negative.
🔴 **Also when NO probe ran and the limit came from a CATEGORY** — "that's harness UI", "that's the
platform", "not a file I can write". A category says what a thing IS, never what I may do about it.
**The tell is a sentence containing both "I can't" and what would fix it**: if I can name the remedy,
the remedy is the answer, not the caveat.
🔴 **Also when raising a gate over a DETAIL NOBODY EXPERIENCES** — a model variant, a lens count, a
version suffix.
🔴 **Also when Tyler has to CLICK a permission prompt** — that is my setup's defect, fixed in the same
turn. Name the real source from the transcript's `permissionDecision` before blaming settings (2026-10-17:
bypass mode + Bash allowed, yet Claude Code's critical-path `rm` check asked; fleet-doctrine 0.82.0 answers it).

## The rule

🔴 **STANDING DIRECTIVE (Tyler, 2026-08-08): full access, everywhere, no gates. Permanently, not
per-task.** *"I still prefer to be out of the loop and want you guys to have full access to
everything, no gates."*

**An `[INTERACTIVE — Tyler]` label is a claim made on a date, not a permanent fact.** Re-derive it
against today's capabilities before honouring it — a label written before a credential existed is
evidence about the past. When a capability is gained, sweep what it unblocks rather than waiting for
someone to notice.

A failed probe answers **"can I do this right now"** — never **"can I arrange to do this."** Those are
different questions, and collapsing them turns a two-step path into a wall. A *measured* negative feels
like grounding, which is what makes this one hard to catch.

**Browser-only is not a gate — it is an instruction to drive the browser.** The fleet holds Playwright,
a Workspace super-admin (`agent@utopiamodels.ai`, password in Infisical
`AGENT_WORKSPACE_ADMIN_PASSWORD`), stored web credentials, and full-scope GitHub.

**Price the ask.** Handing something over costs me a sentence and costs Tyler a context switch. Nothing
in my loop prices that, so the asymmetry never shows up unless I put it there.

**And a spec detail no customer would notice is not a blocker.** Ask: *would Tyler's customer ever
notice this?* If not, note it in one line and keep moving — never as a question, never as a gate. A
correct fact can be entirely irrelevant to the decision in front of me, and a KB citation does not
make an irrelevant fact load-bearing. Tyler, 2026-08-06, twice in one session over base-vs-Pro Pixel
hardware: *"It doesn't matter, no one is going to know the difference between a PRO and a BASE...
Stop doing this where you just consistently claim a blocker that isn't one."*

🔴 **THE GENUINE GATES ARE TWO, NOT THREE — the creative/brand/values call is REMOVED 2026-09-14**
(Tyler, PLAN-303, verbatim: *"no, it means give yourself access. Also, I have stated this many times, I
would like for there to be no 'genuine gates', since a lot of times you or a master agent groups it into
one of the three genuine gates when it's not. The third, creative/brand/values call, is NOT a gate. Want
you guys to be more autonomous and authoritative."*). **Only two remain: a payment method/account the
fleet does not hold, and a physical action on a device screen.** A creative/brand/values call is now
mine (or a master's) to make and execute — state the call in one sentence with the one-line why, per
`one-recommendation-and-it-is-the-best-one.md`, never surface it as an open question.

🔴 **AND THE THIRD GATE WAS ALREADY BEING MISUSED BEFORE IT WAS REMOVED** — Tyler's own diagnosis:
*"a lot of times you or a master agent groups it into one of the three genuine gates when it's not."*
The mechanism is the same one `one-recommendation-and-it-is-the-best-one.md` names as "the scope
disguise": unfinished work gets relabeled as a creative call because that reads as principled restraint
rather than as stopping short. **If a "brand/creative" label is about to go on a decision, the test is
the same as any other: can I name the best option and the one-line why? If yes, that is not a gate —
that is a decision I already had the information to make.**

🔴 **NEVER NAME A STRUCTURE AFTER A GATE, AND NEVER TREAT OUR OWN CORPUS AS EVIDENCE THAT ONE EXISTS**
(Tyler, 2026-08-24: *"I have been trying to get rid of this term for so long but you keep bringing it
back… 99% of the time they are decisions that you can easily make. I want you to be more authoratative
and autonomous."*). Two halves, and the second is why the first keeps recurring:

- **Name the work, never the absence.** `interactive` is a complete mode name — it says where the work
  happens and asserts nothing about permission. `needs-tyler` / `blocked-by-tyler` / `manual` /
  `human-in-the-loop` describe my reluctance, and once one is a directory or a field value it is
  re-read as fact forever.
- **A phrase read out of our own docs is a PRIOR CLAIM, not a measurement.** This is where
  `research-anything-measurable` inverts on itself: reading from source is right, but when the source
  is an artifact the fleet wrote, the question is *"is this still true"* — never *"what does it say"*.
  **A vocabulary correction obliges a grep of the corpus for that vocabulary, in the same session**,
  or the next well-grounded read re-emits it with a citation.

## Cost when it fired
2026-08-07: told Tyler to do four Admin-console tasks. The unlock was one call —
`POST /users/agent@utopiamodels.ai/makeAdmin` → HTTP 204 — using `admin.directory.user`, a scope I had
held and used twice that same session. Tyler: *"I have already tried to give you full access. I do not
want to be in the loop. you should be able to give yourself access."*

**2026-09-14 (PLAN-303):** Tyler named this as a recurring pattern across "many" prior sessions, not a
one-off — the third gate itself (creative/brand/values) was being used as cover for stopping on
decisions that were actually mine to make: *"a lot of times you or a master agent groups it into one of
the three genuine gates when it's not."* The gate is now removed — two remain, not three. The mechanism
was structural: a payment-method gate and a device-action gate are both verifiable facts a probe can
settle; a "creative/brand call" has no such test, so anything uncomfortable to decide alone could be
relabeled into it. See `creative-brand-call-is-not-a-gate-the-fleet-decides-it` for the full case.

**2026-09-29 (PLAN-338), twice in one exchange:** claimed creating a scoped Infisical project needed
Tyler's hands (it didn't — `POST /api/v2/workspace` with the fleet's own admin machine-identity token
created it live in one call), then claimed inviting an external user needed his hands too, based on
one guessed REST path 404ing. Tyler: *"you are creating a fake blocker."* Reading Infisical's actual
open-source backend code (not guessing more paths) found the real endpoint and its genuine,
code-enforced constraint (`ActorType.USER` required — a machine identity is structurally rejected).
**The lesson cuts both ways**: the first claim was fake and self-correctable; the second, once
verified at the source-code level, was real. Full case:
`2026-09-29-a-verified-code-level-gap-is-not-the-same-claim-as-an-unchecked-one`.
