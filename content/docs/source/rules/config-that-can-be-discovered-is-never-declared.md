---
title: "Config that can be discovered is never declared. A hardcoded fact is drift with a timestamp on it."
description: "Mirrored from the fleet knowledge base: _rules/config-that-can-be-discovered-is-never-declared.md"
updated: 2026-10-19
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/config-that-can-be-discovered-is-never-declared.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: config-that-can-be-discovered-is-never-declared
cases: [2026-07-23-discovered-not-declared-kills-config-drift, 2026-08-01-agent-load-bearing-config-confirm, 2026-08-28-the-existing-pattern-is-the-answer-before-a-new-one, 2026-09-08-infisical-doc-stale-claim-re-derived-wrong-conclusion, 2026-09-08-admin-customer-wrong-table-checked-twice, 2026-09-08-wsl-mounted-windows-path-is-reachable, 2026-09-19-asserted-a-ban-scope-from-a-claude-md-bullet-not-the-adr]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-09-19
```

# Config that can be discovered is never declared. A hardcoded fact is drift with a timestamp on it.

## Fires when
About to write a fact into a registry, doc or skill that a command could read at load — or to trust a value in `lib/`, an env file or a config table without confirming it live.
🔴 **Before proposing a mechanism for one member of a set, MEASURE THE OTHERS** (a fine-grained PAT for one master, when all four run classic PATs, cost 4 exchanges). Naming conventions come from the registry (`organization.yaml` retirements and `aka:` comments), never neighbouring names.
🔴 **A doc's "not found, checked <date>" is a SNAPSHOT** (three same-day recurrences, 2026-09-08: a stale Vercel-only key claim relayed as a live blocker; a guessed `users.tags` schema; a `C:\` path declared unreachable from WSL without trying `/mnt/c/` — Tyler: *"stop being stupid."*). **A confident claim of absence or unreachability, from a dated doc, a guess, or a category, is re-verified live before it changes what gets built, reported, or asked of Tyler.**

## Trigger detail (full text — kept out of the always-loaded bundle)
About to write a fact into a registry, doc or skill that a command could read at load — or to trust a
value in `lib/`, an env file or a config table without confirming it against the live system.
 🔴 **AND BEFORE PROPOSING A MECHANISM FOR ONE MEMBER OF A SET, MEASURE THE OTHERS** — recommending a fine-grained PAT for one master cost 4 exchanges when all four run classic PATs (2026-08-28). **A naming convention comes from the registry, never from neighbouring names**: `organization.yaml` records retirements inline and the `aka:` comment outranks them.
 🔴 **AND A DOC'S "NOT FOUND, CHECKED <DATE>" NOTE IS A SNAPSHOT, NOT A STANDING FACT** — THREE
 same-day recurrences, 2026-09-08. (1) `ENGINEERING.md` said `CLKK_API_KEY` was Vercel-only "checked
 2026-08-14," relayed to Tyler as a live blocker without re-running the one-command check, and Tyler
 had to correct it twice ("I have literally done this a million times... re-check infiscal again").
 (2) Guessed `users.tags` held the `admin-customer` marker instead of reading the two specs that
 already documented the real mechanism (`users.role`/`admin_allowlist`), and reported a
 plausible-but-wrong empty result as "broken" before the correction. (3) **Declared a `C:\...` path
 unreachable from a WSL session without trying the read** — WSL mounts the Windows filesystem at
 `/mnt/c/` by DEFAULT, the session's own system prompt says `Linux ...-microsoft-standard-WSL2`, and
 the file opened on the first real attempt. Tyler: *"yes it is accessible... stop being stupid."**
 **A confident claim of absence/unreachability — from a dated doc, a guessed schema, or a category
 ("that's Windows, I'm Linux") — is still a claim about a point in time or an assumption. Re-verify
 live before it changes what gets built, reported, or asked of Tyler.**

## The rule
Replace the assertion with the read. Where a value is load-bearing — wallet addresses, merchant IDs,
project refs, deploy scope — positive-confirm it across code, env and DB before using it. Stale is the
default state of anything hand-maintained, so the fix is never "maintain it better".

## Cost when it fired
Tyler: *"registry is wrong and hardcoded… should pull from real data not hardcoded data."* A wallet
address was corrected three times in one session because stale `lib/` values were trusted.
