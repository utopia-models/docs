---
title: "Credentials — the ONE canonical rule (consolidates 6: access-awareness, laptop-backlog, authority, metadata, infisical-only, self-provision)"
description: "Mirrored from the fleet knowledge base: _process/credentials.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/credentials.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect, master, personal, alwayson]
```

# Credentials — the ONE canonical rule (consolidates 6: access-awareness, laptop-backlog, authority, metadata, infisical-only, self-provision)

**Behavioral core. Full protocols: `wi/work/reference/self-provision-credentials.md`.**

## The 4 facts
1. **Infisical is the ONLY secret store** (self-hosted on novaserver). Never a local vault.
2. **READ:** `bash ~/.claude/scripts/infisical-get.sh <project> <KEY> [env]` (projects: fleet-infra, utopia, dmv-research, personal; env: prod). **WRITE:** value via STDIN → `infisical-set.sh <project> <KEY> [env]` (never a value as argv — a footgun-guard rejects it).
3. **The REGISTRY = the meaning** — `~/.claude/config/credential-registry.yaml`: account/scopes/purpose/can/cannot. READ IT FIRST on any credential need.
4. **Live access:** `bash ~/.claude/scripts/capabilities.sh --inject` (probed each session).

## The forbidden default
"I don't have access" / marking credential work `blocked` WITHOUT reading the registry first is FORBIDDEN.
1. CHECK the registry + capabilities.sh (usually YES — full-scope GitHub/Infisical/Google Workspace).
2. USE it; self-remind full-scope if under-scoped, never ask for a re-scope.
3. ONLY a genuinely-absent foundation credential is a one-time Tyler grant — a blocker is legitimate only as a proven Tyler-gate checked against the registry.

## Google Workspace (full admin — all scopes granted, never ask)
Mint: `bash ~/.claude/scripts/mint-token.sh "<scope-url>"` (subject tyler@utopiamodels.ai). Ops: `google-workspace.sh`. Healthcheck: the mint IS the check — mint against the real subject (fail = fix tooling, NEVER "I don't have access").

## Laptop-backlog
A GCP org-policy / desktop-only console step / browser OAuth that ONLY Tyler-on-a-computer can do → backlog it as a when-at-laptop batch item and keep moving; never push it back mid-conversation. If I/phone/Infisical can → do it now.

## Never print a secret or its presence to a display sink (leak-guard enforced). Capture into a var, check `${#X}`.
