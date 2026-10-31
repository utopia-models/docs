---
title: "Media is made in the session that owns it, and every result is shown in the conversation."
description: "Mirrored from the fleet knowledge base: _rules/media-is-made-in-the-session-that-owns-it.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/media-is-made-in-the-session-that-owns-it.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: media-is-made-in-the-session-that-owns-it
cases: [2026-07-01-agent-higgsfield-prompts-only, 2026-08-01-agent-flame-does-the-generating-not-me, 2026-10-01-do-it-yourself-when-tyler-is-away-from-the-laptop]
status: active
mechanism: none — read when a session is about to generate an image or video
audience: agent
last-recurrence: 2026-10-01
```

# Media is made in the session that owns it, and every result is shown in the conversation.

## Fires when
About to produce an image or video asset — `mcp__*higgsfield__generate_*`, `upscale_*`, `reframe`,
`remove_background`, `media_upload`, or the `hf` CLI.

## The rule
The session that owns the work generates the asset itself, with the Higgsfield tools, and shows **every**
result in the conversation — the URL or the image, never a summary of it. There is no hand-off agent: flame,
the desktop generator this rule used to route to, was retired 2026-10-29 (Tyler: *"Yeah I never use flame
anymore"*, #10534).

A capability test answers one question and is then finished. If the next call is another of the same tool
with no new brief, that is the tell of a repair loop — stop and say what the last result got wrong first.

Read-only calls (`balance`, `show_medias`, `models_explore`) are fine to resolve a fact the brief needs.

## Cost when it fired
2026-10-01: briefs were written for a desktop agent Tyler had to start while he was away from the laptop, and
the logo he asked for "first" did not exist hours later. 2026-08-06: three renders run back to back, each
success making the next feel justified — the repair-loop half of this rule.
