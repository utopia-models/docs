# docs-wiki — `docs.utopiamodels.ai`

The Utopia fleet's public wiki. **Fully public, fully open — no auth, no gate.** That is a
load-bearing property, not an oversight: anyone should be able to `curl` any page and read it.

Built on **Fumadocs** (Next.js + Base UI + Shiki) and styled as an exact rip of
[ocp.wiki](https://ocp.wiki/docs) — see `app/global.css` for how that rip was measured and why
the whole theme reduces to `fumadocs-ui/css/solar.css`.

**PLAN-178.** Tracking issue: [utopia-models/knowledge#5878](https://github.com/utopia-models/knowledge/issues/5878).
The brief lives in the knowledge repo at
`wi/work/specs/178-docs-wiki/spec.md`.

## Status

| phase | what | state |
| --- | --- | --- |
| P1 | claim the domain + Fumadocs shell with ocp.wiki's theme | **shipped** |
| P2 | `llms.txt` + a `.md` twin of every page | **shipped** (Fumadocs' own `llms(source).index()`) |
| P3 | the content — the fleet as it actually is, by layer | **shipped** |
| P4 | `/live` — the generated health page | **shipped, then removed** 2026-09-28 (knowledge#8037) — `/feedback` with it |
| P5 | the three copy-paste meta prompts on the homepage | **shipped** — scope grew beyond the original three homepage prompts to cover all 14 non-root pages |

## Content rules (P3, knowledge#5882) — these are load-bearing

The six pages under `content/docs/` are written from the **measured substrate**
(`wi/work/research/plan-178-fleet-ground-truth.md` in the knowledge repo), never from
that repo's `reference/win/*.md` corpus — which was measured as describing a fleet that does not
exist. Where the two disagree, the substrate wins.

1. **Every command names its box.** `ssh nova@100.71.25.43 '<cmd>'`. The bare alias does not resolve
   and must never appear: `grep -rE 'ssh nova[^@]' content/` returns zero, and that is a criterion.
2. **Separate RETIRED-BY-DECISION from BROKEN from LIVE.** Every hostname on `/docs/structure/surfaces` carries
   an explicit class; a bare status code is never a state.
3. **Existence claims must be liveness claims.** `getent passwd <agent>` passes on a dead agent.
4. **Generate the volatile, write the durable.** No prose page states disk %, uptime, node liveness or
   an issue count as a current fact. Point-in-time measurements carry their date; a current value is
   either a generated block read at request time or the command that measures it.
5. **Publish everything, unsanitized** — real hostnames, tailnet IPs, usernames, credential mechanics.
   Do not add a scrub pass. The one hard stop is unchanged: **never a secret in a tracked file.**

`/` REWRITES to `/docs` — a `200` serving the docs index, not a redirect to it (changed 2026-09-04,
PLAN-281 P1). ocp.wiki sends a `307` there and this site did too until the un-retirement; the acceptance
that brought the host back asks for `200` at the root with no redirect in the chain, and a rewrite gives
that without a second page to maintain. The wiki's landing page IS the docs index, so there is no second
front page to drift against it — and it is where P5's three meta prompts go.

## Usage — who actually read it

Many readers are agents and crawlers, and those run no JavaScript. So usage is counted on the server.
This is the measurement `utopia-models/work-hub` runs, ported here (knowledge#8567).

| what | where | keeps |
| --- | --- | --- |
| a `read` event per page, `.md`/`llms` fetch or `/resume.pdf`, with `path` and `reader` (`<tag>\|<agent>`) | `proxy.ts` → Vercel Web Analytics, project `docs-wiki`, Events | the durable record |
| browser pageviews | `<Analytics />` in `app/layout.tsx` → the same dashboard | the durable record |
| every request, with its link tag, network and user-agent | `bash scripts/usage.sh [hours]` → Vercel's request log | about a day (run it with `168` and read the oldest row) |

**Link tags.** Any link to this site that is handed to a person carries `?r=<tag>` —
`https://docs.utopiamodels.ai/?r=resume`. The tag changes nothing about what is served; it is what lets
a read be attributed to where the link was given out. Lowercase letters, digits and hyphens, 32
characters at most; anything else counts as `untagged`. A tag is a label on a public URL, not a
credential — never put anything private in one. The tags in use are listed where the links are made:
`net/README.md` in utopia-models/knowledge, "Link tags".

**Probe, live:**

```bash
curl -s -o /dev/null "https://docs.utopiamodels.ai/llms.txt?r=probe"
sleep 60 && bash scripts/usage.sh 1     # the `probe` row appears, with curl's user-agent
```

## Develop

```bash
ssh cloud@100.71.25.43 'cd ~/dev/utopia-models/docs-wiki && pnpm install && pnpm dev'
```

Then open `http://localhost:3000`.

```bash
pnpm build         # production build
pnpm types:check   # next typegen && tsc --noEmit
```

## Deploy

Vercel project `docs-wiki` in the `utopia` team, git-linked to this repo's `main` branch.
`docs.utopiamodels.ai` is assigned to it; `*.utopiamodels.ai` already CNAMEs to Vercel, so no
DNS work is needed for further subdomains.

Liveness is checked by the registry row `site-docs-wiki` in
`utopia-models/knowledge` → `wi/registry/components.yaml`.
