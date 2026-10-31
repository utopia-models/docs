# `AI-INTAKE.md` — the output contract

Step 2 reads this file. It is the interface between the two, so its shape is fixed: write these four
sections, in this order, with these headings.

---

## Section 1 — `## WHAT IS`

Everything you measured, **each fact with the command that produced it**, so the reader can re-run any
line and check you.

```markdown
| fact | value | how I know |
|---|---|---|
| OS | Ubuntu 24.04 | `cat /etc/os-release` |
| systemd | running as PID 1 | `ps -p 1 -o comm=` → systemd |
| node | v22.11.0 at ~/.nvm/... | `bash -lc 'command -v node'` |
| node (non-interactive) | ABSENT | `bash -c 'command -v node'` |
```

Then, in prose under the table: harnesses and versions · every config file with its path, byte count
and what it asserts · skills and rules, **with the ones that would never fire named** · MCP servers
and whether each is authenticated · working directories and which are on the Linux filesystem ·
where credentials and transcripts live (paths only, never contents).

Where a check was inconclusive, write **inconclusive**. Never fill a gap with what is usually true.

## Section 2 — `## WHAT THEY SAID`

The answers, grouped by the interview's own round groups. Mark anything you inferred rather than heard
as an inference — a later step will act on this file and cannot tell the difference otherwise.

## Section 3 — `## WHAT CONTRADICTS`

🔴 **The most valuable section, and the one only an agent that did both halves can write.**

Every place the survey and the answers disagree, and every place two things on the machine disagree
with each other. Do not soften them.

```markdown
- **They believe the deck skill fires. It cannot.** Its description is "helps with decks", which names
  a topic rather than an occasion. Measured: `~/.claude/skills/decks/SKILL.md`.
- **Two sets of notes disagree on the same number.** `context/brief.md` says 166; `NOTES.md` says
  12–15. Neither records which question it answers.
- **An MCP server is configured and has never authenticated.** `~/.claude.json` lists it; the auth
  file is absent.
```

If there are none, say so plainly. An empty section is a real finding; an invented one poisons step 3.

## Section 4 — `## WHAT IS MISSING`

What you could not measure, what they declined to answer, and what you would check next. Name the
command that would have answered each, so it can be run later without rediscovering the question.

---

## Rules

- **One file.** `~/AI-INTAKE.md`. Do not scatter this across several.
- **No recommendations.** This file records what IS. Step 3 decides what to do, and mixing the two is
  how a wrong assumption gets laundered into a plan.
- **No credential contents, ever.** Paths and existence only.
- **Written even if the interview was cut short.** A partial intake with an honest
  `WHAT IS MISSING` is usable; a missing file is not.
