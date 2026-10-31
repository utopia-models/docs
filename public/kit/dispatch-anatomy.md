# The run path, and every refusal in it

`fleet-architecture.md` is *why*. This is *what happens*, in order, and what stops it.

---

## The three processes

| | runs where | lives for | job |
|---|---|---|---|
| **the scheduler** | the always-on box, on a 5-minute timer | seconds | select eligible work, shell out to the dispatcher |
| **the dispatcher** | wherever it is called — timer or a human's laptop | seconds | refuse or launch. Never does the work |
| **the runner** | the worker, inside a supervised unit | minutes to an hour | *is* the run. Announces, invokes the agent, announces the outcome |

🔴 **The scheduler and a human are two callers of one dispatcher.** Every guard must live in the
dispatcher, not the scheduler, or the hand path bypasses it — which is exactly how a dependency check
that "existed" was bypassed by the more common caller.

---

## Selection — the scheduler's predicates

Applied in one pass over one query. Each is a bound something already lost money on.

1. **Status is the queue's `Todo`** — the field, read live. Never a label, never a marker.
2. **The lane names a reachable worker, or is blank.** Blank is routable, not broken.
3. **The parent is open, or there is none.**
4. **Every blocking dependency is closed.**
5. **No live unit for this issue, anywhere in the fleet.**
6. **The last marker is not a start, a success, a block, or a no-op.**
7. **The non-capacity attempt count is under the cap** — counted from the issue's own markers, never a
   state file.
8. **No unreleased park latch.**
9. **No human assignee and no hold label.**
10. **Some worker is not capacity-dark.**
11. **Zero open sub-issues** — a grouper is not the work.

🔴 **Predicate 11's incident is the most instructive.** A parent and its own child were dispatched
**twelve seconds apart**, both ran the same work to completion, one merged and the other's identical
edit was discarded — and the loser's board actions raced the winner's *seconds after it had closed
them*, flickering two items open on the human's board. Both runs were correct in isolation; neither
could see the other. The rule keys on **open children**, not on having children, so it self-releases.

🔴 **Predicate 2 encodes a modelling error worth not repeating.** "Lane" was first read as a
*subject-matter* claim — infrastructure work goes to the infrastructure worker. That held work behind
a dark worker while three others idled. Lane now means **which box**, subject matter is its own
field, the lane is tried first for locality, and any healthy worker takes any issue.

🔴 **Predicate 9 exists because the scheduler once dispatched two throwaway probes** whose own bodies
read *"The change: None. Throwaway; closed immediately"* as two full runs. A fixture is
indistinguishable from work by every other predicate, so **the label is the whole mechanism** — and
every test that files a work item must apply it at filing time.

---

## Refusal — the dispatcher's pre-flight, in order

The ordering is designed: free local checks first, then the one network round trip, then any write —
so a refusal never leaves a mark for a run that never started.

| # | check | fails | writes? | why it exists |
|---|---|---|---|---|
| 0 | **PATH repair** | — | no | A non-interactive ssh gets a minimal PATH. `jq` was `command not found`, exit 127. Write it as an `if`, not an `&&` list — under `set -e` that exits 1 on every box lacking the directory |
| 1 | **Issue exists** | closed | no | A dispatch that dispatched nothing must not exit 0 |
| 2 | **Issue is not closed** | closed | **no** | The scheduler's list is up to 5 minutes stale. Measured: an issue closed, a run started **46 seconds later**. Silent, because a marker would make it permanently ineligible if reopened |
| 3 | **Title is not marked do-not-dispatch** | closed | **yes** | The one refusal that *does* comment, because it is a permanent property of the issue rather than a transient one |
| 4 | **Worker is not capacity-dark** | **open** | no | Twenty runs died in 34 seconds into an exhausted account. Placed after check 1 so the message names real work, and before any write so a refusal cannot strand the item |
| 5 | **No open blocking dependency** | **open** | no | The scheduler had this; the hand path did not, and a batch dispatch started a run whose blocker was open |
| 6 | **No live run for this issue, fleet-wide** | **open** | no | One issue dispatched twice 14 seconds apart; two long runs raced to a PR on the same files, one made worthless |
| 7 | **The target repo's CI is not red** | **open**, advisory | **yes** | One repo's main was red for 14h13m; every run in that window inherited an unmergeable baseline, burned its budget, and was stamped failed **for work that was correct**. Unreadable CI is never treated as red |
| 8 | **Worker reachable, permission works, runner file present** | closed, **three distinct codes** | no | ssh exits non-zero for its *own* failures too. A `test -f \|\| echo "stale"` printed "stale clone" while the file was present — acting on that means re-dispatching into the identical failure. The remote side **always exits 0** and prints one of three tokens; no token means nothing ran, so **no claim may be made** |
| 9 | **Clones synced** | closed | no | One worker branched off a stale clone twice — both PRs arrived conflicting. Dirty trees are **stashed, never discarded** |
| 10 | **The unit-name claim, under a fleet-wide lock** | **open**, and says so | no | The atomic layer. Distinct codes for: another worker holds it · same worker, unit live · name held by a finished run · a supervisor failure that is *not* a collision |
| 11 | **Last-moment disposal re-check — in the RUNNER** | **open** | no | The one every other gate structurally cannot cover |

### Check 11 identifies the real point of no return

Two gates already ask this and both are correct — and both still lost, because neither is the last
moment. A measured 14-second window in which every second is after the last check:

```
14:36:01Z   pre-flight reads the issue — open, unlabelled. Correct, and already doomed
14:36:03Z   a "this is a test fixture" label applied by its owner
14:36:05Z   issue closed as not planned
14:36:12Z   the unit starts
14:36:15Z   start marker posted — a worker spends a full session on disposed-of residue
```

The dispatcher's own note said *"only this file runs at launch time, so only this file can tell"* —
true against a 5-minute cycle, **false against itself**: the unit start, the exec re-entry, the clone
sync and the credential decrypts all sit between its read and the launch. **The check belongs where
it can be right, not where it was cheap.**

It re-asks only **two** signals — closed, and marked-as-fixture — deliberately not the whole hold
set, because those two mean *this was disposed of*, while the others are judgements a human may
legitimately override at the command line.

---

## The run

```
1  pull the shared clone, then exec self ONCE          # never rewrite a script bash is still reading
2  record RUN_STARTED_AT                                # everything after is attributed by time
3  re-check disposal                                    # check 11
4  post the start marker                                # before anything that can fail
5  create a per-run worktree, detached at origin/main    # verify git works in it
6  fetch unread mentions, inject, mark read AFTER        # at-least-once
7  invoke the agent, capture stdout+stderr               # one JSON envelope, parsed once
8  EXIT trap: derive the artifact, post the terminal     # signals re-raised so the trap fires
```

**Step 7's capture feeds two consumers and must be parsed once** — the retry gate and the close-out —
or the two can disagree about whether the run started.

**Step 8 derives the outcome from the forge**, never the exit code:

- a **merged** PR created after `RUN_STARTED_AT` → success
- an **open** PR → not finished
- **nothing** → a no-op marker, never a success
- **zero turns** → structurally impossible to have produced an artifact; any found is someone else's

---

## Two kill switches, both checked before anything reaches the network

- a file on the box
- an open issue with a known title — read out of the page already fetched, so it costs zero extra API
  calls, and works from a phone

🔴 **Write a reason into the file.** The halt line prints its contents *and its age*. Once, an empty
file with no journal entry naming its author stopped the whole fleet mid-drain — **an unexplained
global stop is the one state nobody can safely act on**: removing it blind risks overriding a real
emergency, leaving it risks halting indefinitely over nothing. An empty file still halts, because the
switch must never depend on the setter remembering, but it reports that no reason was recorded.

---

## The minimum viable version

One box, one worker, no prior context. Roughly **250 lines**.

**Must have — remove any one and the architecture stops working:**

1. **An issue tracker as the queue**, with a status field.
2. **A dispatcher that starts a detached, named, supervised process.** Four irreducible details: the
   unit name is `task-<issue>` **with no entropy** — that is your lock · collect it so it does not
   linger · **pass PATH explicitly**, the unit does not inherit yours · detached, so it survives
   disconnect.
3. **A runner that posts a start marker, runs the agent, and posts a terminal in an EXIT trap.**
   Re-raise signals. Pass the exit code as a parameter, never read it inside a wrapper. Never
   swallow the terminal comment's own failure.
4. **Artifact-derived completion**, with `createdAt >= RUN_STARTED_AT`.
5. **A scheduler on a timer, dry-run by default.** Raise the start timeout above your worst cycle —
   the no-overlap guarantee then comes free from the timer, not from a lockfile.
6. **Four pre-flight refusals**: issue exists → issue open → no open blockers → no live unit. All
   silent on the tracker, all failing open, each with a documented override.
7. **A per-run worktree**, detached, verified before handing over.
8. **A heartbeat on every exit path**, including halted and failed.
9. **An attempt cap counted from the tracker.** Give its release token a rule that it must *start a
   line* — a bare substring match meant the system's own template, whose text explains the token,
   released the latch whenever it was quoted back.

**Skip until it bites:** the fleet-wide lock (until you have two workers *or* two dispatch paths) ·
capacity state (until a run dies on a limit) · the announcer — **start with a read-only "why is this
item not moving" flag, which is 90% of the value for 5% of the code** · the reaper · classify-and-retry
· cross-repo artifact discovery.

**Do not copy:** the specific constants. Every number was measured against one fleet's distributions.
Copy the discipline of writing the reading next to the number.
