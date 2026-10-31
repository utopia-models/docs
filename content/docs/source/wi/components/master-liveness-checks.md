---
title: "master-liveness-checks — the three live probes for master account/process/auth state (no script owns this)"
description: "Mirrored from the fleet knowledge base: wi/components/master-liveness-checks.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/components/master-liveness-checks.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
component: master-liveness-checks
serves: all
runs-on: novaserver (architect)
adrs: [182]
owns:
  - probe-alive-*.service
```

# master-liveness-checks — the three live probes for master account/process/auth state (no script owns this)

## WHAT IT IS

Not a service, not a script — a doc naming the three commands that answer "is this fact about a master
actually true right now," for the fact classes the Architect has repeatedly gotten wrong by
guessing instead of checking (PLAN-313, 2026-09-18/19).

**`~/.claude/scripts/fleet-status.sh` is DELETED** (this plan). It duplicated the first check below,
incorrectly — a dead pre-migration path for `win`, and no coverage at all for `cloud`/`dust` — and
attempted the second (per-master live task) as a resident-adjacent jsonl-tailing script, which is
exactly the class of thing `ADR-182` C2/C3 argues against building custom machinery for. Deleting it
is subtraction, not a gap: nothing in the OCC (`utopia-models/utopia`, `apps/web`) ever referenced it —
the OCC's own roster (`apps/web/lib/fleet-roster-feed.ts`, `api/fleet-roster`) and account state
(`apps/web/lib/fleet-usage-feeds.ts`, `api/fleet-accounts`) are independent, live, and unaffected by
this deletion (verified 2026-09-19: zero references to `fleet-status` anywhere in that repo).

`owns:` names the one thing this doc defines that exists nowhere else: the transient `probe-alive-*`
unit check 3 starts. It lives for seconds and `--collect` reaps it, so there is no unit file to bind.

## HOW IT WORKS TODAY

Three checks, cheapest first. Each answers a different fact about the same box, and the commands
themselves are in DETERMINE CURRENT STATE.

**1. Account / subscription / quota state — live, already built, do not hand-roll it.**

Backed by `usage-feed.sh` publishing each box's `~/.claude.json` `oauthAccount` + rate-limit state to
`_infra/occ-feeds/usage/<box>.json` roughly every 10 minutes, aggregated by `apps/web/lib/fleet-usage-feeds.ts`.
Answers: which login a box is on right now, whether two boxes share a seat, session/weekly rate-limit
`%`, and per-box token/cost burn. **This is what should have been read before PLAN-311's shared-login
"finding" — the fact was already live at check 1's URL.**

**2. Process liveness — a master's Claude Code session actually running, not assumed.**

One line, run live, no cached state to rot. Verified 2026-09-19: `win` and `dust` both showed live
`claude --dangerously-skip-permissions` processes; `cloud` showed none (idle — absence of a running
session is a normal state, not evidence of breakage on its own).

**3. Whether a FRESH dispatched run can actually authenticate — the fact checks 1 and 2 cannot see:**

🔴 **A long-running interactive session (a tmux pane, a persistent `claude` process) holds its OAuth
token IN MEMORY from the moment it started, and never re-reads `~/.claude/.credentials.json` after
that. Every DISPATCHED run is a fresh `claude` process — via `systemd-run --user`, exactly what
`task-runner.sh` invokes — and fresh processes read the on-disk file at startup.** These are two
independent facts about the SAME box, and they can disagree: an old interactive session can be
authenticated and idle while the on-disk credential file underneath it has gone bad, so every new
dispatch fails while the box "looks" alive by every other measure.

**Measured on `win`, 2026-09-23** (PLAN-316/#7912 read three ✘ dispatch failures, error class
`auth/config`, `"Failed to authenticate: OAuth session expired and could not be refreshed"`):
- Check 1 (fleet-accounts API): **healthy** — session 4%, weekly 67%, both `normal`.
- Check 2 (`pgrep -u win -fa claude`): **a live process**, PID running since 2026-08-09 (tmux pane,
  `claude --dangerously-skip-permissions`).
- **Neither check caught the real defect.** `~/.claude/.credentials.json` was rewritten
  2026-09-22T04:54:14Z (`stat` — `Birth`/`Modify` both that timestamp), the SAME MINUTE the first
  dispatch failure landed on the issue. The long-lived tmux process (started 2026-08-09, over a month
  earlier) never re-read that file and kept reporting healthy in its own session. Confirmed the on-disk
  token is genuinely dead by calling the Anthropic API directly with the raw `accessToken`, bypassing
  the `claude` CLI's own error wrapper entirely: `HTTP 401`.

**This is the SAME invocation shape a real dispatch uses** — `systemd-run --user`, not an ad-hoc
`sudo -u <master> claude -p`, which is a different, unrepresentative process shape entirely (no
guarantee it inherits the same environment or credential-file read path a dispatched unit does; verify
`env`/`HOME`/`XDG_RUNTIME_DIR` match before trusting it, or just use `systemd-run` directly).

🔴 **Run checks 1 and 2 FIRST, always** — they are free (an HTTP GET, one `pgrep`) and catch most real
breakage. **Only run check 3 when 1 and 2 both say healthy and a DISPATCHED run has still genuinely
failed** (a real ✘ with `error class: auth/config` on the issue, not a hunch) — it starts a real
process on a production master and should not be reached for casually. **Never run check 3 (or any raw
credential-file/token probe) as the FIRST reflex** on a report that something looks down — that is the
tell of guessing at auth from field names instead of reading the documented instruments, which has cost
real corrections before (`sf`, 2026-08-28; `win`, 2026-09-23).

## BOUND VALUES

The checks themselves read live systems, so nothing in this repo can state their answers. What is
bindable is the machinery the prose above leans on:

<!--[[[cog
m.exists("_infra/scripts/usage-feed.sh _infra/scripts/fleet-notify.sh")
m.calls("_infra/scripts/task-runner.sh", "systemd-run")
m.calls("_infra/scripts/fleet-notify.sh", "FLEET_NOTIFY_DRY")
]]]-->
- ✅ `_infra/scripts/usage-feed.sh`
- ✅ `_infra/scripts/fleet-notify.sh`
- ✅ `systemd-run` — still called by `_infra/scripts/task-runner.sh`
- ✅ `FLEET_NOTIFY_DRY` — still called by `_infra/scripts/fleet-notify.sh`
<!--[[[end]]]-->

## DETERMINE CURRENT STATE

**Check 1 — account, subscription, quota:**

```bash
curl -s https://www.utopiamodels.ai/api/fleet-accounts | jq '.accounts[]|{email,agents,util,rateLimits}'
```

**Check 2 — is a session actually running:**

```bash
ssh nova@<host> "pgrep -u <win|nova|cloud|dust> -fa claude"
```

**Check 3 — the one instrument that answers "can a NEW dispatch actually authenticate,
right now":**

```bash
M=<win|nova|cloud|dust>; U=probe-alive-$(date +%s)   # the unit name is chosen HERE, once
ssh -n -o BatchMode=yes -o ConnectTimeout=10 nova@<host> \
  "sudo -n -u $M env XDG_RUNTIME_DIR=/run/user/\$(id -u $M) \
   systemd-run --user --unit=$U --collect -- \
   /usr/bin/bash -c 'claude -p \"say ALIVE\" --output-format json; exit 0'"
sleep 20
ssh -n -o BatchMode=yes -o ConnectTimeout=10 nova@<host> \
  "sudo -n -u $M env XDG_RUNTIME_DIR=/run/user/\$(id -u $M) \
   journalctl --user -u $U --no-pager -o cat"
```

**Read the verdict from the JSON in the journal — `"is_error"` and `"result"` — NEVER from the unit's
exit status.** `claude -p` exits 1 for every error class alike, so the exit code cannot tell an expired
OAuth session from a quota stop or a bad flag; the JSON names it (`"result":"Failed to authenticate:
OAuth session expired and could not be refreshed"` vs `"result":"ALIVE"`, `"is_error":false`). The exit
code carries no information this probe needs.

🔴 **`; exit 0` IS THE FIX, NOT A TYPO — WITHOUT IT THIS PROBE FILES A BOARD ISSUE EVERY TIME IT FINDS
WHAT IT IS LOOKING FOR.** Every master carries a box-wide `OnFailure=` drop-in
(`~/.config/systemd/user/service.d/50-onfailure.conf`, applying `OnFailure=fleet-notify@%N.service` to
**every** user service), so a transient probe unit that exits non-zero is indistinguishable from a
production unit crashing: `fleet-notify.sh` upserts a `smoke-failure` row on the board naming a unit
that `--collect` has already reaped, so whoever picks it up finds `systemctl --user cat` reporting *no
files found* and nothing to act on. **Measured on win@novaserver 2026-09-23T23:26:54Z** — a hand-named
`probe-alive-test` running the old shape (no `; exit 0`) hit the real expired-OAuth state it was run to detect,
exited 1, and auto-filed **#7935**: a true reading of the box, filed as a false alarm about a unit that
never existed. **The same sweep filed #7936 forty-three seconds later** for `probe-nova-test` on
`nova@novaserver` (`"result":"Failed to authenticate. API Error: 401 OAuth access token has been
revoked."`) — one run of check 3 across two masters, two board rows, neither actionable. Reproduced on
demand twice while root-causing it (#7941, #7942, both closed `not planned`), then confirmed fixed — same failing inner command, wrapped:

```
$ systemd-run --user --unit=probe-alive-fixok2-$$ --collect -- /usr/bin/bash -c '/usr/bin/false; exit 0'
$ systemctl --user is-failed probe-alive-fixok2-1153314.service
inactive
$ journalctl --user -u probe-alive-fixok2-1153314 --no-pager -o cat
Started probe-alive-fixok2-1153314.service - /usr/bin/bash -c "/usr/bin/false; exit 0".
```

`inactive`, not `failed`, and no `Triggering OnFailure=` line — against the unwrapped control, which
printed `Failed with result 'exit-code'` followed by `Triggering OnFailure= dependencies`. The real
probe in the wrapped shape still puts the whole JSON in the journal (`"result":"ALIVE"`,
`"is_error":false`, unit `inactive`), so nothing is lost.

**The fix belongs HERE, in the probe — never in `fleet-notify.sh`.** The notifier behaved correctly in
all three filings; it reported a unit that exited 1, which is its entire job. Adding a `probe-alive-*`
name exclusion there would be a fourth shape-bound guard in the one file whose documented history is
shape-bound guards broken by renames (#3805 → #6974 → #6965 → #6977), and it would fail in the
unacceptable direction — a real unit that happened to match the pattern would go silent forever. That
file's own `FLEET_NOTIFY_DRY` block argues this explicitly and rejects a reserved prefix by name.
**If you must run a probe that genuinely has to exit non-zero**, do not reach for that: set
`FLEET_NOTIFY_DRY=1` on the master's user manager for the duration, and unset it immediately after —
the notifier is deaf to real failures on that box while it is on.

## KNOWN BROKEN

### The real mechanism behind check 3's failure — a documented CLI renewal race, not a fleet bug

🔴 **This is NOT a gap in the fleet's own machinery — grepped every script in this repo, nothing here
writes `.credentials.json`.** The Claude Code CLI's own docs (`code.claude.com/docs/en/authentication`,
`troubleshoot-install`) name the real mechanism: refresh happens automatically and silently the
overwhelming majority of the time — `/login` (what Tyler actually does: ssh in, run `claude`, log in
once) is documented as the **fallback after an automatic refresh has already failed**, not the primary
mechanism. That is why "ssh in, log in, nothing further" is true as a description of experience while
refresh is still a real, separate thing happening underneath it — refresh is invisible when it works.

**The docs also name the exact collision that likely produced win's 2026-09-23 incident, verbatim:**
*"Parallel sessions on one machine share a saved login and coordinate its renewal so that only one
process refreshes the token at a time... waking the machine from sleep could cause two sessions to
renew with the same token, which revoked the saved login and prompted every open session to log in
again at once."* Measured on win at the time of the incident: `~/.claude/.credentials.json` held BOTH
`accessToken` and `refreshToken` as empty strings (not just an expired timestamp — actually blanked),
and a second process, `claude setup-token`, was running non-interactively (no TTY to complete its OAuth
flow) and had hung for 40+ minutes, almost certainly colliding with the month-old tmux session's own
background renewal. **Killed 2026-09-23** (the hung PID) so the tmux session's own renewal stops
fighting a process that could never complete. No fleet-side fix exists or is needed here — this is CLI
credential-renewal behavior, external to this codebase, and the mitigation is operational (don't leave
a non-interactive `claude setup-token`/`claude -p` running unattended against a box that also holds a
live interactive session).

🔴 **Do NOT add a login-health field to `wi/registry/organization.yaml` for this.** Checked directly
(PLAN-313 P4, 2026-09-24): `login_health` there is pure prose, read by nothing — the OCC derives every
live account fact from `_infra/occ-feeds/usage/*.json` on its own ~10-minute cycle
(`apps/web/lib/fleet-usage-feeds.ts`), never from this registry. The registry's own `emails_ROTATE`
block already states the reason, from a prior identical mistake (knowledge#2807): *"A declared health
flag is a second copy of a fact the runtime already publishes, and it goes stale exactly the way a
declared email did... Derive it; never declare it."* Tyler, 2026-09-24: he frequently logs boxes out
and into different subscriptions, so any hardcoded auth-state field would drift the moment he does.

### What is deliberately not built

**"What is each master working on right now, mid-run"** — Tyler's call, 2026-09-19: the board's own
▶ (dispatch start) / ✔ / ✘ (exit) comments are enough; a live progress feed would require a resident
reporter process, which is the class of thing `ADR-182` already rejected. Not a gap — the architecture
working as designed.

## Composes with

fleet-context reliability, PLAN-313 (a plan document in the private repo) ·
`wi/registry/organization.yaml`'s `cost_model` block (the registry-side half of fact class 1)
