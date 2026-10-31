---
title: "linkedin-channel — the fleet sends connects and messages from Tyler's LinkedIn, at human pace"
description: "Mirrored from the fleet knowledge base: wi/components/linkedin-channel.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/components/linkedin-channel.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
component: linkedin-channel
serves: net
runs-on: novaserver, unix user `nova`, systemd --user `linkedin-channel.timer` → `linkedin-channel.service` (oneshot)
adrs: []
owns:
  - net/work/_tools/linkedin/li_session.py
  - net/work/_tools/linkedin/linkedin_channel.py
  - net/work/_tools/linkedin/install.sh
  - net/work/_tools/linkedin/linkedin-channel.service
  - net/work/_tools/linkedin/linkedin-channel.timer
  - linkedin-channel.service
  - linkedin-channel.timer
```

# linkedin-channel — the fleet sends connects and messages from Tyler's LinkedIn, at human pace

## WHAT IT IS

Tyler, 2026-10-30: *"I want you guys to also be logged into my LinkedIn as well and send connects on LinkedIn and
messages."* (knowledge#10787). This replaces net/README's "Tyler sends LinkedIn connection requests and DMs himself
... never fleet-automated" (PLAN-282). It is the LinkedIn half of targeted outreach A–D (#10777–#10780) and of
ronin's scored Upwork clients (#10802, decision 0006).

The account is Tyler's own, `linkedin.com/in/tyler-youk`, login **`dev@tyleryouk.com`**. The account is the
asset: a restricted account is worse than no channel, so every limit below exists to keep it unrestricted.

## HOW IT WORKS TODAY

- **The session** is one Chromium profile, `~nova/.local/state/net-linkedin/browser`, opened per run by Playwright
  (`~/.cache/nova-apply-venv`) under `xvfb-run`. Nothing stays resident between runs. `li_session.py login` signs
  in with `personal/LINKEDIN_PASSWORD`, or with `--reset` resets it first. Every 6-digit PIN LinkedIn sends goes to
  dev@, which the outreach `gmail` module reads. A "Check your LinkedIn app" challenge texts Tyler on the RAW phone
  and waits 15 minutes for his tap. "Verify using SMS" is never taken: LinkedIn's number on file ends 21, Tyler's
  personal iPhone, which the fleet cannot read, and backing out of that page kills the challenge (500 page). After a
  login it copies the `li_at` cookie to `fleet-infra/LINKEDIN_LI_AT`.
- **Self-healing login.** A tick that finds the profile signed out runs the login itself. It does this only between
  08:00 and 21:00 America/Denver, so a tap request never arrives at night, and at most once every 2 hours. Each
  attempt writes a `login` ledger row, and a failed attempt fails the unit. It resets the password only until one
  reset has succeeded; after that it signs in with the stored password.
- **The queue.** Targets come from two places, merged by profile URL. Rows in `~nova/.claude/state/net/linkedin/queue.jsonl` are written by
  `linkedin_channel.py queue` or `resolve`. Rows in ronin's `linkedin-queue.jsonl` (`company_target.queue_linkedin`, #10802) are read in place with
  `sudo -n -u ronin`. A row is one named person with a `linkedin.com/in/` URL read off a page (never built), a
  connection note in Tyler's Tone 3 (`net/subprocesses/interactive/voice.md`), an optional follow-up `dm`, its
  `audience`, and optionally the recipient's `tz`. `resolve` turns name + company into a profile URL using LinkedIn's
  own people search, and only when exactly one result matches the name and names the company. `queue` sends a row
  that has a name and company but no profile to `pending.jsonl`; each tick resolves 3 of those into the queue,
  or writes a `skip` row saying why it could not.
- **The tick** (`linkedin_channel.py tick --live`, every 10 min by the timer) does three things in order:
  1. It reads the messaging inbox. Each new inbound snippet becomes a `reply` row. A reply from someone the channel
     invited texts Tyler once per thread.
  2. It sends at most one follow-up DM, to an invitee who now shows as 1st-degree.
  3. It sends at most one invite, only if every pace check passes.
- **The pace** (`may_invite`):
  - 20 invites per America/Denver day; at 20 nothing sends until midnight.
  - 95 per rolling 7 days.
  - A random 6–22 minute gap between invites.
  - Only 09:00–17:00 Monday to Friday in the recipient's zone (default America/New_York).
  - A seven-day hold after LinkedIn shows its weekly-limit banner.
  
  When the free personalised-note allowance runs out, the invite goes without a note, and the note text becomes
  the first message after they accept.
- **The ledger** is `~nova/.claude/state/net/linkedin/ledger.jsonl`, the outreach store for this channel. It has one
  row per action: `invite`, `followup`, `accept`, `reply`, `skip`, `limit`, `export`, `sync`. `report` prints
  arithmetic over it, including replies per 100 invites.
- **The Connections export** (`linkedin_channel.py export`) scrolls My Network → Connections and writes
  `~/.claude/state/sf/linkedin-connections.csv`, the path `outreach/linkedin_import.py` reads for #10780.
  That file is never committed.

`install.sh` copies the code to `~/.local/share/net-linkedin`. Nothing reinstalls it on merge, so re-run
`install.sh --code-only` after a change.

## PROBES

`/var/tmp/net-linkedin-signed-in` is world-readable. It is present, holding the check time, while the last check
found the account signed in, and absent otherwise. Any user can read it, the gate-retractor's `svc-ops` included.

```bash
cd ~/.local/share/net-linkedin/linkedin
xvfb-run -a ~/.cache/nova-apply-venv/bin/python -I li_session.py whoami          # dev@tyleryouk.com, exit 0
python3 -I linkedin_channel.py report                                          # counts, queue, next block
python3 -I linkedin_channel.py --self-test                                     # caps, hours, queue, notes
systemctl --user list-timers linkedin-channel.timer; journalctl --user -u linkedin-channel -n 20
```

## FAILURE MODES

- **Signed out.** The next tick in Tyler's waking hours re-runs the login and texts him for the tap. If that
  attempt fails, `tick` exits 3 and the box-wide OnFailure drop-in files the failure. Outside his hours a
  signed-out tick exits 0 and prints why.
- **"Sign in with Google" as tyler@utopiamodels.ai creates a second account.** LinkedIn has none on that address,
  and a duplicate breaks LinkedIn's terms. It happened on 2026-10-31 and was closed within the hour. Never use the
  Google button.
- **Repeat resets get throttled.** A second reset inside about an hour sends no PIN, and `login` exits 4.
- **LinkedIn's DOM moves.** A selector miss writes a `skip` row with the reason, and does not crash. The
  screenshots under `~/.local/state/net-linkedin/shots` show what the page held.
