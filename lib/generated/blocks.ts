/**
 * The site's GENERATED CORE — every fact on a written page that is read from the knowledge base at
 * request time instead of being typed into the page.
 *
 * WHY THIS EXISTS. On 2026-08-22, three days after these pages were last touched, 17 of their 162
 * checkable claims were false — and every one of them was a VOLATILE fact that had been WRITTEN down:
 * a uid, a line count, a unit name, a flag default. The page with zero false claims (`work.mdx`) is
 * made of method; the page with one ships its own check. That is not a coincidence, it is the
 * diagnosis, and pattern 13 is the rule it produces: **generate the volatile, write the durable.**
 *
 * THE BOUNDARY, restated so a later edit does not blur it:
 *   VOLATILE — changes without a human deciding it (a unix account, a uid, a lane list, a flag
 *              default, a unit-name template). It is GENERATED here and never typed into an `.mdx`.
 *   DURABLE  — someone chose it (a decision, the bet, a method, a convention). It stays WRITTEN, and
 *              nothing in this file may generate it. `decisions.mdx`, `work.mdx` and the five meta
 *              prompts on the index are the written face; the generated core goes BENEATH them.
 *
 * THE THREE PROPERTIES every block below holds:
 *   1. REQUEST-TIME, NO STORE. Nothing here caches, snapshots or revalidates. Two fetches do the
 *      work twice — the negative property that is the reason it does not drift.
 *   2. IT NAMES ITS SOURCE. Every block renders the KB paths it read, and the ref it read them at,
 *      on the page itself. A generated fact whose provenance is invisible is just a faster rumour.
 *   3. IT FAILS LOUDLY, NEVER QUIETLY. A block that cannot read its source renders the reason. It
 *      never falls back to a remembered value, because a remembered value is the defect.
 *
 * ONE COLLECTOR, TWO RENDERERS. `load()` returns data;
 * `components/generated.tsx` renders it as JSX and `lib/generated/markdown.ts` renders the same
 * object as markdown for the `.md` twins. There is no second code path that could disagree.
 */
import { parse } from 'yaml';
import { KNOWLEDGE_REF, readRepoFile } from '@/lib/knowledge';

export const REGISTRY_ORG = 'wi/registry/organization.yaml';
export const REGISTRY_COMPONENTS = 'wi/registry/components.yaml';
export const SWEEP_DISPATCH = '_infra/scripts/sweep-dispatch.sh';
export const DISPATCH = '_infra/scripts/dispatch.sh';
export const TASK_RUNNER = '_infra/scripts/task-runner.sh';

/** One knowledge-base file, and what this block takes out of it. Rendered on the page. */
export interface Source {
  path: string;
  what: string;
}

export type Body =
  | { kind: 'table'; head: string[]; rows: string[][]; note?: string }
  | { kind: 'code'; lang: string; lines: string[]; note?: string }
  | { kind: 'text'; lines: string[] };

export interface BlockResult {
  id: string;
  title: string;
  sources: Source[];
  ref: string;
  readAt: string;
  /** Present iff the read succeeded. A failure renders `error` and NOTHING else. */
  body: Body | null;
  error: string | null;
}

interface Block {
  title: string;
  sources: Source[];
  load(): Promise<Body>;
}

/* ── helpers ─────────────────────────────────────────────────────────────────────────────────── */

/** Read a tracked file or throw the reason — `load()` failures are caught once, in `runBlock`. */
async function must(path: string): Promise<string> {
  const r = await readRepoFile(path);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

/**
 * Pull a shell assignment out of a script by name: `MASTERS="win nova cloud dust"` → the RHS,
 * verbatim, quotes stripped. Anchored to the line start so a mention in a comment cannot match — the
 * fleet has shipped that bug (a substring convention cannot tell a declaration from a quotation).
 */
function shellAssign(text: string, name: string): { line: string; value: string } {
  const re = new RegExp(`^${name}=(.*)$`, 'm');
  const m = re.exec(text);
  if (!m) throw new Error(`no line starting \`${name}=\` in the script`);
  const raw = m[1].replace(/\s+#.*$/, '').trim();
  return { line: `${name}=${raw}`, value: raw.replace(/^["']|["']$/g, '') };
}

const dashIfEmpty = (s: string | undefined | null) => (s && String(s).trim() ? String(s).trim() : '—');

/* ── the blocks ──────────────────────────────────────────────────────────────────────────────── */

interface RegistryAgent {
  class?: string;
  role?: string;
  github_account?: string;
  location?: { machine?: string; user?: string; filepath?: string };
  claude_subscription?: unknown;
}

interface ComponentRow {
  id?: string;
  layer?: string;
  where?: string;
  what_it_does?: string;
}

/**
 * The unix account is derived, never assumed from the agent's NAME. That distinction is the single
 * highest-value defect this whole phase exists to kill: the DMV-portfolio master used to be called
 * `dmv` in this site's prose, while its unix account, its board lane and its registry id are all
 * `dust` (its GitHub identity is `kxagent5`) — so every `sudo -u dmv` command this site used to
 * publish failed for every reader who copied it.
 */
function unixUserOf(a: RegistryAgent): string {
  if (a.location?.user) return a.location.user;
  const fp = a.location?.filepath ?? '';
  const m = /^\/home\/([^/]+)\//.exec(fp);
  return m ? m[1] : '—';
}

/** `novaserver · unix user \`dust\` (uid 1001)` → `1001`. Absent is `—`, never a guess. */
function uidFromWhere(where: string | undefined, user: string): string {
  if (!where) return '—';
  const m = new RegExp(`unix user \`?${user}\`? \\(uid (\\d+)\\)`).exec(where);
  return m ? m[1] : '—';
}

/**
 * The provider an agent's runtime authenticates against, read from its registry record.
 *
 * There is exactly ONE as of 2026-08-23 (knowledge#6723): every agent runs the Claude Code harness on a
 * Claude subscription, `dispatch.sh` passes a literal `TASK_BACKEND=claude`, and the resolver that used
 * to choose between providers is deleted. This function stays a function of the RECORD rather than a
 * hardcoded `'Claude'` — an agent with no subscription block is still `—`, honestly, and that is a state
 * the registry can reach (a record filed before its seat exists).
 */
function backendOf(a: RegistryAgent): string {
  return a.claude_subscription ? 'Claude' : '—';
}

const BLOCKS: Record<string, Block> = {
  /* ---------------------------------------------------------------------------------------- */
  'fleet-accounts': {
    title: 'The unix accounts that run agents',
    sources: [
      {
        path: REGISTRY_ORG,
        what: 'every `agents:` record — its class, its box, its unix account, its GitHub identity, and whether it carries a subscription block at all',
      },
      { path: REGISTRY_COMPONENTS, what: 'the `uid` inside each runtime component’s `where:` line' },
    ],
    async load(): Promise<Body> {
      const [orgRaw, compRaw] = await Promise.all([must(REGISTRY_ORG), must(REGISTRY_COMPONENTS)]);
      const org = parse(orgRaw) as { agents?: Record<string, RegistryAgent> };
      const comp = parse(compRaw) as { components?: ComponentRow[] };
      const agents = org?.agents ?? {};
      const components = comp?.components ?? [];

      const wheres = components.map((c) => c.where ?? '').filter(Boolean);
      const rows: string[][] = [];
      for (const [id, a] of Object.entries(agents)) {
        const cls = a.class ?? '';
        if (cls === 'human') continue;
        const user = unixUserOf(a);
        if (user === '—') continue; // an agent with no account on any box is not on this table
        const where = wheres.find((w) => new RegExp(`unix user \`?${user}\`?`).test(w));
        rows.push([
          `\`${user}\``,
          dashIfEmpty(a.location?.machine),
          uidFromWhere(where, user),
          a.github_account ? `\`${a.github_account}\`` : '—',
          backendOf(a),
          dashIfEmpty(cls),
          id === user ? '—' : `\`${id}\``,
        ]);
      }
      rows.sort((x, y) => x[0].localeCompare(y[0]));
      return {
        kind: 'table',
        head: ['unix account', 'box', 'uid', 'GitHub identity', 'backend', 'registry class', 'known as'],
        rows,
        note:
          'The **unix account** is the name `sudo -u` takes. The **known as** column is filled only where the fleet calls an agent something its account is not — that mismatch is exactly what made every `sudo -u dmv` runbook command on this site fail. **`backend` reads `claude_subscription` off the record, and there is only one value it can take**: the fleet is 100% Claude Code on Claude subscriptions, and `' +
          DISPATCH +
          '` passes a literal `TASK_BACKEND=claude` with nothing to resolve. A `—` means that record carries no subscription block, not that it runs on something else.',
      };
    },
  },

  /* ---------------------------------------------------------------------------------------- */
  'dispatch-lanes': {
    title: 'The lanes the scheduler will route work to',
    sources: [
      {
        path: SWEEP_DISPATCH,
        what: 'the `MASTERS=` assignment — the scheduler rejects any Todo issue whose Lane is not in this set',
      },
      { path: REGISTRY_ORG, what: 'the agent records those lane names resolve to' },
    ],
    async load(): Promise<Body> {
      const [sweepRaw, orgRaw] = await Promise.all([must(SWEEP_DISPATCH), must(REGISTRY_ORG)]);
      const { line, value } = shellAssign(sweepRaw, 'MASTERS');
      const masters = value.split(/\s+/).filter(Boolean);
      const org = parse(orgRaw) as { agents?: Record<string, RegistryAgent> };
      const agents = org?.agents ?? {};

      const onBox = Object.entries(agents)
        .filter(([, a]) => (a.class ?? '') !== 'human' && unixUserOf(a) !== '—')
        .map(([id, a]) => ({ id, user: unixUserOf(a), cls: a.class ?? '' }));
      const notRouted = onBox.filter((x) => !masters.includes(x.user) && !masters.includes(x.id));
      const named = (x: { id: string; user: string; cls: string }) =>
        x.id === x.user ? `\`${x.id}\` (${x.cls})` : `\`${x.id}\`, account \`${x.user}\` (${x.cls})`;

      return {
        kind: 'text',
        lines: [
          `The scheduler routes to **${masters.length}** lanes: ${masters.map((m) => `\`${m}\``).join(' · ')} — read from \`${line}\`.`,
          '',
          `Accounts that exist on a box and are **not** in that set: ${
            notRouted.length ? notRouted.map(named).join(' · ') : 'none'
          }. An account is not a lane: an issue on a lane no master serves is structurally undispatchable however idle the fleet is.`,
        ],
      };
    },
  },

  /* ---------------------------------------------------------------------------------------- */
  'run-unit-name': {
    title: 'How a run’s transient unit is named',
    sources: [{ path: DISPATCH, what: 'every `UNIT=` assignment that names the transient systemd unit' }],
    async load(): Promise<Body> {
      const raw = await must(DISPATCH);
      // `dispatch.sh` assigns UNIT inside an if/else (knowledge#6960 made the default name carry no
      // entropy; only DISPATCH_ALLOW_DUPLICATE=1 restores a suffix), so the assignments are indented and
      // there is more than one. Every one is shown, in file order, with the line of the branch above it.
      const lines = raw.split('\n');
      const shown: string[] = [];
      lines.forEach((l, i) => {
        if (!/^\s*UNIT=/.test(l)) return;
        const guard = [...lines.slice(0, i)].reverse().find((x) => /^\s*(if|elif|else)\b/.test(x));
        if (guard) shown.push(guard.trim());
        shown.push(l.replace(/\s+#.*$/, ''));
      });
      const assigns = shown.filter((l) => /^\s*UNIT=/.test(l));
      if (assigns.length === 0) throw new Error('no `UNIT=` assignment in the script');
      if (shown.some((l) => /^(if|elif|else)\b/.test(l))) shown.push('fi');
      const plain = assigns[assigns.length - 1].trim().replace(/^UNIT="?|"?$/g, '');
      return {
        kind: 'code',
        lang: 'bash',
        lines: shown,
        note:
          assigns.length > 1
            ? `An ordinary run’s unit is \`${plain}\` — the last assignment above, and the one to search for. The longer form exists only behind its own flag. A unit name guessed from a process id or a timestamp will never match an ordinary run.`
            : `A run’s unit is \`${plain}\`. A unit name guessed from a process id or a timestamp will never match a run.`,
      };
    },
  },

  /* ---------------------------------------------------------------------------------------- */
  'run-turn-cap': {
    title: 'The turn cap a dispatched run is given',
    sources: [{ path: TASK_RUNNER, what: 'the `MAXT=` assignment passed to `claude -p --max-turns`' }],
    async load(): Promise<Body> {
      const raw = await must(TASK_RUNNER);
      const { line, value } = shellAssign(raw, 'MAXT');
      const m = /^\$\{([A-Z_]+):-(.+)\}$/.exec(value);
      return {
        kind: 'code',
        lang: 'bash',
        lines: [line],
        note: m
          ? `The cap is a **default of ${m[2]}, not a fixed number** — any caller may raise or lower it by exporting \`${m[1]}\`, and \`${DISPATCH}\` does exactly that when it launches the unit. A run that consumed all its turns reports the cap it actually ran under, which is why the number in a failure message is evidence and the number on this page is not.`
          : `The cap is the literal \`${value}\`, with no environment override.`,
      };
    },
  },

  /* ---------------------------------------------------------------------------------------- */
  'crontab-probe': {
    title: 'The second scheduler, per account',
    sources: [
      { path: SWEEP_DISPATCH, what: 'the `MASTERS=` assignment — the accounts to probe' },
      { path: REGISTRY_ORG, what: 'each lane’s unix account' },
    ],
    async load(): Promise<Body> {
      const [sweepRaw, orgRaw] = await Promise.all([must(SWEEP_DISPATCH), must(REGISTRY_ORG)]);
      const { value } = shellAssign(sweepRaw, 'MASTERS');
      const org = parse(orgRaw) as { agents?: Record<string, RegistryAgent> };
      const agents = org?.agents ?? {};
      const users = value
        .split(/\s+/)
        .filter(Boolean)
        .map((lane) => {
          const rec = agents[lane];
          return rec ? unixUserOf(rec) : lane;
        });
      return {
        kind: 'code',
        lang: 'bash',
        lines: ['# on novaserver — the other scheduler, for every account the fleet dispatches to', ...users.map((u) => `sudo -u ${u} -H crontab -l`)],
      };
    },
  },
};

export const BLOCK_IDS = Object.keys(BLOCKS);

/** Every block, run. One failure never takes the page down — it renders as that block's reason. */
export async function runBlock(id: string): Promise<BlockResult> {
  const readAt = new Date().toISOString();
  const block = BLOCKS[id];
  if (!block) {
    return {
      id,
      title: id,
      sources: [],
      ref: KNOWLEDGE_REF,
      readAt,
      body: null,
      error: `no generated block is registered under the id "${id}" — the registry is lib/generated/blocks.ts, which holds ${BLOCK_IDS.join(', ')}`,
    };
  }
  const base = { id, title: block.title, sources: block.sources, ref: KNOWLEDGE_REF, readAt };
  try {
    return { ...base, body: await block.load(), error: null };
  } catch (e) {
    return { ...base, body: null, error: e instanceof Error ? e.message : String(e) };
  }
}
