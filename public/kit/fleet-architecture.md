# Dispatch: the decisions, not the code

Extracted from a working ~7,000-line dispatch runtime — three shell scripts, four workers (separate unix users) on one Linux host,
about eighteen months of accumulated failures. **The 7,000 lines are not the asset.** Roughly 250 of
them are the architecture; the rest is integration with one company's planning layer, plus the scar
tissue of every way it broke. This file is the scar tissue, generalised.

Roles, not values: **the dispatcher** starts a run · **the runner** *is* the run, on the worker ·
**the sweeper** is the scheduler · **a master** is a worker's unix user · **the board** is the issue
tracker that serves as the queue.

---

## D1 · The issue tracker IS the queue

No Redis, no SQS, no NATS. The queue is a board field, read live, one paginated GraphQL query per
cycle. This fleet *had* a message bus and deleted it.

**The failure it prevents: two trackers that disagree.** Every cached copy of queue state is banned,
including the attempt counter — that is **counted from the issue's own comments** every cycle rather
than stored, because a state file is a second tracker.

**The cost is real and measurable.** Per-issue REST calls exhausted the API budget once and the
scheduler then dispatched nothing, silently. Every field added to the query is cost-measured before
it ships: one field cost 143 points against 9 for the whole page, so it is paid per candidate after
the threshold rather than on the page.

**What transfers:** *your queue should be the thing your humans already look at.* If your team lives
in Linear or Jira, that is your queue. You get a UI, an audit log, a comment thread per work item and
notifications for free, with zero operational surface.

## D2 · Status is DERIVED from a merged PR. No agent ever types one

Completion is a merged pull request whose body says `Closes #N`. The tracker closes the issue, and
that closure *is* the status change.

**The rejected alternative:** the agent reports its own completion.

**The failure it prevents:** an agent that says it succeeded when it did not. The runner refuses to
trust the exit code *or* the model's claim, and instead asks the forge which PRs closed this issue. A
run that produced nothing yields an empty answer and earns a no-op marker, not a false success.

**Two corollaries, both learned expensively:**

- **An OPEN pull request is not finished.** This once read "finished — auto-merge armed", which is
  how fifteen PRs stacked up across three repos while every run reported success.
- **A green build is not a working artifact.** A build proves the source compiles. Before claiming
  done, exercise the real thing — run it, curl the deploy, render it and look.

**What transfers, and it is the core idea:** derive completion from an artifact the agent cannot
forge. A merged PR is ideal because the agent can *create* one but the *merge* is a state change in a
system it does not own.

## D3 · A transient supervised unit — not a daemon, not tmux

Each run is one `systemd-run --user --unit=task-<issue> --collect` launched over SSH.

**Rejected, with reasons:** a long-running daemon (forbidden outright — *"a resident process is
forbidden for anything the board, a dispatch run, or a git event already announces"*) · a new timer
for the scheduler (it rides a second `ExecStart` on an existing one) · CI runners (they cannot reach
machines on a private network, and that CI was itself dead for 64 hours once).

**Four properties earn it, and evaluate each independently for your own stack:**

1. It survives SSH disconnect and the operator's laptop sleeping.
2. **The unit name is the lock** — see D4.
3. The cgroup takes the whole process tree with it. Proven: a `setsid`-detached grandchild died the
   instant the unit stopped. A timer built to reap orphans was *retired* on that evidence.
4. `OnFailure=` gives a free alarm. That notifier must always exit 0, or a failing notifier triggers
   its own `OnFailure` and recurses.

🔴 **The detail that bites on day one:** `systemd-run --user` does **not** inherit the caller's
environment. The unit gets the systemd *user manager's* PATH. Tools under `~/.local/bin` or `~/.nvm`
are simply absent, and every dispatch to one box died at `jq: command not found`, exit 127, in 16
seconds. The same class of bug hits the dispatcher one process earlier, because a non-interactive ssh
gets a minimal PATH — Ubuntu's `.bashrc` returns early when not interactive. Prepend PATH explicitly
at the top of any script that can be invoked remotely, and pass `--setenv=PATH` to the unit.

## D4 · The unit name carries ZERO entropy, and that absence is the lock

The unit is named `task-<issue>` and nothing else. The supervisor refuses a second unit with a live
name — in that user's systemd manager, atomically, with no window.

🔴 **The history is the lesson.** The name *used to* carry a timestamp and a random suffix. That
entropy was added as a "fix" when two dispatches inside one second built the same name and the
refusal was read as the bug. **It was the fix.** Entropy made two units for one issue *legal*, so
nothing but a timing check stood between two runs.

**And a timing check has a window it cannot close.** Measured, with real timestamps: guard-to-launch
is 26–27 seconds; two dispatchers both passed a "no live unit" pre-flight, both slept on a shared
stagger, and both launched five seconds apart. Both live.

**The aftermath is why this matters more than the duplicate.** Both were killed by hand, both kills
landed on the *surviving* run, and the issue then closed on that failure — the board said done on
work that never ran.

**Layer the guarantee, because one layer never covers everything:**

| layer | covers | how it fails |
|---|---|---|
| a pre-flight duplicate check | the obvious case, explained early | read-then-act: 26–27s of window |
| the zero-entropy unit name | a second run **on the same worker**, refused by that user's systemd manager | a *user* supervisor is per-user — the same name under two unix users is two names |
| **one lock held across the probe AND the launch** | a second run **on any worker** | fails open: an unwritable lock proceeds and says so |

The third layer is the one you will miss. The check must move *inside* the lock, and the lock must
be held across the launch — so the loser's probe sees the winner's unit. Measured cross-worker
duplicates that passed every earlier layer: three in ten minutes, 5–11 seconds apart.

**When duplicates do coexist, repair deterministically:** keep the **oldest** live unit, ordered by
monotonic start timestamp in microseconds so ties are unreachable. Oldest wins because it has done
the most work. Picking by eye was wrong both times it was tried.

**What transfers, and it is the single best trick here:** *name your unit of work after the work,
never after the attempt.* Your supervisor's own name registry becomes a distributed lock you did not
have to build.

## D5 · Every guard fails OPEN

A refusal fires only on **positive evidence**. No file, no ssh, no permission, unparseable output, a
field that is not literally true — all mean *proceed*.

> *"A false block is worse than a wasted run: it stops the fleet on a bookkeeping failure."*

🔴 **The type-check that makes fail-open actually work.** A forge CLI prints its 404 *error body* to
stdout, so a failed call yields a JSON object rather than an empty string. A naive "is the output
non-empty" test reads an API error as a blocker — **a guard that fails closed on its own outage is an
outage.** Check the JSON *type* before trusting it.

**The one place it fails closed, and the exception proves the rule:** an unreadable queue. A queue
that cannot be read cannot produce an eligibility decision, and guessing one starts the wrong work.
Even there, the probe failure is fatal only for the *applying* mode — a dry run reports; it cannot
double-dispatch.

🔴 **Returning 0 is not the same as being silent.** Bookkeeping may never kill a run, so every
logging step returns 0 — but a `|| true` that swallows a lock failure produced a function that
*returned success having written nothing*. Read the exit status, print a warning on stderr, and
path-scope the commit to this run's own files so it cannot sweep a peer's edit into its message.

## D6 · A refusal writes NOTHING to the queue

Eligibility is read from the **last** status marker on the work item. Therefore any marker a refusal
posts becomes a permanent latch.

Every pre-flight refusal is deliberately silent for this reason: a "blocked" marker would convert a
one-off refusal into permanent ineligibility over a condition that clears itself in minutes.

**The failure class has a name: the tombstone.** A success marker on an issue that stays open makes
it permanently undispatchable and holds everything chained behind it forever. Real instances: two
issues sat unreachable for ten days because their PRs were in another repo, and a cross-repo `Closes`
cannot close an issue.

**Three mechanisms exist purely to manage this hazard:** a tombstone detector · a non-terminal
"finished but deliberately left open" marker · and the rule that **a reopen outranks every older
marker**, because a reopen is an explicit "not finished" written *after* the marker that said it was.

🔴 The subtlest bug in this class: that non-terminal marker was first written *with no glyph at all*,
reasoning that the eligibility rule keys on the last marker so the issue should stay dispatchable.
Exactly backwards — with no glyph the comment was invisible, so the success marker posted seconds
earlier stayed the last word.

**What transfers:** if your eligibility rule reads the last marker, then **every writer of a marker
is a writer of your queue's eligibility.** Audit every path that can post one. The cheap version:
refusals log to stderr, never to shared state.

## D7 · Retry only on a four-fact conjunction

Retry fires only when all four hold, and three of them the agent cannot author:

1. the failure signature is transient — 429, 5xx, network — **and**
2. it is not a hard provider quota limit (a capacity event, not a blip), **and**
3. **the run never started** — no result envelope, zero turns — **and**
4. the forge reports no artifact for this issue.

🔴 **Fact 3 is load-bearing and its implementation is the clever part.** Claude Code (`claude -p --output-format json`)
emits a JSON result envelope for any run that reached the model. A first-request failure never produces one — so
**the absence of the envelope IS the proof that zero turns were consumed.**

Getting that absence right needed a real fix: the capture merges stderr, so the envelope arrives
wrapped in noise and a whole-capture parse failed on a *successful* run. Scan for the last
well-formed JSON object anywhere in the capture, and let **one parse feed both the retry gate and the
close-out** so the two cannot disagree.

**Backoffs 30s → 2m → 8m, and the first number is a measurement:** each gap must outlast the agent
SDK's *own* internal retry ladder, measured at ~212 seconds. A shorter gap re-enters the same
degraded window the SDK already spent three and a half minutes losing to.

**The transient pattern is deliberately narrow** — bare "timeout" is excluded, because a false
"transient" re-runs a genuine defect three times and buries its cause.

**What transfers:** do not retry on *"it failed."* Retry on *"it provably did nothing, for a provably
transient reason, and produced no side effects."* Everything else is a defect a retry hides.

## D8 · "The work failed" and "this worker cannot accept work" need opposite responses

When a run dies on a provider rate limit, the runner writes a state file carrying the provider's own
stated reset time. The dispatcher reads it before starting anything and refuses to launch onto a dark
worker.

**The measurement that built it:** one worker hit its session limit and **twenty dispatched runs died
inside 34 seconds.** Two other workers were then dispatched onto the same work and went dark too. The
knowledge existed; nothing read it before starting the next run.

**Three properties worth copying exactly:**

1. **Self-healing, not a cache.** The worker's next clean run *deletes* the file — and "clean" means
   both a zero exit *and* no limit signature in the output, or a run ending on a trailing notice
   would delete a marker that is still true.
2. **Never fabricate a reset time.** When the provider states none, the field is null and the UI says
   "unknown". A bare clock time with no date is resolved against today and **rolled forward if that
   instant has already passed** — a reset stamped in the past renders a dark worker as recovered.
3. **Two kinds of dark, opposite remedies.** A rate limit clears on a clock; a revoked entitlement
   never does. Same file, different `source` field, different message. Telling someone to wait out a
   revocation is worse than saying nothing.

**And a capacity death must not spend the issue's retry budget** — the attempt counter skips any
start marker immediately preceded by a capacity marker. Without that, a fleet-wide outage burns three
attempts per issue in fifteen minutes and parks the work permanently.

## D9 · No orchestration layer. Dependencies are edges, evaluated at selection

No DAG engine, no workflow runtime. Ordering is native issue dependencies, and the whole dependency
system is one predicate: *select where no blocker is open.*

**The property that makes it work is self-release.** Nothing has to notice a blocker closing — the
predicate is re-evaluated from scratch every cycle.

🔴 **A hold that lives in prose is not a hold.** "HELD until #N closes" written in an issue body is
invisible to every predicate, so such an issue stays undispatched only because something *else*
rejects it — and clearing that something dispatches it instantly into a run whose only correct move
is to stop. A native dependency edge holds silently and releases itself.

**And the agent is told there is no orchestrator, in its own brief:** *"a run that stops to wait for
a notification exits silently and nothing ever wakes it. Waiting is never the move."* Instead it
tests its inputs first, does everything that does not depend on them, and declares a structured
blocker if that left nothing shippable.

**What transfers:** if your work items support dependency edges, you do not need a workflow engine
for fan-out and fan-in. You need a scheduler that re-derives eligibility every cycle rather than
maintaining a state machine.

## D10 · One workspace per run. A shared clone is a hazard

Each run gets its own `git worktree`, detached at a fresh `origin/main`.

**The failure, from a real reflog:** two dispatches to one worker shared a tree. The second run's
pre-flight — stash, then `reset --hard origin/main` — ran **inside the first run's live checkout**.
Five edits destroyed, branch switched out mid-task.

🔴 **Why this is the nastiest bug class here:** *nothing warned; nothing failed.* The signature is
indistinguishable from "the agent did poor work" — the PR is simply missing changes the run believes
it made — which is why 169 runs of telemetry never showed it.

**Three implementation details:**

1. **Detached HEAD is mandatory.** A named branch may be checked out in only one worktree at a time,
   so the second concurrent run fails outright without it.
2. **Resolve the clone path physically.** Git writes the new worktree's pointer from the path it
   resolved *through*, so an aliased or symlinked clone mints a pointer naming a path that does not
   exist — and every git command inside dies `fatal: not a git repository`.
3. **Verify git works in the workspace before handing it over.** Two of seventeen workspaces on one
   box had broken pointers. That failure is invisible from inside a run: the brief says "your cwd is
   a per-run workspace", the model gets a fatal, and has no reason to suspect a one-line pointer file.

**On release: keep, do not wipe.** A clean workspace is removed; one still holding uncommitted work
is kept and named on stderr — the inverse of the silent wipe this fixes.

## D11 · A self-updating runner pulls, then `exec`s itself exactly once

Bash reads scripts incrementally, so rewriting the file under a running interpreter makes it resume
at a byte offset in different content. Pull, then re-exec the fresh version once, guarded by an
environment variable so it cannot loop.

🔴 **Verify the outcome, never the exit code** — a pull can exit 0 against a stale remote ref. The
sync used to be one line ending `2>/dev/null || true`, and **both halves of that suffix were the
failure**: one discarded the reason, the other discarded the exit code, so a clone that could not
sync was indistinguishable from one that did.

**Why a stale clone matters more than it looks:** the agent's behavioural rules are symlinked into
that clone, so a frozen clone is *frozen doctrine* — and the per-run worktree hides it, because the
worktree is built from a freshly fetched remote while the rules the session loaded are days old.
Measured: one worker ran four merged dispatches off a clone 100+ commits behind, missing an entire
behavioural section, for two days, silently.

## D12 · Liveness is the close-out comment. There is no heartbeat

The run announces its start on the work item before anything that can fail, and an EXIT trap
announces its terminal state. Liveness is *"did my run post its close-out."* An item with a start
marker and no terminal is detectably wrong.

**Three things about the trap that are easy to get wrong:**

1. **Re-raise signals.** Bash does not run an EXIT trap on an unhandled SIGTERM — and a supervisor
   stops a unit with SIGTERM. Without re-raising, a timeout, an OOM kill or a reboot skips the trap
   and strands the item forever.
2. **Never read `$?` inside a trap wrapper.** `local rc=$?` is itself a command with status 0, so the
   real code is already gone. Pass it as a parameter.
3. **A deliberate stop is not a failure.** `exit 143` reads identically to a crash, so a hand-cleanup
   was posting failures describing work that was succeeding elsewhere. A crashing process cannot
   signal itself, so an externally-arriving signal earns a distinct marker that makes no claim about
   the work.

🔴 **Never swallow the close-out's own failure.** It once ended `|| true` — the only write that
swallowed its own error — and eight runs closed with no marker at all, making a silent success
indistinguishable from a hang. Retry once, then log loudly.

🔴 **And the deadliest silent-close bug:** the merged PR's own `Closes` had already closed the issue,
and closing an already-closed issue *with a comment* prints "already closed", **returns 0, and
silently drops the comment.** Post the comment first, then attempt the close.

## D13 · Concurrency caps were DELETED, not raised

There is no per-worker, fleet-wide, or per-cycle concurrency cap. A worker with runs already going is
exactly as eligible as an idle one.

**The measurement that deleted them:** caps of 1 per worker / 4 in flight / 2 per cycle throttled the
fleet to **~8% of proven capacity**. The scheduler reported 32 dispatchable, 30 held, with three
workers fully idle while the box sat at load 2.29 on 12 cores with 26 GB free.

🔴 **The reasoning that generalises:** the burn-loop hazard is real, but the defence is the **attempt
cap and the capacity cooldown**, not a small concurrency ceiling. *Those bound wasted starts;
concurrency only bounds useful ones.*

> *"A cap chosen from caution silently becomes the system's capacity, and unlike a bug it never
> announces itself: it reports success while doing a fraction of the work."*

**A second cap was deleted for a better reason still.** A 20-second stagger between launches argued
from measured memory pressure — but **a stagger does not lower concurrency, it reaches the same load
20 seconds later.** It defended a memory problem with a mechanism that cannot affect memory. And it
*inverted* under parallelism: a stagger is only a stagger because the caller is serial. Dispatch N
concurrently and all N sleep together, then launch in the same instant — a synchroniser, the exact
opposite of its purpose.

**The caps that do exist each bound a stuck task, not throughput:** max attempts per issue · max
turns per run (set from a measured distribution: p90 146, max 164, and 131 dispatches at the cap
never hit it) · max retries · a reaper threshold at 2× the longest run ever observed.

🔴 **And the codebase labels its own unmeasured numbers**, writing down the experiment that would
settle each. One threshold is annotated as an explicit guess, with the reason it cannot be tuned yet.

**What transfers:** before writing any ceiling, ask *what failure does this prevent, and is there
already a mechanism that prevents it better?* Then measure the headroom and write the reading next to
the number.

## D14 · Anything unattended announces itself where the human already looks

**The heartbeat is written on every exit path, including halted and failed ones** — because "nothing
to do" and "not running" look identical from outside, and that ambiguity hid a 64-hour outage.

**The reaper** resets orphaned work: last marker is a start, no live unit on any worker, and older
than the threshold. The unit probe, not the clock, is the real signal — the clock only stops a
blinked probe from reaping a live run.

**The announcer** files a report for the stalls nobody is coming for. 🔴 **Its never-announce list is
as load-bearing as its announce list** — open dependencies, holds, parked items are all *the
mechanism working*, and **an announcer that reports correct holds trains the human to ignore the
channel.** A channel they ignore is worse than a log nobody reads, because it looks like it works.

**Two non-negotiables:** idempotent by title against the *live* board, never a search index — a
lagging idempotence check files the same report twice. And no state file; every age derives from the
board's own timestamps.

🔴 **A surprising one worth stealing: never put a live closing keyword in generated text.** Every
remedy said "Close #N" literally. A PR clearing an issue quoted the remedy verbatim — *in a
blockquote, to refute it* — and the forge parsed the keyword without caring about quoting. The merge
closed the issue the PR existed to protect. **Quoting a report is not a mistake; it is what a report
is for.**

## D15 · Two dispatch paths exist, so every guard must live in the path they SHARE

A dependency check lived in the scheduler and was bypassed by every hand dispatch. Forensics on a
duplicate showed the two launches did not straddle two scheduler cycles at all — one came from the
scheduler, the other from an operator's laptop, never entering the candidate loop. **A guard living
only in the consumer cannot see the hand path.**

The same principle drives one implementation with two callers throughout — the capacity probe moved
*into* the dispatcher and the scheduler shells out to it, so the two cannot drift into disagreeing
about what "dark" means.

🔴 **And the testing corollary:** every guard gets a flag that runs **the production function
itself**, never a copy. *A test that runs a duplicate proves nothing about the path that runs.* Some
tests go further and extract the shipped bytes — slicing the live predicate out of the file and
running it against fixtures — so a test cannot pass against a stale copy.

## D16 · Attribute an artifact by TIME, not just by existence

A merged PR bound to an issue stays bound forever; a reopen does not unbind it. So a naive "does a PR
close this issue" check credits **every subsequent run** with an old merge.

- **Created-before-start is not this run's.** One run merged nothing, hit a quota limit, and earned
  success for a previous run's PR while the actual work never happened.
- **Zero turns means zero artifacts, structurally.** A run that consumed no turns never made a tool
  call, so any artifact found for it is by construction someone else's. Two runs that died in five
  seconds were credited with a PR *in a different repo*.
- **The closing reference must be real.** A body search matched an issue number as a bare substring
  — a PR was credited because it quoted a log line starting with those digits. Even a same-line
  keyword test was not enough: *"This PR fixes the failing criterion from VERIFY #6038"* has verb and
  reference on one line, but the verb's object is the criterion. Mirror the forge's own adjacency
  rule: the keyword must sit immediately before the reference.

**What transfers:** record the run's start timestamp before doing anything, and require every
artifact to postdate it. Cheap, and it eliminates a whole class of false success.

## D17 · The agent's brief is a versioned artifact carrying accumulated corrections

The prompt handed to the agent is ~2,500 words of numbered steps, and almost every clause is a scar.
A sample:

- *"NEVER branch from a stale local main — stale-base PRs arrive CONFLICTING."*
- *"The remote main CAN ITSELF BE THE STALE ONE: a force-push rewinds it silently."*
- *"Force-push your own topic branch BY NAME, never a bare force push — that takes whatever HEAD
  happens to be, and once the shared clone was on main: 501 commits went off the branch in one
  command."*
- *"Your job ends at MERGED, not at auto-merge armed."*
- *"Do not close the issue yourself — the merge closes it."*
- *"The evidence field MUST quote the EXACT command and its RAW output. A verdict saying 'grep shows
  6 entries' without the grep is not a verdict, it is an unreproducible claim."*

**Two structural features transfer:**

**The agent writes structured JSON for anything a machine must act on**, never prose — *"your
report's prose is for humans and nothing in this fleet reads English."* Separate files for separate
concerns, each cleared at run start so a prior run's state cannot leak.

🔴 **The system never AUTHORS the agent's evidence.** A table synthesised from "a PR exists" would be
a rubber stamp — *"and a rubber-stamped success is strictly worse than no mechanism at all, because
it converts a visible gap into an invisible false close."* No honest attestation means post nothing
and let the gap be loud.

## D18 · Merge identity is a credential decision, not a git config

With squash disabled, the forge mints a new merge commit server-side authored by **whoever called the
API** — unreachable by `git config user.email`. The REST merge endpoint takes no author parameter, so
**the credential is the only lever.** Verified on the wire: the PR merged by one identity deployed;
the identical one merged by another was blocked.

Two more: an app installation token cannot be used with an interactive CLI login (it validates
against a user endpoint and 403s — environment only), and installation tokens expire at one hour
while a long run can exceed that.

## D19 · Communication is comments and mentions. There is no bus

Unread mentions are fetched at run start, injected into the brief, and marked read **after**
injection — which is what makes delivery at-least-once rather than at-most-once, since a crash before
that point leaves them unread for the next run. Zero infrastructure, durable read state, and every
message is visible to the human on the item it concerns.

## D20 · Two failure signals that look identical must be given different names

🔴 **The most generalisable lesson here.** It recurs at every layer:

| two things that looked identical | how they were separated |
|---|---|
| "nothing to do" vs "not running" | a heartbeat on every exit path |
| a name collision on a live unit vs one still unloading | read the unit's state, not the error string — different exit codes |
| ssh failing vs the remote file missing | the remote command always exits 0 and prints one of three tokens; no token means nothing ran |
| a crash vs a deliberate stop | a crash cannot signal itself |
| a run that failed vs a worker gone dark | separate state file, separate marker, excluded from the attempt count |
| a rate limit vs a revoked entitlement | a `source` field; opposite remedies |
| "no work exists" vs "the write broke" | distinct exit codes — otherwise a legitimate empty result reports a failure forever |

**The purest instance:** adding entropy to the unit name silently broke the scheduler's parser.
Nothing failed — the extraction just stopped matching, the live-run set went permanently empty, and
the anti-duplicate predicate silently could not fire. Measured: eleven live units, zero extracted,
and one issue running concurrently on two workers.

**What transfers:** whenever two conditions produce the same observable, you have a latent silent
failure. Find them by asking of each success path: *what else produces this exact output?*

---

## What to do with this file

You are reading it because a meta prompt told you to, before designing a fleet for someone whose
environment you have already surveyed. **Do not copy the constants.** Every number here was measured
against one fleet's distributions. Copy the *method* — measure the headroom, write the reading next
to the number — and copy the decisions.

The next file, `dispatch-anatomy.md`, is the run path and the pre-flight refusals in order.
