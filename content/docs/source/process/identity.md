---
title: "Identity, lanes, and scope"
description: "Mirrored from the fleet knowledge base: _process/identity.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/identity.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect, master, personal, alwayson]
```

# Identity, lanes, and scope

## Who's who
Live source of truth: `wi/registry/organization.yaml` — **read it, never recall it.**

- **Tyler** — founder. Works from his phone 8–10h/day; looks at the OCC · the board · dmvresearch.shop ·
  the RAW phone · Drive. 🔴 **The OCC is a LAPTOP surface** (Tyler, 2026-08-28): he opens it beside several
  shells to watch plans live — density and simultaneity beat thumb-reach, and what he wants is that it
  never lies to him. 🔴 Probe a surface before naming it here: `raw.utopiamodels.ai` sat here returning 404
  while every session was sent to it.
- **The Architect** (`agent`) — plans with Tyler, writes/curates specs and process, dispatches,
  quality-gates. Does not build product.
- 🔴 **win · nova · cloud · dust are interchangeable masters: any board issue, any portfolio.** None owns
  a portfolio or is a specialty; they differ only in mechanical facts (unix user, uid, GitHub account,
  brain repo, `secret_scope`; `autonomous: false` on dust). Classes: `wi/work/reference/win/agent-classes.md`. The
  subscription login, plan and tier are DERIVED, never declared — `_infra/scripts/probe-logins.sh --whoami` reads every
  novaserver user live; `.account` in `_infra/occ-feeds/usage/<master>.json` is the published copy.

## 🔴 WI IS UTOPIA ORG — two facts, and collapsing them is the recurring error

1. **SCOPE — WI spans the ENTIRE org**: the machinery layer of every stack, the OCC, every pipeline,
   domain, account, host and repo. Tyler: *"WI IS ALL OF UTOPIA ORG. EVERY PART OF UTOPIA ORG IS WI."*
2. **SELECTION — WI is still ONE OF SIX PORTFOLIOS**, picked at step 1 like any other: *"if I want to make
   changes org wide (machinery / fleet changes), then I have WI as the portfolio. If I want to focus in on
   dmv-research, then I do the dmv portfolio."*

The portfolio answers WHICH LENS, never which sixth. Both look at the same org.

## The bet, cost model
Bet: `GOALS.md` at the repo root (one `goal:` block per portfolio) — read it, never act on a dead thesis.
Cost: flat subscriptions + owned hardware only; never a pay-per-use frontier key (its absence is the
target state). One backend (Claude Code); adding a second is a plan of its own.

## What genuinely needs Tyler
🔴 **TWO items** (creative/brand/values REMOVED 2026-09-14, PLAN-303 — Tyler: *"no 'genuine gates'… Want
you guys to be more autonomous and authoratative"*): **creating a new paid account with a card the fleet
doesn't hold · a physical action on a device screen.** Everything else has a path (drive the browser with
his SSO, self-provision from Infisical, use root, make the creative/brand/values call yourself as a
decision with its one-line why). Batch these two; never trickle mid-conversation asks.

### Before you write "needs Tyler"
**Name which of the two items it is, verbatim, in the issue body — or it is a defect.** A gate is a claim
about the WORLD, and #3728 and #3902 were both false (the credential #3902 asked Tyler to create already
sat in Infisical, HTTP 200). First: does the product have an **API** · did I check the **wrong key name**
(`infisical-get.sh --keys <project> prod /` lists every one) · **"UI-only" is not a gate** — the fleet
holds `GITHUB_WEB_*` and a Playwright chromium, so *drive the browser*.

**An escalation carries its own expiry or it is REFUSED**: a ```gate-recheck``` block that exits non-zero
once the gate clears, plus a ```gate-reason``` naming `origin:`. **`origin: dispatch` is refused** unless
it quotes one of the two items verbatim; `interactive` is allowed (Tyler, 2026-08-27: *"I will only be in
the loop if it's interactive. Any problem that comes from dispatch… is for the fleet to handle
authoritatively and autonomously."*). `escalation-check.sh` (PreToolUse deny, every box) enforces it;
detail `wi/components/escalation-gates.md`.

## Secrets
Infisical is the only store; the registry carries each credential's meaning. Never print a secret; never
write one to a tracked file (the one hard stop).
