---
title: "Step 4 — DISPATCHED"
description: "Mirrored from the fleet knowledge base: _process/steps/4-dispatch.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_process/steps/4-dispatch.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
audience: [architect]
step: 4
load: on-demand
reader: the /execution-start, /execution-continue and /execution-status skills
```

# Step 4 — DISPATCHED

**A master is executing.** Derived from ≥1 referenced issue being OPEN — never reported.

**Step 4 is called DISPATCHED because dispatch is the THESIS, not a label.** Filing a chain hands work to four boxes
already paid for, running in parallel, with no Architect in the loop. That is why filing the whole chain matters and
filing only the head does not.

## The step-4 MODE — two values, and neither is "blocked"

| step-4 MODE | what it means |
|---|---|
| **DISPATCHED** | a master runs it, unattended |
| **EXECUTING (interactive)** | Tyler and the Architect are working it together, in the session |

🔴 **Never "blocked", never "held"** (#4941). Tyler, 2026-08-11: *"this 'blocked' can NEVER be the case, you should
never be blocked and still be autonomous, the difference is that I am still in the loop."* Work that needs Tyler's
hand is **EXECUTING (interactive)** — running, with him in it — not stopped waiting on him. **The mode never renames
the step:** the phase word is the POSITION, the group header says who runs it
(`packages/occ-ui/src/PlanningExecutionSection.tsx`).

**This is not the same word as the PLANNING mode a session records** (`dispatch` · `interactive`, ADR-7781 — Q1 of
step zero). The standing order is chosen by the mode AND, on `dispatch`, by the bound subprocess's `monitor:` field
— **read from its frontmatter, never asked**:

| planning mode (Q1) | subprocess `monitor:` | step-4 MODE it produces | the standing order |
|---|---|---|---|
| `dispatch` | `no` · or `general` / `none` | **DISPATCHED** | the normal case — involvement ends at dispatch, the sweeper carries the tail, start the next plan (**Branch A**) |
| `dispatch` | `yes` | **DISPATCHED** | stay on the chain until it completes (**Branch B**) |
| `interactive` | — | **EXECUTING (interactive)** | Tyler in the loop, never "blocked" (**Branch C**) |

🔴 **The two dispatch branches SURVIVE the mode collapse** — they are different acts, not different labels. What
retired is where the choice is recorded: it was half of the mode literal, and it is now one field on the one file
that already fixed it. Read it: `sed -n '/^---$/,/^---$/p' <portfolio>/subprocesses/dispatch/<id>.md | grep '^monitor:'`.

**The doors** (2026-08-28, PLAN-248). A door resolves which thing you mean and hands off; the process lives in the
step files, never in the door.

| you want to | type |
|---|---|
| start a filed plan, either mode | `/execution-start` |
| pick interactive work back up | `/execution-continue` |
| ask where named work stands | `/execution-status` |
| record a VERIFY verdict as JSON | `_infra/scripts/verify-verdict.sh` |

🔴 **`/execution-start` is NOT the re-entry door.** Until PLAN-248 it was: both doors routed a continuation back into
it, so picking work back up meant re-reading a one-time filing step that had already run. **Both doors are on the
Architect's box; a master never types either.**

## 🔴 One account, four boxes — do not plan around per-master quota headroom

The claim *"each master runs on its own Claude subscription, so work runs in parallel across separate quotas"* was
**measured false** on 2026-08-27. The login is DERIVED, never declared:

```
for f in _infra/occ-feeds/usage/*.json; do jq -r '.account' $f; done
```

returns the same account for win, nova, cloud AND dust. **One account, four boxes.** The parallelism is real for
wall-clock and worktrees; **the quota isolation is not.** A hard session limit **darkens every master at once** — P7
of #6923 failed `exit=1` with *"You've hit your session limit · resets 12am (UTC)"*, and a close-out reading *"the
master is dark"* undersells it by a factor of four. 🔴 **Do not re-dispatch on a quota failure, and do not re-dispatch
into a `🪫 quota-exhausted` capture expecting a sibling to have its own budget** — the sweeper re-releases the issue
after the reset.

## What `--dispatch` does, and what the run does on its own

`--dispatch` starts the head issue **the moment the chain is filed** instead of leaving it for the sweeper's next
five-minute cycle, so filing and dispatch happen in the same turn (#4378). **If the dispatch call fails, the issues
are still filed and the sweeper retries** — the failure costs you five minutes, not the plan. The only reason to omit
it is a fixture that tests filing alone.

**The sweeper already watches the chain.** It runs every 5 minutes, walks the dependency graph, and releases each
phase within five minutes of its blocker closing. **Do not rebuild that, do not supervise it, and do not re-dispatch a
phase whose blocker is still open — you will collide with it.**

---

# Branch A — `dispatch`, subprocess `monitor: no` (or `general` / `none`): AFTER DISPATCH, STOP

> *"I want to go back to planning right after dispatching, because I want you to be able to trust master
> agents."* — Tyler, 2026-08-01

**Say what was filed in one line and stop.** Do not set a wake-up loop, do not poll, do not hunt for something to
watch. On 2026-08-05 the Architect filed a chain and immediately scheduled a 20-minute "monitor to completion" wake-up
— the waiting room rebuilt out of a different tool, one message after Tyler asked for the opposite. 🔴 **A scheduled
wake-up loop is polling wearing a hat** — monitor only when Tyler asks for it by name, or when the bound subprocess
says `monitor: yes`.

**Watching a master is indistinguishable from not trusting it, and it is self-reinforcing:** while the Architect
supervises, nothing is planned. **Steps 1-2 of the next plan run CONCURRENTLY with the execution of the last.**

**Nothing is lost by not watching.** The **reaper** resets `Doing→Todo` when a ▶ has no live unit; the **announcer**
files `STALLED #N` issues onto the board where Tyler already looks; and **✔ is not a self-report** —
`task-runner.sh:246`, *"a run earns ✔ ONLY with a REAL artifact; rc=0 is NOT sufficient"* — it is derived from
GitHub's record of the PR that closes the issue, so a run that ships nothing gets `⚠ no-op`. **Verify that these three
still hold rather than trusting this paragraph; if one has rotted, that is the finding.**

**This is not "stop verifying."** Verification moves to the master's own acceptance criteria and the auto-filed VERIFY
issue; it is pull-based, read on demand from the board, never polled. When Tyler asks "is it done," **answer from the
ISSUES.**

**Do not open the editor to fix a wrong result.** A wrong result is **dispatched forward, never hand-fixed** — file
the defect with evidence and dispatch it. Hand-fixing is slower on any single fix and is the only path where masters
never improve.

**Do not gate the merge.** Nothing on this plan tier can require a check — branch protection and rulesets both 403 in
every repo — so a red or missing check is **information, never a stop.** The masters self-merge to MERGED.

🔴 **This branch stands NO ORDER over the run** (#6933). The injector emits no standing frame for an unmonitored
dispatch plan: an order to stop attending this plan, re-issued every turn of attending it, **is the one instruction
that cannot coherently be a standing order.** The fact survives; the order does not — at `FILED` the `[plan]` line carries `·
filed — the sweeper carries the tail; this mode stands no order over the run`. **Quiet, not absent**: a hook that
stopped emitting for one mode looks identical to correct silence.

---

# Branch B — `dispatch`, subprocess `monitor: yes`: hold the chain to completion

**MISSION:** get one plan from a finished document to a **verified live artifact without Tyler in the loop**, and turn
every place the system could not carry it there into a **filed, dispatched fix.**

## This is NOT the polling doctrine bans

Doctrine's *"Never poll a running dispatch"* and *"A scheduled wake-up loop is polling wearing a hat"* are right —
they describe an Architect who filed a chain then sat watching a healthy run instead of planning the next thing.
**That is banned and stays banned.**

**This session is a different act, and the difference is what you DO with what you see.** Watching produces a progress
report. This produces **filed issues**. 🔴 **If you finish a monitoring pass having written nothing to the board and
having verified nothing live, you were polling, and you should have stopped at filing.** **A healthy chain costs you
nothing:** you do not narrate it, do not report each transition, do not refresh to watch a ▶ become a ✔.

**And the watching is not yours to do by hand.** Claude Code ships a `Monitor` tool: you hand it a script, every line
it writes to stdout arrives in this session as a notification, and you go do other work until one does. **That is the
inverse of polling** — the events come to you. **Re-checking on a cadence you remember to keep IS the idle defect.**
Tyler, 2026-08-22, on a monitored dispatch plan: *"we did a Dispatch * Monitor plan, and you just sat here doing absolutely nothing. Claude Code has
a default monitor tool to use."*

**The doctrine line that looks like it forbids a monitor** is `_process/the-loop.md`'s *"A resident process is
forbidden for anything the board, a dispatch run, or a git event already announces"* (#3562). It does not reach this:
🔴 **A MONITOR WITH A RELEASE CONDITION TERMINATES; A HEALTH CHECK RUNS FOREVER.** The loop below exits the moment the
Feature is n/n and nothing survives the session. **If you catch yourself arming a monitor with no condition that ends
it, you have written the forbidden thing — stop and give it an exit.**

**Measured 2026-08-09 across issues #3440–#4738:** 43 of 53 chains completed (81%); of the 20 open phases in the 10
that did not, **16 were working as designed** (`[INTERACTIVE — Tyler] [DO NOT DISPATCH]` phases, their VERIFY
children, sweeper fixtures) and four were genuinely stuck — **adjusted, ~92%. Do not open this session expecting a
fire.**

## SETTLED — do not reopen these

- **✔ is not a self-report** (`task-runner.sh:246`) — derived from GitHub's record of the merged PR. A ✔ is evidence
  and you may trust it; **what you may not trust is that the merged code does what the plan wanted.** Do not build a
  second verifier for this.
- **The board is the sink for a system defect. Not `_rules/`.** That corpus is for corrections to how YOU behave — its
  `cases/` are never loaded and its rules saturate at ~40 entries about conduct. **A selector gap in a shell script is
  not a behavior anyone can be corrected out of; it is a code change, and a code change needs an issue.** Tyler chose
  the board explicitly, 2026-08-09.
- **A defect you find is dispatched forward, never hand-fixed. Nothing gates main.**
- **The runner is not a closer**, and the rollup refuses to author its own evidence (step 5). **Do not weaken this to
  make a Feature close faster.**
- **A grouper with open children is never hand-dispatched.** On 2026-08-03 Feature #4034 and its own sub-issue
  #4036 went to nova twelve seconds apart, both ran the same work, and the loser's board actions **REOPENED
two Features** seconds after the winner closed them. Predicate 11 exists for this.
- **Never post a ✘ on a rollup-attested Feature.** That is the tombstone remedy applied to verified work, and it
  writes a false failure onto something that succeeded.

## TRAPS

**The zombie.** An issue can sit at board `Status=Done` while GitHub still reports it **OPEN**. Nothing in the fleet
HEALS that state: the sweeper selects `Status=="Todo"` (`sweep-dispatch.sh:869`), the reaper selects `Status=="Doing"`
(`:1273`), and the board reconciler refuses it deliberately — `~/.claude/ops/reconcile-board-status.sh:179-186` on
novaserver skips `Done|Review|Blocked` as "deliberate terminal states" (`:185`). **That assumption is the bug.**
Measured 2026-08-09: **12 such issues, including a P0 and a P1 sitting six to seven days.** It IS reported — the
announcer carries **seven** classes (`sweep-dispatch.sh:1574` `:1578` `:1593` `:1602` `:1606` `:1673` `:1682`), and
the last two, `board-terminal-but-reopened` and `board-terminal-but-open`, gate on `($st == "Done" or $st ==
"Review")` and say so at `:1685`. **Read it as a stall you will hear about and must act on, never as a state nobody
can see.**

🔴 **Some things are stuck ON PURPOSE and must NOT be "fixed":** #4241 STALL BUCKET and #4247 `[DO NOT CLOSE] AUTO-FILE
BUCKET` are permanent collectors supposed to stay open at a terminal status (closing
#4241 silences the announcer, which then reports nothing and looks healthy); #3791, #3794 and #3695 are SWEEPER
TEST fixtures (#3794 the ⛔ control, #3791 the attempt-cap fixture); and anything labelled `test-fixture`, `keep-open`,
or titled `[DO NOT DISPATCH]` / `[INTERACTIVE — Tyler`. **Read the title, and check labels before acting, always:**

```
gh issue view <N> --repo utopia-models/knowledge --json labels --jq '[.labels[].name]'
```

**Doctrine overstates its own safety net.** Measured 2026-08-09: the reaper had never fired once in 1,141 logged
cycles, the announcer had been silent for four days while zombies accumulated, and none of the three mechanisms had a
selector matching the state most real stalls are in. **Trust the mechanisms for what they cover; do not treat their
existence as coverage of the case in front of you.**

**`⏸` and `⛔` are BOTH releasable latches**, each with exactly one documented token. `⏸` is released by the literal
`UNPARK` written after the last pause (`sweep-dispatch.sh:913-916`); `⛔` by the literal `UNBLOCK` written after the
last `⛔` (`:921-925`). **Both compare POSITIONS, not existence**, so a release written after the blocker clears always
works; both are mirrored at three sites that move together (predicate 5, the `--explain` mirror, and the announcer's
`is_parked` at `:906`). **An issue whose last marker is ⛔ with no `UNBLOCK` after it is genuinely stuck** (`:926-930`)
and stays undispatchable — treat THAT as a stall requiring a decision, not as something waiting.

**The marker that lies about being terminal.** Predicate 6 matches the **leading glyph**, so a comment beginning `⛔→✅
... is merged` — text announcing the blocker is CLEARED — **parks the issue permanently.** Live on #4493, holding
#4494 and VERIFY #4490; cleared by posting a non-terminal marker. **When an issue looks parked, read the comment's
TEXT, not its first character.**

**A ✔ on an open issue is usually already released.** A REOPEN posted after a ✔ overrules it (#4392). **Compute
against the last `REOPENED_EVENT`** or you will report phantom tombstones.

**`has-open-deps` is a permanent park wearing a queue's clothes.** It reads like "waiting its turn." **Recurse to the
blocker and ask whether the BLOCKER is dispatchable:** one on a dead lane, or one whose board Status is `Done` while
the issue is still OPEN, will never close. Predicate 4 reads GitHub state, not the board field.

**`⚠` is not terminal**, so a ⚠ issue is counting down, not parked — predicate 6 rejects only `▶ ✔ ⛔`. A `⚠ no
artifact` issue keeps being re-dispatched until **three ▶ attempts** park it. **Count the ▶ markers before calling it
stuck.**

**A `[DO NOT DISPATCH]` phase inside a chain holds its entire tail forever**, and so does any lane outside `win nova
cloud dust`. `file-issue.sh:1153-1162` hard-errors on a dead lane in the `--chain` pre-flight, and `:1876-1884`
rejects it on a single issue carrying `--blocked-by` — **but an existing chain filed before that guard can still be
holding a tail behind an interactive phase. That is a stall you file AROUND, not a bug to fix.**

**`--explain` is a snapshot from BEFORE the current tick, and hand-dispatching off it collides with the sweeper.**
Measured 2026-08-28 on #7124 and #7125: the sweeper took both on its 13:34Z tick (`dispatched=2`), `--explain` still
listed both as dispatchable, and a hand-dispatch started a SECOND master on each — 11 and 12 seconds apart. **Before
hand-dispatching anything `--explain` lists, read what the sweeper just took:**

```
ssh -n nova@100.71.25.43 'sudo -n cat /home/svc-ops/.claude/state/sweep-dispatch.last'
```

A non-zero `dispatched=` on the last tick means candidates were consumed and `--explain`'s list is already stale.
**The remedy if you collide anyway:** stop the LATER unit (`systemctl --user stop task-<n>.service` as that master)
and leave the first.

🔴 **STOPPING THE DUPLICATE POSTS A FALSE ✘, AND YOU MUST CLEAR IT IN THE SAME BREATH.** The runner's EXIT trap fires
on SIGTERM and writes `✘ failed (exit=143) — and produced no artifact` against the ISSUE, because a marker identifies
the issue, never which of two concurrent runs it describes. Measured 2026-08-28: the ✘ for the killed nova run on
#7124 landed at 13:44:26 and the cloud run was still active minutes later. Predicate 6 reads the LAST marker, so
**post a non-terminal `⚠` after the ✘** saying which run died and that the original is live — otherwise the next
reader, the announcer, or an attempt count charges this issue a failure it did not have. **Verify the survivor is
actually alive with the live-unit probe before you write that it is.**

**`--explain` only sees `Status=Todo`.** A `Doing` issue whose run vanished, and every `Blocked` issue, print NOTHING.
**Absence from `--explain` reads as "fine" and often means the worse thing.** It also never shows predicate 10
(capacity) — an issue can be `✓ DISPATCHABLE` and still never launch because every master is at cap or quota-dark;
that is only in the `sweep:` summary line.

**An n/n open Feature is usually just waiting** — the auto-closer's median gap is 104 minutes against a declared
30-minute cron (step 5). **Board `Status=Doing` is a claim; a live systemd unit is the fact.** They disagree when a
run is killed and the EXIT trap never fires.

## VERIFICATION — the reads

🔴 **The naive board read LIES about zombies, silently and confidently.** `gh project item-list` does not expose issue
state at all — its `content` object carries only body, number, repository, title, type and url. A filter comparing
`content.state` to OPEN matches nothing and returns a clean zero. **Measured 2026-08-09: item-list reported 0 zombies
where GraphQL found 12.**

Chain state — a Feature's sub-issue completion and children in one GraphQL call, the fastest honest picture (one call
per Feature):

```
gh api graphql -F n=<feature#> -f query='query($n:Int!){repository(owner:"utopia-models",name:"knowledge"){issue(number:$n){number title state subIssuesSummary{completed total} subIssues(first:50){nodes{number state title}}}}}' \
  --jq '.data.repository.issue | "#\(.number) \(.state) \(.subIssuesSummary.completed)/\(.subIssuesSummary.total) \(.title)", (.subIssues.nodes[] | "  #\(.number) \(.state) \(.title)")'
```

Zombies — the state nothing else catches (**page one only, 100 items; page it if the board has grown**):

```
cd ~/dev/utopia-models/knowledge && gh api graphql -f query='query($org:String!){ organization(login:$org){ projectV2(number:1){ items(first:100){ nodes{ fieldValues(first:20){ nodes{ ... on ProjectV2ItemFieldSingleSelectValue { name field{ ... on ProjectV2SingleSelectField { name } } } } } content{ ... on Issue { number title state } } } } } } }' -F org=utopia-models | python3 -c "
import sys,json
nodes=json.load(sys.stdin)['data']['organization']['projectV2']['items']['nodes']
for n in nodes:
    c=n.get('content') or {}
    if not c.get('number'): continue
    st=None
    for fv in n['fieldValues']['nodes']:
        if fv and fv.get('field',{}).get('name')=='Status': st=fv.get('name')
    if c.get('state')=='OPEN' and st in ('Done','Review','Blocked'):
        print('#%-6s %-8s %s'%(c['number'],st,c['title'][:60]))"
```

The run markers on any phase you suspect — **the last marker is the state:**

```
gh issue view <n> -R utopia-models/knowledge --json comments --jq '[.comments[].body] | map(select(test("^#{0,4} *[▶✔✘⚠⛔⏸🪫]"))) | .[-1]'
```

**▶** with no terminal marker and a live unit means it is running — leave it. **✘** is a real failure. **⚠** is a
no-op: the run exited without shipping an artifact. **⛔** is a park.

A Feature's REAL state — children, board fields, markers, blockers and PRs together. 🔴 **The chain-state read above is NOT
sufficient for this: it gives completion counts and no Status, Lane, marker, PR or blocker, which is where the
stuckness lives.**

```
gh api graphql -f query='query($n:Int!){repository(owner:"utopia-models",name:"knowledge"){issue(number:$n){number title state subIssuesSummary{total completed} subIssues(first:50){nodes{number state title blockedBy(first:10){nodes{number state}} projectItems(first:2){nodes{fieldValues(first:20){nodes{... on ProjectV2ItemFieldSingleSelectValue{name field{... on ProjectV2FieldCommon{name}}}}}}} comments(last:5){nodes{body createdAt}} timelineItems(last:5,itemTypes:[CROSS_REFERENCED_EVENT]){nodes{... on CrossReferencedEvent{source{... on PullRequest{number state isDraft}}}}}}}}}}' -F n=<FEATURE> --jq '.data.repository.issue as $f | "FEATURE #\($f.number) \($f.state) \($f.subIssuesSummary.completed)/\($f.subIssuesSummary.total) — \($f.title)", ($f.subIssues.nodes[] | ([.projectItems.nodes[]?.fieldValues.nodes[]?|select(.field.name=="Status")|.name]|first) as $st | ([.projectItems.nodes[]?.fieldValues.nodes[]?|select(.field.name=="Lane")|.name]|first) as $ln | ([.comments.nodes[]|select(.body|test("^\\s*(▶|✔|✘|⚠|⛔|🪫|⏸)"))]|last) as $m | ([.timelineItems.nodes[]?.source|select(.number!=null)]|last) as $pr | "  #\(.number) \(.state) [\($st // "-")/\($ln // "-")] mark=\(if $m==null then "none" else $m.body[0:2] end) blockedBy=\([.blockedBy.nodes[]?|select(.state=="OPEN")|"#\(.number)"]|join(",")) pr=\(if $pr==null then "-" else "#\($pr.number) \($pr.state)" end) — \(.title[0:52])")'
```

Is a run actually live — **the fact the board cannot give you:**

```
ssh -n -o BatchMode=yes -o ConnectTimeout=10 nova@100.71.25.43 'for M in win nova cloud dust; do sudo -n -u $M XDG_RUNTIME_DIR=/run/user/$(id -u $M) systemctl --user list-units --state=active --no-legend --plain "task-*" 2>/dev/null | while read -r U _; do echo "$M $U"; done; done'
```

The sweeper's own reasoning, before theorising about why something has not started — **it prints the cause every
cycle** (~40-70s, and it only covers `Todo`):

```
ssh nova@100.71.25.43 'cd ~/dev/utopia-models/knowledge && bash _infra/scripts/sweep-dispatch.sh --explain' 2>&1 | tail -30
cd ~/dev/utopia-models/knowledge && bash _infra/scripts/sweep-dispatch.sh --explain --no-announce 2>&1 | grep -E '"(<N1>|<N2>):'
```

**If it says `0 dispatchable` with legitimate rejections, the queue is drained, not stalled.** Four separate
investigations once looked for a broken mechanism while this command was printing the answer every five minutes. 🔴
**THE METHOD THAT LIES:** `--status` run as `architect` reads your OWN local dry-run state file, not the fleet's. The
authoritative heartbeat is svc-ops' (nova's copy has not moved since 2026-10-29T08:20Z), and the absence of `DRY-RUN`
is how you know it is the real timer: `ssh -n nova@100.71.25.43 'sudo -n cat /home/svc-ops/.claude/state/sweep-dispatch.last'`.

**A green build is not a working artifact, and a merged PR is not a verified outcome.** The DMV catalog chain
(#4734–#4737) closed with four ✔ and four merged PRs, and *"it shipped"* only became true after reading the live table
and confirming the column was gone. **For a live web surface a real browser beats curl:** curl returned a healthy 200
with correct HTML while every browser showed a 500 boundary on the OCC, 2026-08-03. The grading itself is step 5.

## ARM `Monitor` ONCE, IMMEDIATELY AFTER THE CHAIN IS FILED — then go do other work

```
Monitor({persistent: true, description: "Feature #<F> — phase state, retries and close-out markers", command: <the script below, with F set>})
```

`persistent: true` because a chain outlives the default 5-minute timeout; **the release condition is the exit, never a
timeout.** 🔴 **Do not arm a second monitor on the same Feature** — two monitors double the event rate against an
undocumented auto-stop threshold, for no extra information.

**This section is the whole instruction:** *arm · re-derive on each event · fix forward · exit at n/n REPORTING the
verdict state · one summary.* The per-turn mode injector that used to repeat it in one line
(`userpromptsubmit-mode-inject.sh` `mode_frame()`) was retired with the plan registry and `~/.claude/state/mode`
(fleet-doctrine 0.100.0, ADR-10109); nothing re-injects it, so read it here.

🔴 **The grading standard arrives WITH the arm, and the first line of the script is not part of the loop.** Every issue
a `--subprocess` chain files carries the line **Governed by the `<id>` subprocess** in its body.
`subprocess-acceptance.sh` reads that off the board in one call, resolves the definition in the knowledge clone and
prints its `## Acceptance` section **VERBATIM**, so the criteria you are supposed to re-run before you release arrive
as the monitor's **first event** instead of sitting in a file nobody opened. The monitored dispatch definitions have
always said their acceptance is *"graded by the Architect re-running the named check"* and until #6929 nothing
delivered them. 🔴 **It reads the file ONCE, at arm. DO NOT MOVE IT INSIDE THE `while`** — re-reading a static file on
every board event is the polling shape doctrine bans, one layer down. It prints one `§` block and **exits 0 on every
path including failure**, so it can never take the watch down with it; a Feature with no governing subprocess gets one
line saying so, and a name resolving to zero or several definitions **surfaces NOTHING and says so, because a wrong
grading standard is worse than none** (#6338). 🔴 **It prints, it never copies** — no criterion is restated anywhere,
so a new `monitor: yes` subprocess in any portfolio is covered the day it lands.

**`TICK=120` is a MEASUREMENT, not a caution.** Measured 2026-08-23 over the 29 most recently closed issues carrying a
▶: **median ▶-to-closed is 8 minutes, min 0**, so a two-minute tick samples a typical run about four times and cannot
miss a phase. It costs 30 GraphQL calls an hour and — measured 2026-08-28 (knowledge#7195) by adding `rateLimit { cost
}` to this exact query — **1 POINT PER CALL**, against a limit of **5,000 POINTS per hour**. Two features per tick at
120s is 60 points/hour, **1.2%**. 🔴 **Do NOT slow this tick to save budget**; that guess was made on 2026-08-28, the
monitors were stopped for it, and it was **wrong by ~80×**. 🔴 **The real pressure is CONCURRENT SESSIONS sharing one
identity** — seven Claude sessions on one box measured ~4,100 points/hour with every monitor stopped. 🔴 **And when the
budget does run out, `gh api rate_limit` reads healthy** — it reports the REST core pool, which sat at `5000/5000`
while GraphQL was at `0/5000`. The only honest probe is `gh api graphql -f query='{ rateLimit { remaining resetAt }
}'`. **Ticking faster teaches you nothing the board did not already have** — the sweeper that releases each phase only
runs every five minutes.

```bash
F=<feature#>; R=utopia-models/knowledge; TICK=${TICK:-120}; HB_EVERY=${HB_EVERY:-15}
O=${R%%/*}; N=${R##*/}
bash ~/dev/utopia-models/knowledge/_infra/scripts/subprocess-acceptance.sh "$F" "$R" || true
snap() {
  gh api graphql -f query='
   query($o:String!,$n:String!,$i:Int!){repository(owner:$o,name:$n){issue(number:$i){
     comments(last:100){nodes{body}}
     subIssues(first:50){nodes{number state title comments(last:100){nodes{body author{login}}}}}}}}' \
   -F o="$O" -F n="$N" -F i="$F" --jq '
     .data.repository.issue as $p
     | "PARENT verdicts=\([$p.comments.nodes[].body|select(test("<!-- verify-verdict:"))]|length) verifiers=\([$p.subIssues.nodes[]|select(.title|test("^VERIFY"))]|length)",
       ($p.subIssues.nodes[]
        | [.comments.nodes[].body|select(test("^#{0,4} *[▶✔✘⚠⛔⏸🪫]"))] as $m
        | [$m[]|capture("^#{0,4} *(?<g>[▶✔✘⚠⛔⏸🪫])").g] as $g
        | "\(.number) \(.state) starts=\([$g[]|select(.=="▶")]|length) last=\(($g|last)//"-") \(.title[0:52])")' 2>&1
}
prev=""; t=0; blind=0
while :; do
  t=$((t+1)); cur=$(snap)
  if [ -z "$cur" ] || ! grep -q '^PARENT verdicts=' <<<"$cur"; then
    blind=$((blind+1))
    { [ "$blind" -eq 1 ] || [ $((blind % HB_EVERY)) -eq 0 ]; } &&
      echo "⚑ board unreadable, tick $t (x$blind) — monitor ALIVE, data missing: $(head -1 <<<"$cur")"
    sleep "$TICK"; continue
  fi
  [ "$blind" -gt 0 ] && echo "⚑ board readable again after $blind blind ticks"; blind=0
  if [ -z "$prev" ]; then
    echo "▷ armed on Feature #$F — $(grep -c ' CLOSED ' <<<"$cur")/$(($(wc -l <<<"$cur")-1)) closed"
    sed 's/^/  /' <<<"$cur"
    # 🔴 SAY AT ARM WHETHER A VERDICT IS EVEN POSSIBLE (#7126). The loop can compute this on tick 1
    # and, until this line, threw it away — which is the whole diagnosis PLAN-238 is an instance of.
    # A Feature with no `^VERIFY` child will never carry a verdict marker no matter how long you wait,
    # so the Architect needs to know NOW, while the chain is still open and a verifier can still be filed.
    [ "$(sed -n '1s/.*verifiers=\([0-9]*\).*/\1/p' <<<"$cur")" = 0 ] &&
      echo "⚠ NO VERIFY SUB-ISSUE on #$F — nothing will ever write a verdict marker here. This chain closes UNVERIFIED unless you file a verifier. File it now, or plan to grade the artifact by hand at release."
  else
    pclosed=$(grep -c ' CLOSED ' <<<"$prev"); cclosed=$(grep -c ' CLOSED ' <<<"$cur")
    # 🔴 COMPARE THE WHOLE RAW LINE. Splitting into fields and rebuilding the string drops the
    # trailing space a 52-char title truncation leaves behind, so every unchanged phase reads as
    # changed and emits every tick — which is the event flood that silently auto-stops the monitor.
    while IFS= read -r line; do
      k=${line%% *}; [ "$k" = PARENT ] && continue
      p=$(grep -m1 "^$k " <<<"$prev") || p=""
      [ "$line" = "$p" ] && continue
      ps=${p#*starts=}; ps=${ps%% *}; cs=${line#*starts=}; cs=${cs%% *}
      # 🔴 A RETRY needs the PREVIOUS snapshot to already carry a start. `cs != ps` also matches
      # 0→1, which is every phase's FIRST start — so the old form fired once per phase on a chain
      # that was working perfectly, and a retry line on every normal start trains you to ignore the
      # one that is real. Measured on #6925, 2026-08-27: one ▶, no prior run, flagged as a retry.
      if [ -n "$p" ] && [ "${ps:-0}" -ge 1 ] && [ "$cs" != "$ps" ] && [ "$cclosed" -eq "$pclosed" ]; then
        echo "🔁 RETRY WITHOUT PROGRESS #$k — start #$cs, nothing closed since the last one · $line"
      else
        # 🔴 SILENT ON THE HAPPY PATH (2026-08-28). This arm used to `echo "→ $line"` on EVERY state
        # change — a line per ▶ and a line per ✔, which is a notification per phase transition. That
        # is the running commentary the release-condition section already forbids, and it is exactly
        # what Tyler named as the thing to stop: the monitor exists to keep him OUT of the loop, so a
        # narrated healthy chain is the intervention wearing the costume of visibility. Emit only when
        # the new last marker is one that EARNS ACTION — ✘ failed, ⚠ shipped nothing, ⛔ parked, ⏸
        # held. A plain ▶ or ✔ changes the line and is deliberately not an event.
        lm=${line#*last=}; lm=${lm%% *}
        case "$lm" in
          ✘|⚠|⛔|⏸|🪫) echo "→ $line" ;;
        esac
      fi
    done <<<"$cur"
  fi
  prev="$cur"
  open=$(grep -c ' OPEN ' <<<"$cur")
  # Anchored captures, not `.*verdicts=` to end-of-line: the PARENT line now carries a second field.
  verd=$(sed -n '1s/.*verdicts=\([0-9]*\).*/\1/p' <<<"$cur")
  vfy=$(sed -n '1s/.*verifiers=\([0-9]*\).*/\1/p' <<<"$cur")
  if [ "$open" -eq 0 ]; then
    if [ "${verd:-0}" -gt 0 ]; then
      echo "✅ RELEASE — Feature #$F is n/n and $verd verdict marker(s) are recorded. Monitor exits."
    elif [ "${vfy:-0}" -eq 0 ]; then
      echo "✅ RELEASE — Feature #$F is n/n, and ⚠ NO VERDICT WAS EVER POSSIBLE: not one of its sub-issues has a title matching \`^VERIFY\`, so no run was ever going to write a \`<!-- verify-verdict: -->\` marker on it. The Feature is UNVERIFIED, not verified-and-quiet. Grade the live artifact yourself against the acceptance, and file the verifier as its own issue if the plan needed one. Monitor exits."
    else
      echo "✅ RELEASE — Feature #$F is n/n with $vfy VERIFY sub-issue(s), and ⚠ NO VERDICT IS RECORDED: a verifier closed without writing \`~/.claude/state/task-verify-<n>.json\`, and \`verify-verdict.sh\`'s UNRECORDED blocker (#6585) never landed either. The Feature is UNVERIFIED. Grade the artifact yourself, then \`bash _infra/scripts/verify-verdict.sh <the VERIFY issue#>\` so the board carries the fact. Monitor exits."
    fi
    exit 0
  fi
  [ $((t % HB_EVERY)) -eq 0 ] &&
    echo "· heartbeat t=$t $(date -u +%H:%MZ) — $open open, verdicts=$verd, verifiers=$vfy (monitor alive)"
  sleep "$TICK"
done
```

*Verified end to end 2026-08-23 against live Feature #6580: it armed and printed 0/8 closed with each phase's state,
start count and last marker; against fixtures it emitted the retry line, the release line and exited 0, and suppressed
an 8-tick blind-board run down to 3 lines. 🔴 Since 2026-08-28 an ordinary state change is **deliberately SILENT** —
the arm emits only when the new last marker is ✘ ⚠ ⛔ ⏸. Re-verified that day against the five fixture lines: `last=▶`
and `last=✔` emit nothing while `✘`, `⚠` and `⏸` each emit. The armed snapshot still prints every phase's state once,
so nothing is hidden.*

## What the filter must match — and why it is not the happy path

🔴 **The events reach ME, so that Tyler does not have to be reached at all.** Tyler, 2026-08-28: *"Monitor is meant to
keep me out of the loop... you will review and ensure that the plan drives to completion WITHOUT ME"* and *"I don't
even need you to tell me, be authoratative."* **Every line this loop emits is a line I ACT ON — never a line I
relay.** That is also the volume rule: an event on a phase that started or closed normally buys nothing and costs the
one thing that kills a monitor, **so the happy path is silent by construction.**

**Ask the tool's own question before you arm anything: if this chain crashed right now, would my filter emit a single
line?** A monitor that emits only on ✔ is silent through a crashloop, and **silence is indistinguishable from
still-running.** So the filter carries five things and four of them are failure:

1. **A state change on any sub-issue** — OPEN→CLOSED, or a new last marker. ✘ real failure · ⚠ shipped nothing · ⛔
   park · ⏸ releasable with `UNPARK`.
2. **A RETRY WITHOUT PROGRESS** — the same issue picking up another ▶ with nothing closed since the last one. 🔴 **This
   is the signal that matters most and no count-based check can see it.** Measured 2026-08-22 across the 8 stalest
   board items: every one was a VERIFY or a blocker from one, all had ZERO open blockers, and each carried between one
   and six ▶ markers — **#5598 had been started SIX times.** A monitor reading n/m would have called all eight "in
   progress"; one reading "has a ▶" would have called them "running". **Both would have been wrong for eight days.**
3. **The PARENT's verdict markers** — `<!-- verify-verdict:<n>:PASS|FAIL -->`, written by
   `_infra/scripts/verify-verdict.sh`. **n/n without one is unverified work counted as verified.**
4. **The board being unreadable** — a 403, a rate limit, a network drop. **That is a line, not a silent skip.**
5. **The release.**

**What the filter must NOT match: every tick.** Emitting per tick is how a monitor dies.

## What proves the monitor is still alive

**A monitor can die without telling you.** The tool's own documentation: *"Monitors that produce too many events are
automatically stopped"* — **the session is not notified, the monitor simply ceases, and the threshold is
undocumented.** That produces a session which believes it is watching and is not: the idle defect, wearing a tool.

**So the loop proves its own liveness two ways and you must not remove either.** It prints a heartbeat every
`HB_EVERY` ticks (thirty minutes at the defaults) carrying the open count and the verdict count, so **no events for
longer than that means the monitor is gone rather than the chain being quiet — and when you see that, re-arm it.** And
a blind board emits once on the way in and then only on the heartbeat interval, because **the flood is what triggers
the auto-stop in the first place.**

**This is not the "heartbeat poll" doctrine forbids.** That is a resident process outliving every session; this is one
line inside a loop that exits at its release condition, and it exists so that **silence can be read.**

## What you do on an event

**Re-derive from the board, never from the event text.** The event tells you where to look; `gh` tells you what is
true. **Then act** — the five states below are the whole list of what earns action. **There is no branch of this loop
that ends in asking Tyler, and there is no stop-list**; a phase that cannot run unattended was filed `interactive`,
which is a MODE, not a blocked state.

**Between events you do other work.** A monitoring session that sits still is the defect with extra steps.

### The five states that earn intervention

| state | remedy |
|---|---|
| **✘ — the run failed** | read the failure on the issue, then file a fix or re-dispatch that phase with what you learned. **Do not open the editor.** |
| **⚠ no-op — it ran and shipped nothing** | usually the brief was unbuildable as written: a spec path the issue never named, an acceptance criterion naming no artifact, or a phase already done. **Fix the brief and re-dispatch.** |
| **a zombie** — board terminal, GitHub OPEN, title does not say BUCKET or DO NOT CLOSE | either the work is genuinely finished and the issue needs closing, or the status was written prematurely and needs resetting to `Todo` so the sweeper can see it again. **Decide from the run markers and the merged PRs, not from the status field that is already lying.** |
| **an open PR whose body says `Closes #N`** | the phase is not done, whatever the board says. Read the real error, then `gh pr merge <n> --squash --admin`. **A merge is never a Tyler gate and is git-reversible; leaving a PR open is what costs.** Measured 2026-08-09: zero open PRs across knowledge, peptide-shop, utopia and peptide-shop-bridge, so **a new one is a real signal.** |
| **a chain whose tail is held behind an interactive or dead-lane phase** | the tail will never release. **File the remaining work as its own chain around the blocker** rather than waiting. |

🔴 **AND THE SIXTH STATE, WHICH IS AN EXIT AND NOT A FAILURE: the fix is bigger than the chain.** When a phase keeps
failing for a reason the plan did not anticipate — the premise is wrong, the fix needs research this chain has no room
for, the blast radius is larger than the Feature — **PARK THE PLAN**, naming the condition that would pick it back up.
Tyler, 2026-08-28: *"You can also park plans as well, if you feel like the fixes require deeper research and a much
larger scope."* **Parking is an authoritative decision the monitor is entitled to make; it is not an escalation and it
is not asking.** What it is NOT for: a phase that merely failed once (that is a re-dispatch), and a defect you can
name and file (that is a filing). **Park when you cannot say what the fix IS without a planning session of its own —
and say that in the park note, because that sentence is the whole reason the plan is parked.** Mechanics: step 5.

### When you find a system defect, file it while you are still here

**A defect in the planning and execution system is WORK, and work goes on the board with evidence, dispatched.** Not a
note, not a memory, not a feedback case. **File it the moment you find it — the evidence is in your context now and
will not be in the next session's.**

```
bash ~/dev/utopia-models/knowledge/_infra/scripts/file-issue.sh --title "<what is broken, stated as the defect>" --body-file /abs/body.md --lane <win|nova|cloud|dust> --priority <P0|P1|P2|P3> --portfolio wi --parent <feature#> --parallel
```

**The body names the real sink you read, the exact selector or line that is wrong, and what must be TRUE when it is
fixed.** Evidence means **the command you ran and its output**, not your inference from it. Lane is which box runs it,
never the subject matter.

**If the defect is large enough to need phases, it is its own plan** — say so in one line and file it as a chain,
**but do not stop monitoring to write a full planning session around it.**

🔴 **The fork that matters most, and the one to raise before acting on it: is a stalled phase stuck because the SYSTEM
failed, or because the BRIEF was wrong?** Those get filed to different places, and guessing between them wastes a
dispatch.

## The release, and the ONE summary

**The monitor exits when every sub-issue is CLOSED**, and the release line states the verdict situation in one of
three forms. **That is the machine's half.** The Architect's half — exercising the live artifact — is step 5.

**Then ship exactly ONE summary, once, at the end: what shipped, what broke, what you fixed.** Not a running
commentary, not a report per transition. **Tyler asked to walk away and come back to one answer.**

## First move on this branch

File the chain (step 3), then run the verification reads and say in a few lines: **the Feature number, the filed
issues in chain order, which is dispatched and to which box, and the current chain state.** Then arm the monitor and
hold it. **Do not re-check on a cadence you remember to keep — that is the idle defect.** The events come to you;
between them, **do other work. This is not a session where you sit still.**

---

# Branch C — `interactive`: the passes loop

**Two doors reach it and neither owns it:** `/execution-start` hands off here after the one-time filing commit, and a
session picking work back up comes straight here via `/execution-continue`. 🔴 **Nothing in it is a one-time step.**
Everything here is **re-entrant by construction**: it reads the plan and the issues live, so a fresh session runs it
exactly the way the session that filed the work would.

🔴 **The vocabulary is PASS.** Never "blocked", never "held". **Interactive execution is passes iterating until Tyler
says it is right, with me autonomous throughout. A pass that comes back wrong is a pass; the next one starts
immediately.**

🔴 **Do not import "after dispatch, stop" into this branch.** That rule exists because a systemd run completes without
me. **Here there is no run** — execution IS the loop between Tyler and me, and leaving it abandons him mid-project.

**READS**

- The plan document and its Plan issue — `gh issue view <plan#> --repo utopia-models/knowledge` (sub-issues and the
  `Features:` line). **Read it back; never assume it.**
- The Feature and every filed sub-issue: `gh api repos/utopia-models/knowledge/issues/<n>` and its sub-issue list. 🔴
  **The issues are the state.** Never a step marker, never a doc, never scroll-back.
- The Feature's `## Acceptance`, **verbatim** — it is what the report grades and what step 5 records.
- **When the work is creative generation**, the project directory `wi/work/raw/projects/NN_<slug>/` (**the directory IS
  the schema — copy an existing one, `01_rodeo/` is the fullest**).

**WRITES**

- **One PASS at a time, each ending in a commit.** On creative work a pass is one generation round under
  `wi/work/raw/projects/NN_<slug>/`, plus its Outcomes row.
- `plan.md` checkboxes `[ ]→[~]→[x]`, committed as they change, when the work has a spec directory.

**REFUSES**

- 🔴 **To summarise a render.** I generate in this session with the Higgsfield tools
  (`_rules/media-is-made-in-the-session-that-owns-it.md`) and every result goes into the conversation — the URL or
  the image, never a description of it.
- **To POLL.** There is nothing to watch: a generation call returns its result. **Never wait on a timer.**
- **To end the turn on an offer.** No *"want me to continue"* — the next pass starts.

**The loop**

```
read the plan + its issues → run ONE pass → show Tyler the real artifact → his word
  → wrong: the next pass starts now      → right: the narrow report, then step 5
```

🔴 **ONE HARD LOCK PER PASS.** Combined-constraint work fails roughly half the time; **two locks is two passes.**
Motion plus legible text is two passes. So is a rotation plus a lean. **Splitting up front costs one message;
discovering it costs a failed pass and Tyler's time.**

### Creative generation — one lock per pass, every result shown

When the work is creative generation, this branch's loop IS the generation loop: write the pass's brief → generate it
here with the Higgsfield tools → show every result in the conversation → Tyler's word → Outcomes row + commit.
🔴 **Tyler is the sole verifier of a render** — never me. Flagging a structural lock the render broke is fair;
grading its taste is not.

### An unsystematised interactive loop is still legitimate

This was a mode value until 2026-08-24; it is now plain `interactive` with a subprocess of `general` or `none`.
**Tyler explains the loop he wants in the moment.** 🔴 **Do not invent a generic interactive loop to fill that slot** —
systematise it later, from real examples. **Everything above still applies:** passes, one lock, the issues are the
state, no polling.

### The narrow report — three lines and a next

**It WRITES NOTHING.** Run it while sub-issues are still open; when they are all closed, or when the question is
whether the acceptance is met, run the VERIFY pass in step 5 instead.

**READS** — the Feature and its sub-issues live (**open/closed is the status; nobody types one**); the commits this
session made (`git log --oneline origin/main..HEAD` in each repo touched); on the creative branch, the job files'
Outcomes rows under `wi/work/raw/projects/NN_<slug>/source/jobs/` — those are **provenance, how a pass was made, not status;
never derive done from an Outcomes row**; and the Plan issue only to name which plan this is.

```
SHIPPED   <what is closed, and the artifact that proves each one>
OPEN      <the sub-issues still open, by number and title>
NEXT      <the one pass that runs now>
```

**Name the ARTIFACT beside each shipped item** — the URL, the render, the command that exercises it — **not the commit
that produced it.** A merged PR is evidence about the source; the artifact is the claim.

**REFUSES** — **a board sweep**, unless asked (no `gh issue list` across lanes, no other plan's rows, no fleet-wide
counts, no "while I was in there" — **one Feature**); **a status nobody derives** (no marker, no doc, no stored
`status:` field, no self-report — if the issues and the artifact disagree with a label, the label is the wrong one);
**a green build as evidence of a shipped pass**; and **ending on a question** — the report ends with the next pass
named.

**If reading it surfaces a defect** — a dead ref, a wrong title, a missing acceptance — **say so in one line and fix
it in the NEXT pass, not inside this report.**

---

# Checking where NAMED work stands (`/execution-status`)

## STEP ZERO — ask WHICH work, before anything else

🔴 **Your FIRST action is an `AskUserQuestion` asking Tyler WHICH issue(s) or Feature(s) to check.** No tool calls
before it — no `gh`, no ssh probe, no file read, no board sweep, no preamble text. **This workflow is scoped to NAMED
work; checking "everything" is the failure mode it exists to prevent**, and researching before the ask spends the run
on the wrong target.

Build the options **from what is already in context**, never from a fresh board query (which is itself a tool call):
the numbers Tyler just named or this session already touched · the SessionStart *"filed and never dispatched"* line,
if one was injected · a broad **"sweep the whole board"** option, **LAST and marked as the wide one.** Set
`multiSelect: true` — several issues at once is the normal case. Tyler's typed "Other" (a bare number, a title, a
Feature ref) is a valid answer; **take it verbatim.**

**The ONE exception:** Tyler already named the specific issue/Feature in the message that invoked this. Then the ask
is answered — skip it.

## MISSION and SCOPE FENCE

**Drive a named issue or Feature to completion.** Read where it really stands — from GitHub and the boxes, never from
a marker that reports on itself — then **repair what is blocking it, in this session**, and tell Tyler what you did. 🔴
**The report is the by-product, not the deliverable.** *"Where does this stand"* is asking you to **finish** it; **a
session that produces an accurate status and changes nothing has done the easy half.** Decide the remedy and apply it.
The only work you hand back is what genuinely needs his hands or his call — named in one line, **having checked the
two-item list in `_process/identity.md` first.**

**The named work only.** Do NOT rebuild the pipeline. If what you find implicates the sweeper, the runner, the
registry, or the OCC — **name it in one line, file it if it is real, and keep working the thing Tyler asked about.**
Two narrow exceptions: a one-line fix to the thing blocking the named work is in scope; a defect you can prove in the
same breath gets **filed, not fixed**, unless fixing it IS the unstick.

**Research bounded, so read it directly:** for the named work, which children are open and each one's board Status,
Lane, last marker, open blockers and PR; whether a systemd unit is actually live for anything claiming to run; and
**for every open child, which sweeper predicate is refusing it** — then **for each blocker, recurse once: can the
BLOCKER itself ever close?** Read `_infra/scripts/sweep-dispatch.sh` (the eleven predicates are the first ~90 lines,
and each `--explain` string maps to one), `_infra/scripts/task-runner.sh` around the marker block for what each glyph
means, and the Feature's own `<portfolio>/work/specs/<issue#>-<slug>/plan.md`, whose checkboxes are the live work
state. **Dispatch a subagent only if the question becomes unbounded** — *"what else across the whole board looks like
this."* Then report **one line per issue, not a dump.**

## The remedies, by shape

| shape | remedy |
|---|---|
| a vanished run | post a **✘** and set Status back to `Todo` — predicate 6 excludes ✘, so **this is what re-queues it; a bare ▶ does not** |
| a tombstone with a merged PR | close it |
| a tombstone with no PR | a **✘** naming what is missing |
| a `⏸` park | release with the literal token `UNPARK` posted after it |
| a dead-lane chain link | re-lane onto win/nova/cloud/dust |
| an unmerged PR | `gh pr merge <N> --squash --admin` |

🔴 **Never delete a marker** — the record of what a run claimed is the evidence.

🔴 **FIX IT HERE. FILING A PLAN IS THE RARE CASE, NOT THE HABIT.** A new plan is correct ONLY when the fix is genuinely
large AND needs research you do not have. **Everything else — a bad ref, a stale title, a wrong Status, a missing
marker, a one-line script defect — you fix in this session and report as done.** Writing a plan about a
dispatch-or-planning defect is a trap with its own name: **the new plan must itself be filed and dispatched through
the machinery that is broken.** On 2026-08-06 this produced PLAN-95 while the actual defect — PLAN-68 pinned at step 5
forever — went untouched for two more turns. **The plan was work ABOUT the problem instead of the fix.** **File a plan
only when you can name the missing research. If you cannot name the unknown, it is not a planning problem — it is a
fix you are avoiding.**

🔴 **The fork that matters most, before you touch anything: is this actually STUCK, or is it merely WAITING?** Waiting
is the common case, and unsticking something that was fine is how a Feature flickers open on the board.

---

# 🔴 EVERY GATE CLAIM IS RE-DERIVED BEFORE IT IS REPEATED — `gate-render.sh`

**Applies on every branch of step 4, and on reading a blocker, not only on writing one.**

```
bash ~/dev/utopia-models/knowledge/_infra/scripts/gate-render.sh <the Feature> <each open sub-issue>
```

On 2026-08-27 at 22:30 an escalation was read in an issue body — *"Tyler: add `@utopia_built_bot` to the target
Telegram group"* — and relayed to Tyler as a live gate. **It had been false since 19:23:34, 104 seconds after it was
written**, resolved by the fleet. Tyler, for the second time: *"The bot is already in there, and I have repeated this
many many times."* `_rules/resolve-blockers-at-planning-time.md` already fires **on READING a blocker** — the rule
existed and was broken, **which is why this is a command and not another sentence.**

| verdict | what it means | what the report says |
|---|---|---|
| 🔴 **LIVE** | its `gate-recheck` exited **0**, re-derived seconds ago | **Report it, and name the action.** A live gate is never hidden or softened. |
| ✅ **CLEARED** | its `gate-recheck` exited non-zero | Say it **cleared**, and when. **Never repeat it as a gate.** |
| ⚠ **UNVERIFIED** | no `gate-recheck` — nothing could be re-derived | Quote it **with its age and the word UNVERIFIED**. It is a claim, not a gate. |

**Its exit status is the answer when you only need one:** `0` a live gate exists · `1` no gate claims · `2` every
claim was cleared or unverified — **nothing to put in front of Tyler.**

🔴 **REFUSES to repeat gate prose it did not re-derive.** Any sentence naming Tyler as the thing work waits on — in a
body, in a comment, in a title tag — passes through `gate-render.sh` before it reaches a human, or it is reported
verbatim as UNVERIFIED with its age. **An escalation is a cached claim**, and a cached claim with no age check is
banned.

🔴 **The TITLE TAG counts.** `[INTERACTIVE — Tyler` / `[DO NOT DISPATCH]` in a TITLE is an asserted gate — it is what
the OCC's `chain.held` is derived from — **so it gets a verdict too, even when the body never restates it.**
