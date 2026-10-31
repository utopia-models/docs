---
title: "Before a recurring procedure, search my own knowledge. Re-deriving a documented answer is the tell."
description: "Mirrored from the fleet knowledge base: _rules/search-what-i-already-know-before-re-deriving.md"
updated: 2026-10-24
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/search-what-i-already-know-before-re-deriving.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: search-what-i-already-know-before-re-deriving
cases: [2026-10-22-research-the-prior-method-before-improvising, 2026-07-22-context-assembly-no-retrieval, 2026-07-23-treated-established-canon-as-new, 2026-07-23-win-runs-on-glm-not-claude, 2026-08-03-impersonation-is-not-the-only-identity-the-sa-has, 2026-09-19-fleet-accounts-already-answered-the-gap-i-was-about-to-build, 2026-09-18-shared-master-login-is-doctrine-not-a-finding, 2026-09-22-claude-p-auth-error-is-not-a-broken-master-login, 2026-10-20-ground-in-fleet-context-before-proposing-accounts, 2026-10-21-tylers-numbers-were-documented-but-wired-nowhere, 2026-10-21-context-follows-the-plan-and-the-person-not-the-session]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-10-22
```

# Before a recurring procedure, search my own knowledge. Re-deriving a documented answer is the tell.

## Fires when
Starting a procedure done before (login, deploy, auth flow), treating established canon as a new reframe, or concluding a capability is absent from one negative probe.
🔴 **When `claude -p`, an SSH probe, or `~/.claude.json` `oauthAccount` returns anything error-shaped ("OAuth session expired", "access token has been revoked") about a master's login — STOP before concluding it is broken** (three times: 2026-09-18, 2026-09-22 ×2). It is the exact shape `login_health.entitlement_revoked` in `wi/registry/organization.yaml` documents as "KNOWABLE ONLY AFTER THE FIRST FAILURE, by design" and self-healing. Run `dispatch.sh --account <master>` and `dispatch.sh --quota` FIRST.

## Trigger detail (full text — kept out of the always-loaded bundle)
Starting a procedure that has been done before — a login, a deploy, an auth flow — or about to treat
established canon as a new reframe, or to conclude a capability is absent from one negative probe.

🔴 **Specifically: the moment `claude -p`, an SSH probe, or reading `~/.claude.json` `oauthAccount`
directly returns anything error-shaped ("OAuth session expired", "access token has been revoked",
an auth failure of any kind) about a master's login — STOP before concluding the login is broken.**
That exact probe has produced this mistake three times (2026-09-18, 2026-09-22 ×2 same session). A
live-sounding auth error is the single most convincing wrong signal in this fleet, because it is a real
command returning a real string — and it is also exactly the shape `login_health.entitlement_revoked`
in `wi/registry/organization.yaml` documents as "KNOWABLE ONLY AFTER THE FIRST FAILURE, by design" and
self-healing. The registry's own documented health check is `dispatch.sh --account <master>` and
`dispatch.sh --quota` — run those FIRST, always, before an ad-hoc probe's error string is treated as a
fleet-health finding.

## The rule
Grep the doctrine, `systems/`, the registry and the cases for the topic and read the hit first. A
service account has more than one identity; a master's runtime is not always the one I remember. When a
probe fails, the next question is which name or identity I checked, not whether the thing exists.

**For master login/auth/quota specifically:** the ORDER is fixed, and it exists because the three prior
recurrences and the fourth answer two DIFFERENT questions that sound like one.

1. **`dispatch.sh --account <master>` / `--quota`, and `wi/components/master-liveness-checks.md`'s
   checks 1-2 (the fleet-accounts feed, `pgrep`) — run these FIRST, always.** They answer *"which
   account is this box on, and is a process alive."* They are free and they are right almost every
   time — three of the four recurrences below stopped here, correctly.
2. 🔴 **THESE DO NOT ANSWER "CAN A FRESH DISPATCHED PROCESS AUTHENTICATE RIGHT NOW."** A long-lived
   interactive session holds its OAuth token in memory from when it STARTED and never re-reads the
   on-disk credential file; a fresh dispatched process (every real dispatch) reads that file at
   startup. These can genuinely disagree — a box can be "alive" by checks 1-2 while every new dispatch
   fails, because the on-disk file went bad AFTER the interactive session started. This is not a
   hypothetical: it happened on `win`, 2026-09-23, and checks 1-2 both read healthy while three real
   dispatch attempts failed with the identical error string checks 1-2 would have you disbelieve.
3. **The tie-breaker is never another opinion about the error string — it is whether a REAL DISPATCHED
   RUN has already failed on the board**, with a genuine `✘` and `error class: auth/config`, more than
   once. If checks 1-2 say healthy AND no real dispatch has failed: the error-shaped string you are
   looking at is very likely the false-alarm shape from the first three recurrences — do not escalate
   it. **If checks 1-2 say healthy AND a real dispatched run has genuinely failed on the board twice or
   more: that is evidence checks 1-2 cannot see, not evidence to discard.** Confirm it the hard way —
   `master-liveness-checks.md`'s check 3, a `systemd-run --user -- claude -p` probe (the SAME shape a
   real dispatch uses, not a bare `sudo -u <master> claude -p`), or a direct Anthropic API call with the
   raw on-disk `accessToken` — before concluding either way.
4. **Never conclude from `claude -p` run OUTSIDE the `systemd-run --user` shape, SSH alone, or a direct
   `~/.claude.json` `oauthAccount`/`expiresAt` read.** None of these three is equivalent to how a real
   dispatch actually authenticates, in either direction — they can false-positive (a bare `sudo -u
   <master> claude -p` may not inherit the same environment a dispatched unit does) as readily as they
   can false-negative.

## Cost when it fired
The headless-master login was re-derived by trial and error across four tool calls while documented at
`systems/auth-mode-per-master.md` — Tyler: *"You have done this a million times before… your context
assembly is still not adequate."* And win runs on GLM, not Claude, forgotten repeatedly.

**2026-09-18:** shared master logins (win/nova/cloud on one Claude subscription) reported as a discovery
needing Tyler's confirmation, when `organization.yaml`'s `per_agent_login`/`emails_ROTATE` fields already
state this is deliberate. Same session: recommended a raw Anthropic API key over the CLI subscription
model, contradicting the registry's flat-subscription cost doctrine outright. Tyler: *"This is a huge
fucking hallucination on your end... you need to run thorough research AND ask me questions to verify
and clarify."*

**2026-09-22/23, same session, twice:** ran `claude -p "say ok"` via SSH on win/nova/cloud, got
auth-failure-shaped strings on all three, and reported "3 of 4 masters have broken logins" as a real
fleet emergency needing Tyler's manual browser re-auth. Tyler had just run bare interactive `claude` on
`win` himself with no error. `dispatch.sh --account <master>` / `--quota`, run immediately after, showed
all four masters valid with quota clear — the registry's own documented check would have caught this in
one command, before anything was reported. This is the third occurrence of the same shape in one rule's
lifetime, which is what finally sharpened the "Fires when" above from a general principle into the
literal probe and the literal remedy.

**2026-09-23, `win`, fourth occurrence — and this time the raw probe was RIGHT, which the rule as
written could not distinguish.** `dispatch.sh --account win` and `--quota` both read healthy;
`pgrep -u win -fa claude` showed a live process (tmux, running since 2026-08-09). Concluded the OCC's
"executor unknown" and the ✘ markers on #7912/#7923 must therefore be another instance of the same
false-alarm pattern — until Tyler interrupted: *"it's not broken, you are wrong. you can literally ssh
in and run claude... I thought I had this fixed earlier in a previous session. Run thorough research on
this."* Real research (not another probe) found the actual mechanism: `~/.claude/.credentials.json` on
`win` was rewritten 2026-09-22T04:54:14Z — the SAME MINUTE the first dispatch failure landed on #7912 —
and the tmux process (started over a month earlier) never re-reads that file, so it stayed
authenticated in memory while every fresh dispatched process read the now-dead token. Confirmed dead by
calling the Anthropic API directly with the raw `accessToken`: `HTTP 401`, bypassing the CLI's own error
wrapper entirely. **The three prior recurrences and this one are not the same failure mode wearing
different clothes — `dispatch.sh --account`/`--quota` answers a real question and answered it
correctly all four times; the question was just narrower than "can a dispatch authenticate."** Fixed:
`wi/components/master-liveness-checks.md` gained a third check (the `systemd-run --user` probe, the
same shape a real dispatch uses) for exactly this gap, and this rule's remedy section above now states
the tie-breaker — a real dispatched ✘ on the board, not another opinion about an error string, is what
promotes a "looks healthy" read to "check 3."
