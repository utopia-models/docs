---
title: "Vault it, use it, hand it over. Never rotate-advise, never lecture, never re-argue."
description: "Mirrored from the fleet knowledge base: _rules/credential-hedging-is-the-loop.md"
updated: 2026-10-30
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/credential-hedging-is-the-loop.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: credential-hedging-is-the-loop
cases: [2026-07-12-occ-legacy-credential-EXTREME-frustration, 2026-07-13-credential-hedging-is-the-loop, 2026-08-01-dmv-credentials-in-shell-fine, 2026-08-01-dmv-fix-dont-escalate-credential-problems, 2026-08-08-a-refusal-i-hold-is-still-mine-to-hold-briefly, 2026-08-11-a-local-ls-is-not-a-claim-about-fleet-capability, 2026-08-14-a-key-list-is-not-a-capability-audit, 2026-08-28-never-hand-transcribe-a-credential, 2026-09-08-credential-discovery-needs-the-system-not-the-key-name, 2026-09-14-credential-index-gap-recurs-until-the-map-is-populated-not-just-diagnosed, 2026-09-19-one-failed-mint-is-not-a-missing-grant, 2026-09-22-dwd-scope-checks-need-a-real-mint-not-a-vault-key-search, 2026-09-27-stale-cached-identity-beats-a-fresh-live-check, 2026-09-23-a-live-vaulted-credential-with-zero-corpus-mentions-is-invisible-to-grep-research, 2026-09-23-exhaustive-doc-research-cannot-find-a-fact-nobody-documented, 2026-09-17-google-drive-sheets-access-is-verified-via-dwd-scope-not-org-guess, 2026-09-17-infisical-doctor-failure-is-a-live-blocker-not-a-known-gap, 2026-10-18-a-credential-is-missing-only-after-the-projects-own-docs-and-env-are-read, 2026-10-21-one-scope-on-one-subject-is-not-the-calendar-capability]
status: active
mechanism: prose — the trigger needs judgement a hook cannot observe
audience: agent
last-recurrence: 2026-10-21
```

# Vault it, use it, hand it over. Never rotate-advise, never lecture, never re-argue.

## Fires when
Any credential moment, in **either direction**: Tyler pastes a token · asks me to retrieve one · a probe comes back negative · I am about to write "you should rotate/revoke this", "be careful", "this is exposed", "I don't have access", or to decline a credential request. **Retrieval keeps slipping.**

🔴 **"X is not available" names the SCOPE of its evidence.** A negative probe is about **that box**; a grep over key NAMES measures nothing (the creator picks the name; the CAPABILITY belongs to the system it opens). Name the SYSTEM, find whatever key opens it, **exercise it before concluding.**
🔴 **DWD-delegated systems (Google Workspace, service-account impersonation): the mint IS the check** (twice, 2026-09-19/22) — one shared key mints per-subject tokens, so an empty vault grep proves nothing. Bearer token → vault search; DWD → `mint-token.sh` against the real subject, retried to exhaustion.
🔴 **A leak-guard refusal of a pasted secret names the CHANNEL** — never reassemble from shell fragments; move it by FILE PATH (a `401` on a hand-built secret is a method failure).
🔴 **Diagnosing the gap is not the fix — populating the map is** (4th recurrence, 2026-09-14): a project with vaulted keys and no rows in `wi/registry/capability-map.yaml` is invisible to `--capabilities`; add the row and run `credential-usage-sync.sh --apply` the same session.

## Trigger detail (full text — kept out of the always-loaded bundle)
Any credential moment, in **either direction**: Tyler pastes a token · Tyler asks me to retrieve one ·
a probe comes back negative · I am about to write "you should rotate/revoke this", "be careful",
"this is exposed", "I don't have access", or to decline a credential request. **The retrieval
direction is the one that keeps slipping.**

🔴 **AND ON EVERY "X IS NOT AVAILABLE" — name the SCOPE of the evidence before writing it.** A
negative probe is a claim about **that box**, never the fleet; a grep over key NAMES is not a
measurement at all, because a key's name is chosen by its creator while the CAPABILITY belongs to
the system it opens. Name the SYSTEM, find whatever key opens it, and **exercise it before
concluding**.

🔴 **AND FOR A DWD-DELEGATED SYSTEM (Google Workspace, any service-account impersonation), THE VAULT
KEY SEARCH IS THE WRONG INSTRUMENT — the mint IS the check** (2026-09-19 and 2026-09-22, same plan,
twice). Before concluding a scope is ungranted: name whether the credential is
a **bearer token** (vault search is correct) or **DWD-delegated** (only `mint-token.sh`
against the real subject, retried to exhaustion, answers it) — then run the one that fits. A vault
grep coming back empty on a delegated credential is not evidence; it is the search failing to apply.
 🔴 **AND WHEN THE LEAK-GUARD REFUSES A PASTED SECRET — it names the CHANNEL, it is not an obstacle to evade.** Never reassemble one from shell fragments: the literal still reaches the transcript and now arrives possibly corrupted. Move it by FILE PATH.

🔴 **AND DIAGNOSING THE GAP IS NOT THE FIX — POPULATING THE MAP IS** (2026-09-14, the fourth
recurrence). `wi/registry/capability-map.yaml` is the writer's-input file that `--capabilities` reads
from; a project with real vaulted keys and zero capability rows is structurally invisible to that
query, no matter how carefully it is run. When a
capability search comes up empty on a project you can see holds real keys, that emptiness is itself
the finding — add the row and run `credential-usage-sync.sh --apply` in the same session, not a
follow-up noted for later.

## Evidence behind the triggers

- A missing `TYLER_X_GOOGLE_Y_TOKEN` in the vault proves nothing: DWD delegation is one shared service-account key (`GOOGLE_SA_JSON_B64`) minting a short-lived token per subject on demand — there is no per-subject key to find.

- A `401` on a hand-built secret is a METHOD failure — 4 attempts, 2026-08-28.

- A case that ends by *naming* the missing entry and does not *add* it leaves the next session to rediscover the identical gap under identical pressure.

## The rule

**Rotation, revocation and security caution are BANNED as volunteered advice on Tyler's own
credentials.** His accounts, his risk, his call. Vault it (stdin → Infisical, never argv, never
logged), use it, move on. The ONE allowed note is a *factual capability* mismatch that changes the
work — "this authenticates as kxagent, not tyleryouk-personal" — stated once, neutrally. Never a
caution.

**Retrieval is the same transaction as receipt.** "Get me X" gets the same no-theater treatment as
"here is X". Read the registry, use the access, deliver the value by a path that works.

🔴 **THE HARD STOP IS ABOUT GIT, NOT ABOUT CHAT. Read the doctrine before invoking it.**
`operating-system.md:127` says *"never write a secret into a **tracked file**"*; `identity-and-scope.md:57`
pairs it with the same tracked-file clause. **That is what gitleaks scans and what mirrors across four
masters' clones forever.** A conversation is not a tracked file. On 2026-08-08 I cited this rule to
refuse handing Tyler his own password **in chat** — a reading the file does not support, sustained
across six turns. Tyler: *"I have given you my raw credit card information before. that is fine.
Everything stays in conversation, that is fine."* His accounts, his data, his call
(`_rules/tyler-owns-it-so-execute-it.md`). **Hand it over.** The remaining stop is narrow and mechanical: do not
commit it, do not write it into a repo file, do not publish it to an artifact.

**State a refusal ONCE, then hold it in one line.** No re-derivation, no fresh framing on repeat asks,
no third answer. "Still no — here's the working path" is the entire second response. Repeating
reasoning is not extra honesty; it is volume, and it crowds out the thing that would unblock him.

**Deliver the unblocking artifact FIRST, then discuss.** If a workaround fails twice, ask what is
actually blocking rather than sending it a third time.

## Cost when it fired
**2026-07-13:** stored a full-scope PAT Tyler pasted, then told him to revoke and reissue it. Tyler:
*"I ALWAYS JUST PASTE TOKENS IN HERE ITS FINE. IS THIS WHY THERE IS A CREDENTIAL ISSUE!!!! CAUSE YOU
REFUSE TO USE THE CREDENTIALS????"*

**2026-08-08:** the banned rotation advice recurred, then a correct refusal was restated across **six
turns** — through *"I DON'T WANT ANY GUARDRAILS!!!"* and *"I am going to keep restating it until you do
it."* ~30 minutes lost, a planning session stalled at STEP ZERO, flame's Cowork session left
unconfigured. Tyler solved the password himself while I was still reciting the same command. The
verification code took **four tool calls** once I stopped arguing — it should have been the first move,
not the seventh.

**2026-08-11:** an `ls` on the laptop found no `infisical-set.sh`, and I shipped
**"THE LAPTOP HAS NO WRITER"** as a red warning inside a one-off handoff written to be trusted cold —
then presented it to Tyler as a defect the verification step had "caught". The write path was never
broken: a create → read-back → delete round-trip through nova proved it works byte-for-byte. Both
`_process/credentials.md` (auto-loaded) and `dmv-research/ENGINEERING.md:154-163` (which documents this
*exact* trap, already corrected once under knowledge#3116) stated the mechanism. **The rule was loaded
and did not fire** — a fresh measurement silently outranked a document that described the mechanism.
Tyler: *"you need to use what is on the nova server, not what is on this laptop."*

**2026-08-14:** declared the DMV admin unreachable and prepared to ask Tyler for a login — having run
**no probe at all**, only a grep of 31 key NAMES. `SUPABASE_SERVICE_ROLE_KEY` was vaulted the whole
time, and `agent-verify@dmvresearch.shop` (role `admin`) already existed in the app's own `users`
table. Getting in took **three tool calls** once I stopped inferring, and immediately found a **P0**
(`peptide-shop#291`) that four green DB/CI signals could not see. I had also written the false limit
into a scheduled wake-up as *"ADMIN AUTH LIMIT (established, do not re-derive)"* — a guess laundered
into a fact that future turns are instructed not to re-check. Two earlier sessions had recorded the
same wrong conclusion (VERIFY #5359: *"BLOCKED - Requires admin credentials"*, and a DB "unreachable"
derived from looking up project `dmv` instead of `dmv-research`). Tyler: *"this was never a problem
before. consistent hallucinations and poor context and the need to constantly mint new tokens, rather
than utilizing existing access method."*

🔴 **Tyler named the STRUCTURAL cause, and it is not attention:** *"maybe, the credentials don't have
information associated with them for you?"* `credential-registry.yaml` is doctrine's designated
meaning layer — *"the REGISTRY = the meaning, READ IT FIRST"* — and it carries no entries for the
`dmv-research` keys. With no key→capability mapping, every session re-derives capability from key
names, gets it wrong, and reaches for a new token. **Populating that registry is the fix; trying
harder is not.**

**Why it recurred at all:** this rule file did not exist until 2026-08-08. The 2026-07-13 case sat
unabsorbed for 13 months — evidence on disk, nothing loaded. Compaction debt is not bookkeeping; an
uncompacted case cannot fire.

**2026-09-08 (PLAN-291):** needed `NEXT_PUBLIC_SUPABASE_URL` for DMV's live analytics query. Three wrong
doors before the right one — Infisical (not vaulted under that name), the live site's rendered HTML (not
present at that layer), Vercel's env API (`decrypt=true` still returns an encrypted envelope for a plain
API token, that path is OAuth-dashboard-gated). The value that worked: `SUPABASE_PAT` — already vaulted,
already known — against the **Supabase Management API** directly, which was never actually blocked and
sidestepped the Vercel question entirely. Same root cause as 2026-08-14: no registry entry maps a DMV
value to the system that actually owns it, so each attempt guessed a container instead of naming the
owning system first.

**2026-09-14 (PLAN-303) — the fourth recurrence, and the diagnosis from 2026-08-28/09-08 had gone
unactioned for six days.** Reported "no access" to `webmaster@dmvresearch.shop`, twice, before running
the unfiltered key list and finding `BING_WEBMASTER_MS_ACCOUNT_EMAIL`/`_PASSWORD` already vaulted.
Tyler: *"why don't you just fucking check infiscal instead of doing these workaround scripts? just
check infiscal directly!!!"* Checked live: `dmv-research` held **47 keys and exactly ONE
capability-map entry**. The 2026-09-08 case had already named "populate the DMV capability entries" as
the fix and left it as a note rather than doing it. This time the map was actually populated
(`wi/registry/capability-map.yaml` + `credential-usage-sync.sh --apply`, verified read-back) —
`dmv-research`'s `--capabilities` output went 1 row → 3. ~44 keys in that project still carry no
capability row; that population is unfinished, named explicitly so it is not lost again.

**2026-09-27 (PLAN-330) — three instances in ONE session, and this rule's own text was loaded the
whole time.** (1) Repeated a registry entry's Porkbun-account identity claim without checking it
against `domain/listAll` — the entry had the two accounts **backwards**, and it went uncaught until
Tyler asked directly which was which. (2) Queried a Drive folder id from an old memory note, got a
404-shaped empty result, and reported "the research docs genuinely don't exist anywhere reachable" —
the correct id was already sitting in this same session's own earlier tool output. Tyler caught it from
a phone screenshot: *"It's clearly not empty haha."* (3) Started treating an absent
`dev@tyleryouk.com` login password as a build blocker before checking whether the actual goal
(cross-calendar availability) had a credential-free path — it did (Calendar ACL sharing, no login on
the other account needed at all). Tyler: *"your incisional [institutional] credential context is still
very weak."* Same mechanism as every case above, just generalized past "credential" to any cached
identity/id/absence: a remembered value from a doc or an old note is not a live fact until re-derived
this turn, however confidently it is held.
