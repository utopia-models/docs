# Vercel Deploy-Author Requirement — docs-wiki MUST deploy as the fleet App

**Measured 2026-08-17 (knowledge#6260). Two consecutive dispatched runs (#6242, #6243) independently hit
the same blocked deployment and neither recorded it. This rule is the durable fix.**

## THE PROBLEM

Vercel's `COMMIT_AUTHOR_REQUIRED` / `TEAM_ACCESS_REQUIRED` seat-block mechanism checks the **commit author
email** of the deployment, resolves it to a GitHub account, and verifies that account holds a Vercel team seat.

**Exactly one fleet GitHub account is seated:** `utopia-models-fleet[bot]` (the GitHub App), which is linked
to Vercel team `utopia-436cfb73`. All other fleet accounts (`kxagent2/3/4`, `kxagentbase`, `kxagent5` (dust), etc.)
are **unseated** and their commits result in `BLOCKED` deployments.

## HOW A BLOCKED DEPLOYMENT MANIFESTS

When a dispatched master merges a PR using its own PAT (not the App token):

```
$ curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v6/deployments?projectId=prj_1rxHmBWTNRXgITkJtValFgrkpbJG&teamId=team_gq5tNzvoKbKNK0pyDJtAqqUU&limit=3"
14:44:42Z BLOCKED production 66247504  docs-wiki-44to2nekn-utopia-436cfb73.vercel.app
meta.githubCommitAuthorEmail = 300199989+kxagent4@users.noreply.github.com
readyState = BLOCKED
```

The public wiki (`https://docs.utopiamodels.ai`) continues serving the **previous build**, even though:
- The PR is merged on GitHub
- The issue is closed
- The board moves
- No error is visible anywhere except in the Vercel deployment logs

## THE FIX — MERGE AS THE APP

**Dispatched masters already use the App token automatically.** The runner (`task-runner.sh` in
`utopia-models/knowledge`) exports the fleet App installation token before the dispatched run begins:

```bash
# From task-runner.sh lines 1437-1455
_FLEET_TOK="$(bash "$HOME/.claude/scripts/gh-app-token.sh" 2>&1)"
if [ -z "$_FLEET_TOK" ]; then
  echo "ERROR: gh-app-token.sh produced no output - cannot merge securely" >&2
  RESULT="gh-app-token.sh failed (no output)"; exit 1
fi
if [ "${_FLEET_TOK:0:4}" != "ghs_" ]; then
  echo "ERROR: gh-app-token.sh produced invalid token" >&2
  RESULT="gh-app-token.sh failed (invalid token)"; exit 1
fi
export GH_TOKEN="$_FLEET_TOK" GITHUB_TOKEN="$_FLEET_TOK"
```

When `GH_TOKEN` is set to the App token, `gh pr merge` authors the merge commit as
`utopia-models-fleet[bot]`, which **always deploys READY**.

## VERIFIED BEHAVIOR

| author | readyState | notes |
|---|---|---|
| `utopia-models-fleet[bot]` | **READY** | PR #9 (commit 8651a50) deployed immediately |
| `kxagent4@users.noreply.github.com` | **BLOCKED** | PR #11 (commit 6624750) required manual CLI recovery |

## FOR MANUAL MERGES (DO NOT DO THIS)

**Never merge a docs-wiki PR outside of a dispatched run.** The App token setup exists only in the runner.
If you merge via:
- GitHub UI → authored by your account → BLOCKED
- Local `gh pr merge` with your own PAT → authored by your account → BLOCKED
- `env -u GH_TOKEN gh pr merge` → uses your default PAT → BLOCKED

**The correct path:** Let the dispatched run handle the merge. The runner arms `GH_TOKEN` as the App token
before the run begins, so the master's merge is automatically authored correctly.

## IF YOU SEE A BLOCKED DEPLOYMENT

Recovery is documented in knowledge#6260 for the next run that hits this:

```bash
VT=$(bash ~/.claude/scripts/infisical-get.sh fleet-infra <the Vercel token key named in credential-registry.yaml> prod)
cd <a worktree whose tree equals origin/main>
npx --yes vercel link --yes --project docs-wiki --token "$VT" --scope utopia-436cfb73
rm -f .env.local
npx --yes vercel deploy --prod --yes --token "$VT" --scope utopia-436cfb73 --archive=tgz
git checkout -- .gitignore && rm -rf .vercel .env.local
```

But the real fix is to prevent it in the first place: **use the App token, always.**

## Composes with
`utopia-models/knowledge/_infra/scripts/task-runner.sh` (the App token export) ·
`utopia-models/utopia/.claude/rules/vercel-git-author.md` (the utopia repo's pre-push hook approach).

*Established 2026-08-17 from two independent blocked deployments (knowledge#6242, knowledge#6243). The
dispatched runner's App token export is the canonical fix; this rule exists so masters understand WHY it
exists and WHAT happens when it's bypassed.*
