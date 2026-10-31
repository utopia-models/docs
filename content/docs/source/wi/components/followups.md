---
title: "followups — a prompt typed into a tmux session at a set time, surviving restarts"
description: "Mirrored from the fleet knowledge base: wi/components/followups.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/components/followups.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
component: followups
serves: all
runs-on: novaserver (architect)
adrs: []
owns:
  - _infra/scripts/followup.sh
  - _infra/systemd/followup.service
  - _infra/systemd/followup.timer
```

# followups — a prompt typed into a tmux session at a set time, surviving restarts

## WHAT IT IS

The Architect's way to come back to something later. `CronCreate` jobs live inside one Claude process: they
die with it and expire after 7 days. Session d3802857 used 24 of them (8 recurring watches) and one durable
timer (knowledge#10773). A follow-up is a file plus a systemd user timer instead. When it comes due, the timer
types the prompt into the named tmux session, whatever Claude is running there by then: after a `/clear`, a
crash, a resume or a reboot (persistent-sessions brings the session back under the same name).

A reminder **Tyler** should see is not a follow-up. It goes on his Google Calendar with a popup:
`followup.sh remind`.

## HOW IT WORKS TODAY

- **`followup.sh add [--every <dur>] <when> <session> <prompt…>`** writes `~/.claude/state/followups/<id>.json`
  (`id · due · session · prompt · every · waiting`). `<when>` is `30m`/`2h`/`1d`/`90s` from now, or anything
  `date -d` reads (`"tomorrow 09:00"`, `"2026-11-02 14:00 UTC"`). `--every 30m` makes it recurring: after each
  delivery the due time moves forward by the interval, skipping any missed slots.
- **`followup.sh list`** prints every pending follow-up: id, due time, session, interval, prompt. A due one
  that has not gone out yet is marked `OVERDUE (<why>)`.
- **`followup.sh done <id>`** deletes a follow-up. This is how a recurring one stops.
- **`followup.timer`** (`OnCalendar` every minute, `Persistent=true`) runs `followup tick`. For each due follow-up
  it reads the session's pane and types the prompt only if the pane is **idle**:
  - no running turn: the spinner with a live clock, `✻ Combobulating… (5s · …)`, or `esc to interrupt` in
    older builds;
  - no dialog (`Enter to confirm`, folder trust, an open question menu: `❯ 1. …`);
  - an empty input box. Claude's suggestion text is drawn dim (`ESC[2m`) and counts as empty. Anything else
    is text Tyler is typing and is never overwritten.
  The prompt goes in as `[followup <id>] <prompt>` (`tmux send-keys -l`, then `Enter`). The tick then checks
  that the input box emptied. An `absent`, `busy`, `dialog` or `typing` pane leaves the follow-up pending,
  with the reason in `waiting`, and the next minute tries again. A one-shot is deleted once delivered.
  `tick` takes a `flock`, so two runs never type the same prompt twice.
- **`followup.sh remind <when> <title> [popup-minutes]`** mints a Calendar token (`mint-token.sh`, subject
  `tyler@utopiamodels.ai`) and inserts a 15-minute event on his primary calendar with a popup override
  (default 0 minutes before). It prints the event link.
- **`followup.sh install`** (run as the user whose sessions it serves) copies the script to
  `~/.local/bin/followup` and the unit and timer to `~/.config/systemd/user/`, and enables the timer.
  Overrides for tests: `FOLLOWUP_DIR`, `FOLLOWUP_TMUX_SOCKET`, `FOLLOWUP_NOW`, `FOLLOWUP_CAL_USER`.

## BOUND VALUES

<!--[[[cog
m.exists("_infra/scripts/followup.sh _infra/systemd/followup.service _infra/systemd/followup.timer _infra/scripts/mint-token.sh")
m.value("*-*-* *:*:00", "_infra/systemd/followup.timer", r"OnCalendar=(\S+ \S+)")
m.value("Persistent=true", "_infra/systemd/followup.timer", r"(Persistent=true)")
m.value("900", "_infra/scripts/followup.sh", r"end=\$\(\(start \+ (\d+)\)\)")
m.value("esc to interrupt", "_infra/scripts/followup.sh", r"\|(esc to interrupt)' <<<")
m.calls("_infra/scripts/followup.sh", "mint-token.sh")
]]]-->
- ✅ `_infra/scripts/followup.sh`
- ✅ `_infra/systemd/followup.service`
- ✅ `_infra/systemd/followup.timer`
- ✅ `_infra/scripts/mint-token.sh`
- ✅ `*-*-* *:*:00` — still live in `_infra/systemd/followup.timer` (`OnCalendar=(\S+ \S+)`)
- ✅ `Persistent=true` — still live in `_infra/systemd/followup.timer` (`(Persistent=true)`)
- ✅ `900` — still live in `_infra/scripts/followup.sh` (`end=\$\(\(start \+ (\d+)\)\)`)
- ✅ `esc to interrupt` — still live in `_infra/scripts/followup.sh` (`\|(esc to interrupt)' <<<`)
- ✅ `mint-token.sh` — still called by `_infra/scripts/followup.sh`
<!--[[[end]]]-->

## DETERMINE CURRENT STATE

```bash
# as `architect` on novaserver (from a master: ssh nova@localhost "sudo -n -i -u architect bash -c '…'")
export XDG_RUNTIME_DIR=/run/user/$(id -u)
~/.local/bin/followup list
systemctl --user list-timers followup.timer --no-pager
journalctl --user -u followup -n 20 --no-pager -o short-iso    # fired / waiting lines
```

## INSTALL / UPDATE

From a checkout of `origin/main` on the box, as `architect`: `bash _infra/scripts/followup.sh install`.
A script, unit or timer change needs a reinstall. Pending follow-ups are untouched by a reinstall.

## KNOWN BROKEN

- Idle is read off the screen. A Claude Code release that renames its spinner would make a working pane read
  as idle, and the prompt would be typed mid-turn. The pattern was measured on 2.1.310 (2026-10-31);
  re-measure after a major update.
- A pane that never goes idle (Tyler typing and leaving text in the box) holds its follow-ups indefinitely.
  `list` shows them as `OVERDUE (typing)`.
