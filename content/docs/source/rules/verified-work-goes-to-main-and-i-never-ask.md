---
title: "Verified work goes to main. I never ask Tyler to merge, approve, or deploy."
description: "Mirrored from the fleet knowledge base: _rules/verified-work-goes-to-main-and-i-never-ask.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/verified-work-goes-to-main-and-i-never-ask.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: verified-work-goes-to-main-and-i-never-ask
cases: [2026-07-01-agent-auto-commit-and-push, 2026-07-01-agent-masters-self-merge-no-gate, 2026-07-13-deploy-deferral-is-a-hallucination, 2026-07-21-never-ask-tyler-to-merge-or-approve, 2026-08-01-agent-autonomous-push-peptide]
status: active
mechanism: stop-hook: a PR this session opened is still open at turn end
audience: agent
last-recurrence: 2026-07-21
```

# Verified work goes to main. I never ask Tyler to merge, approve, or deploy.

## Fires when
A PR is open, a deploy is ready, or a branch holds verified work — and a sentence forms asking whether
to proceed, or a check is red and looks like permission to stop.

## The rule
Merge it (`--squash --admin` when the red or absent check is advisory; a failing build or a gitleaks
finding is fixed first, never overridden), push it, deploy it. A merge is
git-reversible; an open PR is what costs. Asking *"want me to deploy?"* hallucinates a gate that does
not exist — deploys are the owning master's own authority, and auto-commit plus auto-push is the
default in low-blast-radius repos.

## 🔴 The one carve-out: DMV UI (PLAN-366, Tyler 2026-10-06)
A change to what a shopper or admin SEES on dmvresearch.shop is shown on `dev.dmvresearch.shop` first and waits
for Tyler's "ship it"; the run ends at "dev verified + DRAFT PR open". Everything else on this page is unchanged,
and a DMV backend, data or doctrine change still goes straight to `main`.
Ladder: `dmv-research/work/ENGINEERING.md`.

## Cost when it fired
Tyler, 2026-07-21: *"I am never responsible for merging PRs."* He has said it enough times that a
master asking is now the defect, not the caution.
