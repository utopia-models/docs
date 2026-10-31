---
title: "Before drafting text Tyler will send in his own name, read the voice checklist — not a felt sense of \"sounds like him.\""
description: "Mirrored from the fleet knowledge base: _rules/match-tylers-voice-before-he-sends-it.md"
updated: 2026-10-24
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/match-tylers-voice-before-he-sends-it.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: match-tylers-voice-before-he-sends-it
cases: [2026-10-14-a-draft-for-tyler-is-tested-against-his-real-thread-and-is-not-an-ask-to-send, 2026-10-21-drafts-for-tyler-are-checked-against-the-checklist-every-time, 2026-10-22-thank-you-copy-starts-from-his-own-sent-words]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-10-22
```

# Before drafting text Tyler will send in his own name, read the voice checklist — not a felt sense of "sounds like him."

## Fires when
About to draft any essay/short-answer response, cold outreach email, or LinkedIn DM that Tyler will send in his own name — in ANY portfolio, whatever plan or subprocess is bound. Judgment-shaped, not tool-call-shaped, so it cannot be a hook.

## Trigger detail (full text — kept out of the always-loaded bundle)
About to draft any essay/short-answer response, cold outreach email, or LinkedIn DM that Tyler will
send in his own name — in ANY portfolio, regardless of what plan or subprocess is currently bound. This
is judgment-shaped, not tool-call-shaped: nothing marks "I am about to draft voice-sensitive text" the
way a tool call marks a generation request, so it cannot be a hook and has to be a rule read every turn.

## The rule
**Read `net/subprocesses/interactive/voice.md` in full before drafting**, even if this session's bound
plan/portfolio is not `net`. It names a tone per context (short-answer/essay, cold email, LinkedIn DM)
and gives each a checklist of properties **measured** from a real sample Tyler wrote himself — sentence-
length pattern, hedge-word count, first-person density, hard-number usage, self-comparison claims —
never a vibes-based "sounds authentic" check. Check the draft against the checklist; do not draft from
memory of the last thing that read close enough.

🔴 **A tell as small as an em-dash is real signal, not pedantry.** Tyler corrected one on sight
(2026-09-04) — his own writing uses commas, not em-dashes, and every polish pass that "fixes" his rough
edges (an uncorrected typo, a repeated intensifier, a run-on sentence) is drifting toward AI-sounding
prose, which is the exact failure this rule exists to prevent.

## Why this is a rule and not a subprocess pointer
`net/README.md`'s own pointer to `voice.md` only reaches me once, at Q2 of `/plan-start`, for a session
that opens with portfolio=`net` — and does not survive compaction (`_process/steps/1-brief.md`: portfolio
`README.md` reads are one-shot, "re-read it after a compaction"). Tyler named the gap directly
(2026-09-04): *"subprocesses are only wired if we are in the subprocess... we are not working on the
subprocess, but you still need context of it specifically for this."* The rules corpus is compiled into
`_process/_generated/bundle-architect.md`, which `~/.claude/CLAUDE.md` loads on every turn regardless of
binding — the same mechanism `write-in-tylers-voice-not-mine` already uses for the structurally
identical partner-message-voice problem. This entry exists so the trigger fires without Tyler having to
re-explain it, ever again, in any portfolio.

🔴 **The checklist's samples must be his own sent words, and survey advice never outranks them** (2026-10-22): Tone 5 was built from four surveys and one sample, and both thank-you drafts were rejected; Tyler sent "Would love the opportunity to work at Apex… very excited" and edited "I'm" to "I am very". Start from a template cut from his sent notes.

## Cost when it fired
No case yet — this rule was written proactively from a real gap Tyler named in conversation
(2026-09-04, PLAN-285), not from a correction after the fact. If a future drafting turn misses
`voice.md` and produces text that reads polished/AI-shaped, that failure belongs here as the first case.
