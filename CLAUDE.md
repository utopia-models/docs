# docs-wiki — Utopia's public fleet documentation

**Built from PLAN-178 (knowledge#5880).** A Fumadocs-based wiki that documents the Utopia fleet as it
actually operates, styled as an exact rip of [ocp.wiki](https://ocp.wiki/docs). Fully public, no auth wall.

**Deployed at:** https://docs.utopiamodels.ai

**Repo:** utopia-models/docs-wiki

## Project structure

- `content/docs/` — Main wiki content (Architecture, Operations, Surfaces, Work, Decisions). Every page needs
  `updated: YYYY-MM-DD` in its frontmatter (the build refuses one without it) and an edit must bump it
  (`scripts/check-updated.sh`, a CI job on PRs) — knowledge#10739.
- `content/docs/source/` — **written by a pipeline, never by hand**: the allowlisted mirror of the private
  knowledge repo (`.github/workflows/docs-mirror.yml` there). Edit the file in knowledge, not here.
- `content/changelog/` — one `YYYY-MM-DD-<slug>.mdx` per change worth announcing; it is the only source of
  `/changelog`, `/feed.json` and `/feed.xml` (`lib/feed.ts`). An entry's slug is its permanent feed id.
- `app/` — Next.js app router
- `components/` — React components (theme toggle, copy controls, etc.)
- `lib/` — Utilities
- `proxy.ts` — the usage measurement; `scripts/usage.sh` queries the request log (README, "Usage")
- `.claude/rules/` — Agent behavioral rules

## Vocabulary — the 14 are **architectural patterns**

Decided by Tyler in `utopia-models/knowledge#6373`, rolled out under PLAN-211 P2 (knowledge#6551).
When this site names the fleet's structural choices **as a set**, the term is **architectural
patterns** — never *mechanisms*, *components*, *subsystems*, *Fleet Architecture* or *Fleet
Infrastructure*. Those fit the things that run and are wrong for the ones that only hold (decision
discipline, liveness-vs-existence), and the test the name has to pass is *adopt this / reject this*.

- The definition lives once, at the top of `content/docs/structure/architecture.mdx`, above anything that lists
  them. Do not restate it on another page — link to it.
- **The rule binds the SET only.** Ordinary prose keeps ordinary English: *"looking for a broken
  mechanism"* stays exactly as written, and nothing renames a component id.
- The canonical inventory is `wi/work/reference/architectural-patterns.md` in the
  knowledge repo. Adding or removing one is a decision record there, not an edit here.

## Icons — the Utopia Models mark, copied not recreated (#32)

`app/favicon.ico`, `app/icon.svg` and `app/apple-icon.png` are **byte-for-byte copies of
`apps/web/app/`'s in `utopia-models/utopia`** — the same three files `utopiamodels.ai` serves at
`/favicon.ico`, `/icon.svg` and `/apple-icon.png`. Tyler asked for *the same mark shown in the browser
tab at utopiamodels.ai*, so this site serves that asset rather than an interpretation of it.

They carry **no provenance comment**, and that is deliberate: an added comment breaks the byte-identity
that is this issue's own acceptance criterion. The note lives here instead.

- **The mark changes on the main site → re-copy it here.** It is not authored in this repo and must not
  be edited here. Two hand-maintained copies of one mark WILL drift (same lesson as
  `app/opengraph-image.tsx`, which is a copy for the same reason).
- **Re-copy:** `git -C <utopia> show origin/main:apps/web/app/icon.svg > app/icon.svg` (likewise
  `favicon.ico`, `apple-icon.png`).
- **Probe, live:** `for p in favicon.ico icon.svg apple-icon.png; do diff <(curl -sL
  https://utopiamodels.ai/$p) <(curl -sL https://docs.utopiamodels.ai/$p) >/dev/null && echo "$p same"
  || echo "$p DRIFTED"; done`

This replaced a placeholder `U`-tile icon drawn from the `solar` preset's own literals when the site had
no icon at all (knowledge#6550) — that was a stand-in, never a brand mark, and it is gone.

## Critical rule — Vercel deploy author requirement

**🔴 READ THIS BEFORE MERGING:** `.claude/rules/vercel-deploy-author.md`

This repo is deployed via Vercel, which requires the merge commit author to hold a team seat. Only the
fleet GitHub App (`utopia-models-fleet[bot]`) is seated. Merging with your own PAT results in a
**BLOCKED deployment** that the public never sees.

**How dispatched masters handle this:** The runner (`utopia-models/knowledge/_infra/scripts/task-runner.sh`)
automatically exports the fleet App token before the dispatched run begins, so all merges are authored
correctly. You don't need to do anything special—just follow the dispatched run's merge instructions.

**Never merge manually outside of a dispatched run.** The App token setup exists only in the runner.

## Development

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start
```

## Deployment

- **Preview:** Automatic on every push to a non-main branch
- **Production:** Automatic on every push to `main` (via Vercel Git integration)
- **Manual recovery:** See `.claude/rules/vercel-deploy-author.md` if a deployment is blocked

## Fleet integration

This repo is part of the Utopia fleet and integrates with:
- **OCC (Org Command Center):** Health and deployment status
- **task-runner.sh:** Automated dispatched runs with App token merge handling
- **Verification scripts:** LLM.txt, content validation, deployment checks

## Related repos

- `utopia-models/knowledge` — Fleet documentation and doctrine
- `utopia-models/utopia` — Main Utopia monorepo (OCC, apps/web)
- `utopia-models/dmvresearch` — DMV Research storefront
