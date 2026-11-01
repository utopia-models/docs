---
title: "crm — Twenty, and the one client every agent uses"
description: "Mirrored from the fleet knowledge base: wi/components/crm.md"
updated: 2026-11-01
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/components/crm.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
component: crm
serves: net, wi
runs-on: novaserver
adrs: []
spec: net/work/specs/ai-crm-lead-followup/design.md
owns:
  - wi/work/_tools/crm/
  - crm-backup.service
  - _infra/systemd/crm-backup.service
  - _infra/systemd/crm-backup.timer
```

# crm — Twenty, and the one client every agent uses

## WHAT IT IS

The fleet's one relationship record: one **Person** per human (friends atlas runs, recruiters scout finds,
Upwork clients ronin works, prospects and paying clients), with every channel handle, one **owner agent**,
the conversations and messages, a **plan** (goal, next touch, rules, history) and **deals**. Twenty v2.54.0
self-hosted (AGPLv3; the fleet talks to it only through its API). Spec: §A of
`net/work/specs/ai-crm-lead-followup/design.md`; built in knowledge#10924.

🔴 **Agents never call Twenty directly.** `wi/work/_tools/crm/crm.py` is the only path: `find_person`,
`upsert_person`, `set_owner`, `log_message`, `get_plan` / `set_plan`, `upsert_deal`, `STAGES`, `OWNERS`.

## THE MODEL (`schema.py`, idempotent)

| object | holds | the invariant |
|---|---|---|
| `person` (Twenty's own) | name, emails, phones, + `ownerAgent` (atlas · ronin · scout · wingman), `ownerReason`, `ownerChangedAt` | one owner answers; the others read |
| `personHandle` | `value` (normalised), `kind`, → person | `value` is **UNIQUE in Postgres**: two Persons can never hold one handle, however writers race |
| `company` (Twenty's own) | the Org | |
| `conversation` | one per (person, channel) | |
| `chatMessage` | channel, direction, body, `externalId` | `externalId` UNIQUE: logging is idempotent |
| `personPlan` | goal, nextTouchAt, rules, history (JSON) | one per person |
| `deal` | stage, amountCents, source, `externalId` | `externalId` UNIQUE: a re-delivered webhook moves the same Deal |

Names forced by Twenty: its `message` is taken by mail sync (so `chatMessage`), and `plan` is refused by its
metadata validator on v2.54.0 (so `personPlan`). Twenty's own `person.emails` is unique too, which
`upsert_person`'s race path relies on.

`upsert_person` merges on ANY known handle and **never guesses**: handles that already belong to two
different Persons raise `HandleConflict` (a human confirms a merge).

## OPERATE IT (state the probe, not the answer)

```bash
cd wi/work/_tools/crm
docker ps --filter name=crm-                      # server, worker, db, redis
bash crm-up.sh                                    # (re)apply compose.yml; secrets read live from Infisical
python3 schema.py --check                         # prints `schema ok`
uv run --with pytest --with requests python3 -m pytest test_crm.py -v   # live suite; leaves no rows behind
tailscale serve status                            # :8443 must say "(tailnet only)", never Funnel
systemctl --user list-timers crm-backup.timer     # nightly 03:17 UTC, as nova
```

UI: the tailnet URL above, login `tyler@utopiamodels.ai`, password Infisical `utopia/TWENTY_ADMIN_PASSWORD`.
Keys and their meaning: `~/.claude/config/credential-registry.yaml` → `twenty:`.

Twenty's default API limit (100 requests / 60 s per key) is raised in `compose.yml`, with the measurement
that justified it beside the number.

## BACKUP AND RESTORE

Twenty's Postgres lives in the Docker volume `crm_db-data`, which `restic-homes` (homes only) never sees.
`crm-backup.sh` dumps it nightly, age-encrypted to the fleet backup recipient, into the owner-only Drive
folder `wi.crm-backups` (`_infra/drive-manifest.yaml`), then downloads that copy, decrypts it, restores it
into a throwaway `postgres:16` and requires the restored person/handle counts to equal the live ones before
pruning anything older than 35 days.

- Drill the newest copy any time: `bash crm-backup.sh --drill`.
- Full restore onto a fresh box: `bash crm-up.sh` (empty volumes) → `docker compose -p crm stop server worker`
  → decrypt the newest copy with `fleet-infra/BACKUP_AGE_IDENTITY` → `docker exec -i crm-db-1 pg_restore
  -U twenty -d twenty --clean --if-exists --no-owner < dump` → `bash crm-up.sh`. The API key lives in the
  restored database, so the Infisical key keeps working.
- First boot of an EMPTY install only (no restore): `python3 schema.py --bootstrap && python3 schema.py`.

🔴 Person data (handles, plans, messages) never enters git. It lives in Twenty and its encrypted copies only.
