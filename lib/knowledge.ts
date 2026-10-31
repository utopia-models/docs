/**
 * Request-time reads of `utopia-models/knowledge` — the fleet's source of truth.
 *
 * The repo is private, so this needs a token. The one it is given is deliberately the narrowest that
 * exists: `GITHUB_PAT_HEARTBEAT_TICKER` (Infisical `fleet-infra`), a FINE-GRAINED PAT whose grant is
 * `contents:read` on `utopia-models/knowledge` alone. It cannot read issues, cannot read the project
 * board, cannot write anything, and cannot see any other repository. A page that publishes fleet
 * internals to the open web should hold the least authority that can produce them.
 *
 * NOTHING here is cached and nothing is written. Every call is a fresh conditional-free GET, which is
 * what makes the page non-drifting — the same property the OCC has and the reason it is the one
 * source of fourteen that the 2026-08-16 ground-truth research found had not rotted.
 */
import { type Read, describeThrow, readFail, readOk } from './read';

const OWNER = 'utopia-models';
const REPO = 'knowledge';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

/**
 * Which ref of the knowledge repo every read below resolves against. `main` in production, and that
 * is the only value the deployed site has ever been given.
 *
 * It is settable so that DERIVATION IS TESTABLE. A generated value is indistinguishable from a
 * retyped one until you change the fact at its source and watch the page follow; pointing a local
 * render at a knowledge branch is how that is demonstrated without pushing a wrong fact to main.
 * Every generated block prints the ref it read beside the path it read, so a page served off a
 * non-default ref says so on its face rather than quietly disagreeing with the fleet.
 */
export const KNOWLEDGE_REF = process.env.KNOWLEDGE_REF || 'main';

const refQuery = (path: string) =>
  `${path}${path.includes('?') ? '&' : '?'}ref=${encodeURIComponent(KNOWLEDGE_REF)}`;

/** The env name this page reads. Never printed — only its presence is ever reported. */
export const TOKEN_ENV = 'KNOWLEDGE_READ_TOKEN';

export const knowledgeToken = (): string =>
  process.env.KNOWLEDGE_READ_TOKEN || process.env.OCC_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';

export const knowledgeConfigured = (): boolean => knowledgeToken().length > 0;

const NO_TOKEN = `no ${TOKEN_ENV} in this deployment's environment — the private knowledge repo cannot be read from here`;

async function gh(path: string, accept: string): Promise<Read<Response>> {
  const token = knowledgeToken();
  if (!token) return readFail(NO_TOKEN);
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: accept,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'docs.utopiamodels.ai',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return readFail(`GitHub ${res.status} ${res.statusText} on ${path}`);
    return readOk(res);
  } catch (e) {
    return readFail(`GitHub ${path}: ${describeThrow(e)}`);
  }
}

/** Raw bytes of a tracked file, at whatever `main` holds right now. */
export async function readRepoFile(path: string): Promise<Read<string>> {
  const res = await gh(refQuery(`/contents/${path}`), 'application/vnd.github.raw');
  if (!res.ok) return res;
  try {
    return readOk(await res.value.text());
  } catch (e) {
    return readFail(`reading ${path}: ${describeThrow(e)}`);
  }
}

export async function readRepoJson<T>(path: string): Promise<Read<T>> {
  const raw = await readRepoFile(path);
  if (!raw.ok) return raw;
  try {
    return readOk(JSON.parse(raw.value) as T);
  } catch (e) {
    return readFail(`parsing ${path}: ${describeThrow(e)}`);
  }
}

export interface Commit {
  sha: string;
  date: string;
  message: string;
  author: string;
}

/**
 * The newest commit touching `path`. For `_infra/occ-feeds/` this IS the publisher's heartbeat: the
 * timer commits every ten minutes, so the age of this commit answers "did the transport run", which
 * is a different question from "is the number current" (`occ-feeds.md` — conflating the two kept a
 * health dot green through a 13h54m outage).
 */
export async function lastCommitFor(path: string): Promise<Read<Commit>> {
  // The commits API names its ref `sha`, not `ref` — passing the wrong one is silently ignored and
  // would return main's history while the contents above came from a branch.
  const res = await gh(
    `/commits?path=${encodeURIComponent(path)}&per_page=1&sha=${encodeURIComponent(KNOWLEDGE_REF)}`,
    'application/vnd.github+json',
  );
  if (!res.ok) return res;
  try {
    const body = (await res.value.json()) as Array<{
      sha: string;
      commit: { message: string; committer: { date: string; name: string } };
    }>;
    const c = body[0];
    if (!c) return readFail(`no commit touches ${path}`);
    return readOk({
      sha: c.sha.slice(0, 9),
      date: c.commit.committer.date,
      message: c.commit.message.split('\n')[0],
      author: c.commit.committer.name,
    });
  } catch (e) {
    return readFail(`parsing commits for ${path}: ${describeThrow(e)}`);
  }
}
