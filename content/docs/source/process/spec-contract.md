---
title: "Writing a spec a master can finish (the 8-point contract)"
description: "Mirrored from the fleet knowledge base: _process/spec-contract.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/spec-contract.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect]
load: on-demand
reader: `_process/steps/3-file.md` — read when a spec is being written
```

# Writing a spec a master can finish (the 8-point contract)

**AGENT BOX ONLY** (`audience: agent`, #5341). A dispatched master READS a spec; only the Architect writes
one. Masters get the one line that binds them, in `the-loop.md` § Specs.

1. **Values, never snapshots.** Write paths/IDs/URLs literally. Say how to DETERMINE current state and what must
   be TRUE when done — never assert what the state *is*. (Specs rot in hours: #2786's masters corrected four
   snapshot claims in under two.) **This includes the files the phase will CHANGE** — *"the hook"* is not a
   path. Two of #4506's three phase bodies never wrote theirs down, so the filing-time same-file check
   (`_infra/scripts/chain-collision-check.sh`, #4528) could only report that it was blind while all three
   edited one file in parallel.
2. **Acceptance is written in EARS, and `file-issue.sh` refuses a Feature whose criteria are not**
   (#7387). Every criterion parses as ONE of these, or the filing does not happen:

   ```
   WHEN  <trigger>        THE SYSTEM SHALL <behavior>
   IF    <trigger>, THEN  THE SYSTEM SHALL <behavior>
   WHILE <state>          THE SYSTEM SHALL <behavior>
   WHERE <feature>        THE SYSTEM SHALL <behavior>
   ```

   A criterion is a PARAGRAPH or a LIST ITEM (wrapping across lines is fine). Anything in the
   `## Acceptance` section that is not a criterion belongs above the heading — the VERIFY task copies
   that section verbatim and grades every line of it. The bare ubiquitous form (`THE SYSTEM SHALL …`,
   no trigger) is **rejected**: #5836 is the reason — *"say WHEN to assert, too"* — a criterion with no
   trigger cannot say when it is measured, so two honest verifiers can disagree about the same true
   criterion. The behavior clause is where the LIVE ARTIFACT goes: a URL to curl, a command to run, a
   render to look at. **Name the POPULATION and at least one case where it must NOT hold** — *"the gate
   appears"* is not a criterion; *"WHEN a returning visitor who confirmed the previous version loads the
   page THE SYSTEM SHALL show the gate"* is.

   🔴 **THE GRAMMAR DOES NOT REPLACE THE FOUR RULES BELOW, AND THAT IS A MEASUREMENT, NOT A CAVEAT.**
   #7387 asked whether the four failures this section was written from become *unwritable* in EARS.
   They do not. **All four rewrite cleanly into the grammar and every one of them still parses** —
   asserted, so it cannot silently change, in `_infra/tests/file-issue-ears-grammar.sh` §4. What the
   grammar buys is narrower and still worth having: a criterion must now name WHEN it is measured and
   WHAT must then be true, so a bare aspiration and a closing protocol stop being writable at all.
   Everything the grammar cannot see is handled by ONE more blocking check (rule 2a — mechanical and
   exact), TWO advisories printed at filing time (2c, 2d — both need judgement a regex does not have),
   and prose (2b). Here is each failure, rewritten, with what actually catches it:

   | # | the real broken criterion | its EARS rewrite | grammar? | what catches it |
   |---|---|---|---|---|
   | **2a** | *"This issue is closed by the PR that records the answers"* (#4819) | `WHEN the PR that records the answers is merged THE SYSTEM SHALL close this issue.` | **parses** | **BLOCKING** — the SHALL clause names the issue itself |
   | **2b** | *"No genuine durable state record was deleted — show `git log --stat` for the removal commit"* (#5570) | `WHEN the removal commit is inspected THE SYSTEM SHALL show a git log --stat deletion line for no durable state record.` | **parses** | nothing mechanical — prose, below |
   | **2c** | *"`/view/full` still returns 45"* (#5810) | `WHEN /view/full is fetched THE SYSTEM SHALL return 45 rows.` | **parses** | **ADVISORY** at filing time |
   | **2d** | *"journalctl shows ≥24h of entries"* (#5598) | `WHEN journalctl is queried THE SYSTEM SHALL show at least 24h of entries.` | **parses** | **ADVISORY** at filing time |

   **2a — a criterion grades the ARTIFACT, never the issue's own state. `file-issue.sh` REFUSES this
   one.** *"This issue is closed by the PR that records the answers"* (#4819) is false at every moment
   a verifier can measure it — a VERIFY task is a sub-issue of the Feature, so the Feature is open while
   it runs — and under #4800 the blocker filed for it is itself what holds the Feature open, so the
   criterion forbids its own satisfaction (#4827). Closing protocol goes in the body; grade only what
   can be true *before* the issue closes.
   **The children-closure variant is the same defect and reads as a real criterion** — *"the board shows
   this Feature's children closed, and a VERIFY task recorded a JSON verdict"* (#5963, adjudicated
   2026-08-16, the 6140 criterion-6 adjudication record, since deleted with its portfolio; git history holds it). Its first clause is the
   n/n arithmetic `stuck-pr-sweep.yml` already performs, restated as something to measure. Its second
   clause *is* gradeable — but `~` resolves on the box the VERIFY ran on, so grade it there
   (`sudo -n -u <master>`), never on the adjudicator's own box where absence and non-recording look
   identical. Write the artifact clause alone and let the board do its own arithmetic. Both shapes are
   refused at filing; the refusal names the case.

   **2b — never name an evidence artifact that exists on only ONE branch of the outcome. Nothing
   mechanical catches this one; it is on you.** *"No genuine durable state record was deleted — show
   `git log --stat` for the removal commit"* (#5570) welds a safety property to a recipe that only the
   WRONG fix produces: the paths it targeted were staged and never committed, so `git rm --cached`
   unstages them and writes no `--stat` deletion line anywhere. The property was true and unprovable at
   once, and the blocker filed for it held the Feature open on a signal nothing could clear (#5601).
   **EARS helps here and does not close it** — the trigger clause is exactly where the conditional
   belongs (`WHEN any tracked file was removed THE SYSTEM SHALL …`), but nothing stops you writing a
   trigger that never fires. Grade a must-NOT by **measuring the population it forbids** (here: every
   path deleted on any ref since filing = 0, against 216 found by the same command over full history,
   so the detector is provably not blind).

   **2c — on a surface that renders data a human curates, grade the INVARIANT, never a count of the
   data. `file-issue.sh` WARNS.** #5810 asked for *"`/view/full` still returns **45**"*. With zero
   commits landing underneath it, that command returned 45, 39, 40, 39, 49, 39 in ninety minutes — Tyler
   was editing the store through the very admin page the Feature shipped (#5831). Criterion 1's literal
   (`4`) drifted to `3` in the same window, *after* the verifier had graded it PASS, so the Feature was
   un-completable by construction and blocker #5836 held it open on a signal nothing could clear. Write
   the relation instead — *"WHEN `/view/full` is fetched THE SYSTEM SHALL serve exactly the set of ids in
   `showcase/rows/`, each project forming one contiguous run"* — which is true at 39, at 49 and at 45,
   is strictly stronger than `wc -l` (it catches a dropped row masked by an added one), and fails only
   for the reason anyone cares about. The trigger clause is where **when** to assert goes, too: read the
   store on both sides of the page fetch and grade only a stable window — page-then-store reported a
   false defect, and a freshly-published row sat unrendered for ~60 s behind `revalidate = 300` before
   converging. A literal count is safe only where the population is fixed by the code; if a human can
   change it between filing and verification, it is a measurement of the moment, not a criterion
   (#5836, adjudicated 2026-08-15). The warning is advisory **because that distinction is not
   mechanical** — a count over a code-fixed population is a correct criterion.

   **2d — a criterion whose only satisfier is ELAPSED TIME is un-satisfiable by any work, and
   dispatches masters at work that does not exist. `file-issue.sh` WARNS.** #5598 asked for
   *"journalctl shows ≥24h of entries"*; the retention config it measured went live at 17:52Z and the
   criterion was graded at **18:16Z — twenty-four MINUTES later**. The config was live and correct;
   nothing anyone could change to the artifact could make the criterion true, only waiting could.
   **Six master runs were dispatched to retry the impossible** (measured 2026-08-22, #6587), and because a
   BLOCKER whose parent VERIFY is CLOSED has nothing pointing back at it, the false grade sat on the
   board for eight days. Grade the artifact that exists now — *"WHEN journald is queried on novaserver
   THE SYSTEM SHALL report `Storage=persistent` with `MaxRetentionSec` ≥ 24h, active"* — which is true
   the moment the work lands and stays true. `verify-verdict.sh` flags this shape on the blocker it
   files and tells the master to **fix the criterion, not the artifact**; that is a backstop, not a
   licence to write one. The warning is advisory **because a duration that is a config VALUE is
   correct** — only an accumulated observation is not.

   **What the VERIFY task does with all this.** It no longer grades the prose. `file-issue.sh` parses the
   Acceptance section and the auto-filed VERIFY carries a table with one row per criterion, the trigger
   in its own column (*when to measure*) beside the SHALL clause (*what must be true*), and its
   verification table pre-filled from the same parse. The verbatim block stays above it, because
   `verify-verdict.sh` quotes the criterion VERBATIM into any blocker it files and a paraphrase there is
   what makes a blocker unreproducible. A Feature filed before #7387 — or with
   `--allow-non-ears-acceptance` — parses to nothing, and its VERIFY **says so out loud** rather than
   shipping an empty table.

3. **Grounding enumerated** — which CLAUDE.md, which registry file, which prior spec.
4. **Scope fence** — what NOT to touch.
5. **Phases sized to ~200 turns** — the real `--max-turns` default, read from
   `_infra/scripts/task-runner.sh:105` (`MAXT="${TASK_MAX_TURNS:-200}"`), grounding reads included.
   Bigger = split it. 🔴 **This said ~80 until 2026-08-31**, which was the default at some earlier
   point and outlived it — a doc stating a value is making a claim about code, and this one was wrong
   by 2.5x. Found by PLAN-255's verification pass, not by anything that checks.
6. **Target repo named** when it isn't `knowledge`, so pre-flight syncs it.
7. **Irreversible work flagged** (payment methods the fleet does not hold · prod migrations · security) → DRAFT PR and stop.
8. **Ground every reference THIS session.** A spec can cite dead machinery in good faith — several live docs do.

Decision records: `the-loop.md` § Specs is the ONE copy of that rule — when to write one, where it
goes, and the same-commit `Superseded-by` edit. Do not restate it here.

