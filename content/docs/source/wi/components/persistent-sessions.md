---
title: "persistent-sessions — Tyler's sessions come back after a reboot or a crash; plain `claude` makes one"
description: "Mirrored from the fleet knowledge base: wi/components/persistent-sessions.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/components/persistent-sessions.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
component: persistent-sessions
serves: all
runs-on: novaserver (architect)
adrs: []
owns:
  - _infra/persistent-sessions.tsv
  - _infra/scripts/persistent-sessions.sh
  - _infra/systemd/persistent-sessions.service
  - _infra/systemd/persistent-sessions.timer
```

# persistent-sessions — Tyler's sessions come back after a reboot or a crash; plain `claude` makes one

## WHAT IT IS

Tyler keeps Architect sessions open on novaserver (unix user `architect`, knowledge#10285), one tmux
session per plan, and drives them from his phone through Remote Control. Those tmux sessions are plain
transient scopes: a reboot drops every one. This component recreates each session named in the
manifest, resumed into the same conversation with Remote Control on, and prints its phone URL
(knowledge#10131, Feature #10129).

Each manifest row names the unix user it runs as, and each box's unit acts only on its own user's rows.
knowledge#10189 added a row for the always-on agent `pharaoh`, waiting signed-out in `claude auth login`;
knowledge#10206 removed that row and the login-wait with it (Tyler, 2026-10-25: *"So I remain talking
only with you"*). An unattended agent runs on a non-refreshing token and has no session here.

## HOW IT WORKS TODAY

- **Plain `claude` is a persistent session** (knowledge#10559, Plan #10499 decision 6). `install` puts a `claude`
  shell function in `~/.bashrc` (between `# >>> persistent-sessions` markers) for architect, peaky and scout.
  A bare `claude` on a terminal, outside tmux, runs `persistent-sessions open`: it starts — or re-attaches —
  the tmux session named for the current directory (its basename; the home directory is the user's own name;
  a manifest row already in that directory wins), running `claude --remote-control <name>` with the same
  hook settings, and registers it in `~/.local/state/persistent-sessions/registry.tsv`. Any argument (`claude
  -p`, `claude --resume …`), a pipe, or a shell already inside tmux runs the real binary untouched, and the
  agent loops never source `~/.bashrc`. Tyler never types tmux.
- **The restore set** is the manifest rows for this user plus every registry row, minus the retired. The
  manifest stays the declared seed (it carries plan issues and scout's pin); the registry is the derived
  record of what Tyler actually opened, so a new session needs no PR.
- **Crash vs. deliberate end** (knowledge#10559). Every pane runs `persistent-sessions run <name> [id]`, which
  waits on claude and writes `<name>.exit` (`rc=… signalled=… system=… user=…`). Exit 0 with no SIGHUP/SIGTERM
  and no shutdown in progress (`/exit`, Ctrl-D, Ctrl-C twice) writes `<name>.retired` and drops the registry
  row: the session stays ended until plain `claude` in its folder reopens it. Anything else — `kill -9`, a
  crash, `tmux kill-server`, a reboot — leaves it in the restore set.
- **The timer** `persistent-sessions.timer` re-runs the unit 5 minutes after the last run ends
  (`OnUnitInactiveSec=5min`), so a crashed session is back, resumed, within ~5 minutes; `start` leaves a live
  session alone.
- **No prompt can block a launch.** Before launching, `start`/`open` write `hasTrustDialogAccepted: true` for
  the session's folder into `~/.claude.json` (only when missing), and the `--settings` file carries
  `skipDangerousModePermissionPrompt: true`, so neither the folder-trust nor the Bypass Permissions warning
  can stop a reboot (2026-10-28, 2026-10-30). `install` pre-trusts every folder of the restore set.

- **The manifest** is `_infra/persistent-sessions.tsv`: one row per session — tmux name, directory, Plan
  issue, an optional pinned resume id, and the unix **user** it runs as (`architect` for the Architect rows `architect-fleet` and `architect-upwork`, which share `/home/architect` (`architect-upwork` was `architect-2` until 2026-10-30); `scout` for the `scout` row in `/home/scout`, which pins a resume id). **To keep a session alive, add its row and merge**: the script
  reads `origin/main` of the box's knowledge clone with `git show` at every run (never the clone's dirty
  worktree), and falls back to its last good copy in `~/.local/state/persistent-sessions/manifest.tsv`.
- **The resume id is derived, not stored.** It is the newer of two witnesses: the record Claude keeps in
  `~/.claude/sessions/<pid>.json` (its `tmux` field names the tmux session; a reboot leaves the dead
  process's record behind) and `~/.local/state/persistent-sessions/<name>.id`. A clean exit — `tmux
  kill-server` — makes Claude delete its record, so every session this script launches loads a
  `SessionStart` hook through `claude --settings` (startup · resume · clear · compact) that writes that
  file; `/clear` inside a session therefore never strands the resume. The hook names the file by the
  session's **live** tmux name (`tmux display-message -t $TMUX_PANE '#S'`), never its launch-time
  `PS_SESSION_NAME`: `architect-fleet` and `architect-upwork` were launched as `architect`/`architect-2` and
  renamed, so until knowledge#10559 a `/clear` in them wrote the wrong `.id`. `install` migrates: it records
  every live session under its live name and deletes any `.id` naming neither a live session nor one in the
  restore set. The manifest pin is used only when neither witness exists.
- **A row can add to its session, and only its session.** `row_plugins` in the script names the plugins a row's
  `--settings` file enables (today `scout`: `fleet-doctrine@fleet-doctrine`, written to
  `hook-settings.<name>.json`; other rows share `hook-settings.json`), and `~/.config/persistent-sessions/bin`
  (`PS_SESSION_BIN`), when it exists, goes first on `PATH` for the sessions this script launches — scout's `gh`
  wrapper lives there. scout's own `~/.claude/settings.json` keeps the plugin off, so its headless `claude -p`
  calls load neither (option E, 2026-10-30).
- **`start`** (the boot unit) skips any session already in tmux, waits for the network, and launches each
  missing one as `claude --dangerously-skip-permissions --resume <id> --remote-control <name>` in a tmux
  server that `systemd-run --scope` puts in its **own** scope — so stopping or re-running the unit never
  takes a live session down. It refuses to resume an id another live process already holds (two writers
  on one transcript). It never signs a user in.
- **A prompt holding the pane is named, not guessed at.** A session started in a directory Claude has
  never trusted stops on the folder-trust prompt before Remote Control registers (its default is "No,
  exit"). `start` and `list` read the pane and report `BLOCKED on Claude's folder-trust prompt — consent:
  agent-session.sh <user> trust <name>` (formerly architect-session.sh, generalised by knowledge#10445), and `start` exits 1 for it whether it launched the session or found
  it already live — so the unit stays failed until the consent is given, instead of passing on "already
  live" (knowledge#10298). Claude saves an accepted trust for every folder EXCEPT the home directory,
  which is where the Architect's row runs (`/home/architect`): there the consent lasted one process and
  the 2026-10-28 reboot asked again. So `trust` also writes `hasTrustDialogAccepted: true` for the pane's
  folder into `~/.claude.json`, and one consent survives every reboot (knowledge#10382). Probe:
  `sudo -u architect jq '.projects["/home/architect"].hasTrustDialogAccepted' /home/architect/.claude.json`.
  A FIRST start then shows a second screen, the Bypass Permissions warning (the row launches with
  `--dangerously-skip-permissions`), also defaulting to "No, exit" — `start` reports it as `BLOCKED on a
  prompt` and the unit fails again; `trust` accepts it in the same consent (knowledge#10445; peaky's first
  boot, 2026-10-30, failed on both in turn, knowledge#10479).
  `trust` re-runs the unit after confirming, so it goes back to `success` by itself; a consent given any
  other way (keys in tmux by hand) leaves the unit failed until `systemctl --user start
  persistent-sessions` runs (knowledge#10311).
- **The unit** `persistent-sessions.service` (`systemctl --user`, `WantedBy=default.target`; the box has
  `Linger=yes`) is a oneshot without `RemainAfterExit`, so every `systemctl --user start` — and every timer
  tick — re-runs it.

Remote Control needs the box's full-scope `claude auth login` (it refuses `CLAUDE_CODE_OAUTH_TOKEN`);
the box is logged in that way and carries no such env var.

## DETERMINE CURRENT STATE

```bash
# as the `architect` user on novaserver (from nova: ssh nova@localhost "sudo -n -i -u architect bash -c '…'")
~/.local/bin/persistent-sessions list          # the restore set: live, plan, id, phone URL; then the retired
systemctl --user list-timers persistent-sessions.timer --no-pager
cat ~/.local/state/persistent-sessions/registry.tsv ~/.local/state/persistent-sessions/*.exit   # opened by `claude`; how each last ended
type claude                                    # a function in an interactive shell
~/.local/bin/persistent-sessions manifest      # the manifest as the unit reads it
systemctl --user is-enabled persistent-sessions; journalctl --user -u persistent-sessions -n 20 --no-pager -o cat'
```

The unit's own output (one line per session, with its URL) is in that journal.

## INSTALL / UPDATE

From a checkout of `origin/main` on the box, as each user (`architect`, `peaky`, `scout` on novaserver):
`bash _infra/scripts/persistent-sessions.sh install` — copies the script to `~/.local/bin/persistent-sessions`
and the unit + timer to `~/.config/systemd/user/`, enables both, writes the `claude` function into
`~/.bashrc`, pre-trusts every restore-set folder and migrates stale `.id` files. A manifest change needs no
reinstall; a script, unit or timer change does. A live session keeps running the old `run`-less command
until its next relaunch, but its hook calls the installed script, so the id fix applies at once.

## KNOWN BROKEN

- **Sessions launched before v2 do not know a deliberate end.** `architect-fleet`, `architect-upwork`,
  `logistics`, `peaky` and `scout` were launched as `exec claude …`, with no `run` around them, so an `/exit`
  in one leaves no `.exit` and the timer brings it back within 5 minutes. Each picks up `run` at its next
  relaunch (the next reboot). Until then, end one for good with `persistent-sessions retire <name>` before
  `/exit`.

- A session Tyler opened by hand (not by this script) carries no hook until its first relaunch; until
  then its id is refreshed only when `start` or `list` runs. A `/clear` in it followed by a clean
  `tmux kill-server` before either runs would resume the pre-clear conversation. A reboot is unaffected
  (Claude's own record survives it).
- **No real reboot has been observed yet** (VERIFY knowledge#10133). Every piece is exercised separately —
  the unit is enabled with `Linger=yes`, `start` recreates a killed session
  with Remote Control on — but not the chain end to end. The next reboot is the test:
  `uptime -s; journalctl --user -u persistent-sessions -b -o short-iso --no-pager; ~/.local/bin/persistent-sessions list` as `architect`.
