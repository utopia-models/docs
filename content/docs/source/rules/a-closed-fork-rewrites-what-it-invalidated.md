---
title: "A decision is not made until the artifacts that state it are rewritten."
description: "Mirrored from the fleet knowledge base: _rules/a-closed-fork-rewrites-what-it-invalidated.md"
updated: 2026-08-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/a-closed-fork-rewrites-what-it-invalidated.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: a-closed-fork-rewrites-what-it-invalidated
cases: [2026-08-08-i-researched-a-superseded-document-for-two-runs, 2026-08-09-a-plan-i-do-not-update-is-a-plan-tyler-has-to-audit]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-08-09
```

# A decision is not made until the artifacts that state it are rewritten.

## Fires when
Tyler resolves a fork, reverses a decision, or answers an `AskUserQuestion` — and you are about to
write the NEXT section. Also when reusing any extract, draft, title or published page created before
that answer.

## The rule
**Before writing anything new, re-read what is already written against the new decision.** The H1, the
published artifact, the phase headings, the filename, the SETTLED section. One question: *does
anything above this still describe the version we just replaced?*

**Republish the artifact at every fork closure, not at COMMIT.** Same file path keeps the URL. An
artifact published once and never republished is worse than none — it looks current, carries a
timestamp, and states decisions already reversed.

**Prefer derived over hand-maintained.** `task regen` re-derives title and phases from the plan
document, so a corrected H1 fixes the registry for free. Anything with no derivation — filenames,
artifacts, prose summaries — is the part that stays wrong, so name files from stable ids
(`plan-116-<slug>`), never from a title a fork can change.

**A cached extract is not the source.** Re-read the source directory, not the copy you made of it.

## Cost when it fired
2026-08-09: Tyler corrected the same plan's state THREE times in under an hour — a stale title after
he scoped it down (*"are we still using meta prompts?"*), a stale artifact and filenames (*"The
artifact and plan seem to be legacy too"*), and a mechanism I had asserted without checking
(*"I thought .claude/commands was soon to be legacy"* — he was right). Each was a check I could have
run and did not. The plan's own subject was documentation that cannot drift.

2026-08-08: 136 agents ran against `sol.txt`, a days-old extract matching neither PDF in the source
folder. The unread file was amendment 0002 — it flipped the set-aside to FOR small business and moved
the due date. I had noted that file existed and never opened it.
