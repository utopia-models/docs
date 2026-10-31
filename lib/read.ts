/**
 * The one shape every request-time knowledge-base reader returns.
 *
 * A generated block must never render a value it did not get. So a read either succeeds and carries
 * its value, or it fails and carries WHY — and the compiler will not let a caller print a payload it
 * never received. This mirrors `apps/web/lib/occ-read.ts` in the OCC, which is the fleet's one
 * measured non-drifting surface and the pattern this page copies.
 *
 * There is deliberately no cache and no stale-on-error arm. The OCC caches because dozens of routes
 * poll the same files on every request; a stale value here would defeat the only property a generated
 * block has.
 */
export type Read<T> = { ok: true; value: T; readAt: string } | { ok: false; error: string; readAt: string };

export const readOk = <T>(value: T): Read<T> => ({ ok: true, value, readAt: new Date().toISOString() });
export const readFail = <T>(error: string): Read<T> => ({
  ok: false,
  error,
  readAt: new Date().toISOString(),
});

/** Turn anything thrown by `fetch` into a reason a reader can act on. */
export function describeThrow(e: unknown): string {
  if (e instanceof Error) {
    // AbortSignal.timeout() rejects with a TimeoutError; undici wraps DNS/TLS in `cause`.
    const cause = (e as { cause?: { code?: string; message?: string } }).cause;
    if (cause?.code === 'ENOTFOUND' || cause?.code === 'EAI_AGAIN') return `DNS: no answer (${cause.code})`;
    if (cause?.code) return cause.code;
    if (e.name === 'TimeoutError') return 'timed out';
    return `${e.name}: ${e.message}`;
  }
  return String(e);
}
