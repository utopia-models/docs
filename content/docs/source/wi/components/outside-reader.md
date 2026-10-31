---
title: "outside-reader — a reader with no fleet context, before anything public ships"
description: "Mirrored from the fleet knowledge base: wi/components/outside-reader.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `wi/components/outside-reader.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
component: outside-reader
serves: all
runs-on: github-actions (self-hosted novaserver runners) · every master box (fleet-doctrine PreToolUse hook) · herald, atlas, scout-outreach (in-process, before each send)
adrs: []
owns:
  - _infra/scripts/outside_reader.py
```

# outside-reader — a reader with no fleet context, before anything public ships

## WHAT IT IS

Tyler, 2026-10-31: *"Why is there a YouTube link on my website? Things like this, want you to run thorough research
so we don't need people like boogs to catch this for us."* That week four things reached the public and a human caught
every one: a `youtube.com/@TylerYouk` link to an empty channel on tyleryouk.com, "26 seconds apart" where the measured
launches were 5–11 s apart, docs that "read like AI" (Boogs), and an email to a guessed address. knowledge#10854.

The fleet's own reviewers all share the writer's context, so they miss exactly what an outsider sees. This is one
script, `_infra/scripts/outside_reader.py`, with two halves:

- **The link probe** (no model). Every link on the rendered page, or in the text, is fetched. A 4xx/5xx, a dead host,
  a private or missing GitHub repo, an internal host (tailnet, localhost, a `*.vercel.app` preview) or **a YouTube
  channel that answers 200 but lists no videos** is a blocking finding. The target's title and opening text go to
  the reader.
- **The reader.** A `claude -p` run from an empty temp directory with `--setting-sources ""`, a replaced system prompt
  and `--tools ""`: no CLAUDE.md, no memory, no doctrine, no hooks. It reads as the named audience (a hiring manager,
  a senior engineer, a founder) and grades four criteria: links · every number and claim against the source facts
  (`net/work/resume/tyler-youk.yaml` and the public dispatch-runtime README) · AI tone and anything Tyler would wince
  at · anything added that was not asked for (the PR body and the issues it names). Each finding is `block` or `note`.

It uses the calling unix user's own Claude login (flat subscription). Measured 2026-10-31: about 35 s a page, and 121
pages six at a time on one subscription with no errors.

## WHERE IT RUNS

| path | how | what a block does |
|---|---|---|
| a PR to `utopia-models/tyleryouk-site` or `utopia-models/docs` | each repo's `.github/workflows/outside-reader.yml`, on Vercel's preview `deployment_status`: fetches the script from this repo and runs `pr --post` | posts the review on the PR (one comment, edited in place) and sets the `outside-reader` commit status to `failure` |
| any `gh pr merge` on those repos | fleet-doctrine `pretooluse-outside-reader-hold.sh` (0.107.0+) runs `outside_reader.py hold` | denies the merge unless the head SHA's `outside-reader` status is `success` (or the PR renders nothing) |
| herald (X) | `herald.py outside_read()` | an auto-reply becomes a draft for Tyler's OK; every post draft Tyler is texted carries the verdict |
| atlas (email, SMS) | `atlas.py send_mail` / `relations.send_sms` | the message is not sent; Tyler gets the draft and the findings |
| scout-outreach (cold email) | `sender.send_drafted` | the draft stays in Drafts, the reason on the row's `draft_note` |

**The PR hold is a ratchet.** A blocking finding holds the merge when its quote sits in text the PR added, or
when the link probe found it (a broken link blocks whoever wrote it). A finding in text the PR did not touch is
posted under "Pre-existing" and does not hold. The live-site sweep (`review --url`) grades that older text. Measured
2026-10-31 on docs#10: three passes over the same 19 pages raised 43, then 37, then 25 blocks, mostly in prose the PR
never changed. Holding a fix for them kept the wrong claims live.

Branch protection 403s on this plan tier, so the commit status binds nothing by itself. The hook is the hold on the
path that actually merges. A human merging in the web UI is not held. Tyler is the only human, and he is also the
waiver.

**Waiver.** Tyler has no GitHub account. When he says a finding is fine, the agent he told runs
`outside_reader.py waive --repo R --pr N --quote "<his words>"`, which comments his words on the PR and sets the
status to `success`. For herald, his `p<N> ok` on a draft he was shown the verdict for is the waiver.

## DETERMINE CURRENT STATE

```
python3 _infra/scripts/outside_reader.py review --url https://tyleryouk.com/        # exit 0 clear · 1 blocking · 3 could not check
python3 _infra/scripts/outside_reader.py hold --repo utopia-models/docs --pr <n>; echo $?   # 0 mergeable · 2 held
gh api repos/utopia-models/docs/commits/<sha>/statuses --jq '.[]|select(.context=="outside-reader")|.state'
bash _infra/scripts/mechanism-liveness.sh pretooluse-outside-reader-hold.sh
```

## KNOWN LIMITS

- **Exit 3 is never 0.** A page that could not be fetched, or a reader that failed, is "could not check". The PR
  status goes to `error` and the send paths hold, because an unmeasured surface is not a clean one.
- **`unverifiable` links** (LinkedIn's 999, x.com's 200 for every handle, `mailto:`) are passed to the reader as
  unverifiable and never blocked by the probe alone.
- **The reader is a model.** It can raise a false block. The waiver exists for that, and the review's quote, problem
  and fix columns make a false one quick to see.
- The mirrored `docs/source/` pages are internal doctrine written for agents. Their tone findings are #10852's
  (unslop), not this component's.
