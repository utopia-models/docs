---
title: "Commit as the author the deploy accepts — never override it, never merge as the wrong identity."
description: "Mirrored from the fleet knowledge base: _rules/commit-as-the-author-the-deploy-accepts.md"
updated: 2026-08-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/commit-as-the-author-the-deploy-accepts.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: commit-as-the-author-the-deploy-accepts
cases: [2026-07-01-agent-vercel-git-author, 2026-07-01-dmv-merge-as-authorized-author, 2026-07-01-win-vercel-seat-author-no-override]
status: active
mechanism: pretooluse: git commit in a Vercel-wired repo with an author outside the allowed set
audience: all
last-recurrence: 2026-07-01
```

# Commit as the author the deploy accepts — never override it, never merge as the wrong identity.

## Fires when
Committing or merging in any repo wired to a Vercel project, or setting a git author for a run.

## The rule
Use the repo's CONFIGURED git author; never override with `-c user.email`. The seat/owner check blocks
a non-seat author and the deploy simply never runs. Set it per repo once, then read it rather than
assuming it.

## Cost when it fired
The same block found three separate times by three different agents — agent, dmv and win — each
diagnosing it from scratch.
