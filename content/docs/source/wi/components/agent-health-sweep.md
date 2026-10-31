---
title: "agent-health-sweep — the weekly self-enhancement sweep over every agent"
description: "Mirrored from the fleet knowledge base: wi/components/agent-health-sweep.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/components/agent-health-sweep.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
component: agent-health-sweep
serves: all
runs-on: novaserver
adrs: []
owns:
  - _infra/scripts/agent-health-sweep.py
  - _infra/systemd/dropin/claude-code-update-agent-health-sweep.conf
```

# agent-health-sweep — the weekly self-enhancement sweep over every agent

## WHAT IT IS

Once a week it grades **every agent the registry places on novaserver** (`wi/registry/organization.yaml`,
`location.machine: novaserver`, or any entry of `locations` (primary first) on novaserver, so a two-host agent
is graded on its novaserver user, knowledge#10560; nine on 2026-10-25) whose registry `status` is `active` on five checks, against
the live system. An agent with any other status (#10237) is listed
as not graded, and its open drift issues are closed:

| check | healthy when | read from |
|---|---|---|
| **login** | the detector's verdict is `ok`: HTTP 200 on the seat Tyler's rule names (masters on `nova@`, every other agent on `tyler@`) | `_infra/scripts/probe-logins.sh`, the login detector (#10216), which derives the rule from the registry |
| **unit** | no user unit is `failed`, and the resident unit the agent's liveness block names is `active` | `systemctl --user` run as the agent |
| **liveness** | `_infra/occ-feeds/usage/<agent>.json` on origin/main was fetched within 2 h, and its liveness block, where there is one, has not read `red` with its loop silent for more than 30 min | the published feed |
| **quota** | the probe's live 7-day utilization is under 0.95, and `dispatch.sh --quota` does not hold a master dark for a quota reason | probe header `anthropic-ratelimit-unified-7d-utilization`; `dispatch.sh --quota` |
| **acl** | every `invokable_by`/`talks_to` name is a registered agent, and the `Talks to` line of the agent's own `~/.claude/CLAUDE.md` names exactly the registry's `talks_to` | registry vs the file the agent actually loads |

Then it writes to the board, and nowhere else:

- **One issue per drift**, titled `agent drift: <agent> · <check>`, filed through `file-issue.sh` as a sub-issue
  of the standing report issue, in the lane of a master whose own login graded healthy. A box with a dead login
  cannot fix itself. If an issue for that drift is already open, the sweep comments on it and files nothing. A
  login drift belongs to the detector, which files and updates `[login-detector] <agent>: …` every hour: the
  report links that issue, and the sweep files its own only when the detector has none open.
- **Closes its own drift issues** once their check grades healthy. Otherwise a stale alarm costs a dispatch.
- **ONE comment** on the standing report issue `AGENT HEALTH — the weekly self-enhancement sweep (never close
  this)`, listing every agent's five states and **N of M healthy**. It finds that issue by exact title and files
  it (`keep-open`, `waiting:event`) when none is open, so a close is harmless.

A dead or off-rule login is fixed by `wi/work/reference/agent-login-runbook.md`.
An **acl** drift on an agent with no identity renderer (only the masters run
`sessionstart-render-identity.sh`; poppi and the other project-bound agents hand-write their `CLAUDE.md`) is fixed
by a literal `**Talks to (ACL — ONLY these):** <names>` line in that agent's brain repo, then a `git pull
--ff-only` in its `~/.claude` as the agent: the check greps the first `Talks to` line, so a `talks_to: [...]` in
prose does not count (#10235, brain-poppi#6).

## HOW IT RUNS

As **nova**, appended to nova's existing weekly `claude-code-update.service` (timer Sun 09:30 UTC) by the
drop-in `_infra/systemd/dropin/claude-code-update-agent-health-sweep.conf`. The drop-in's header carries the
install commands. No new timer, and nothing stays resident. nova runs it because its NOPASSWD sudo reaches each
agent directly. The script reads every agent as that agent (`sudo -n -u <agent>`), and from any other master it
hops through `ssh nova@localhost` the way `probe-logins.sh` does.

It exits 0 once the report comment is posted. Drift is reported on the board, not through the exit code. It
exits 1 only when it could not post, so the box-wide `OnFailure=` alarm covers a sweep that went silent.

## PROBES

```bash
python3 _infra/scripts/agent-health-sweep.py --dry                 # every read real, every write printed
python3 _infra/scripts/agent-health-sweep.py --dry --agents scout   # one agent
ssh nova@localhost 'systemctl --user cat claude-code-update.service | grep -A3 agent-health-sweep'   # installed?
ssh nova@localhost 'journalctl --user -u claude-code-update.service --since -8d | grep agent-health-sweep'   # last run
gh issue list --repo utopia-models/knowledge --search '"AGENT HEALTH" in:title' --state open   # the report issue
```

**A retired unit stays `failed`.** Disabling a timer does not clear its service's last `failed` result, and
deleting the unit from the repo does not remove the copy in `~/.config/systemd/user`. The Cleaning shutdown
(#10106) left 8 `cleaning-*` services failed on nova, which graded nova's unit check red (#10242). To retire a
unit, as its user: `systemctl --user disable --now <x>.timer`, remove its `.service`/`.timer`/`.service.d`,
then `systemctl --user daemon-reload && systemctl --user reset-failed <x>.service`.
