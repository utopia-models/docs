/**
 * `<Generated id="..." />` — the MDX tag that puts a generated fact inside a written page.
 *
 * A written page states a method and keeps it; a generated block states a value and re-reads it. This
 * component is the seam between the two, and it is deliberately loud about which side of the seam a
 * reader is on: every block carries the knowledge-base paths it was derived from, the ref it read
 * them at, and the instant it read them. A fact whose provenance is invisible is indistinguishable
 * from a fact someone typed in, which is the failure this phase repairs.
 *
 * It renders on the SERVER, at request time. Not a client fetch: `curl` must see the same value a
 * browser sees, because half this site's readers are agents that never run JavaScript.
 */
import { runBlock, type BlockResult } from '@/lib/generated/blocks';

const Provenance = ({ r }: { r: BlockResult }) => (
  <p className="text-xs text-fd-muted-foreground">
    <em>
      Generated at request time (<span className="font-mono">{r.readAt}</span>) from{' '}
      <span className="font-mono">utopia-models/knowledge</span> @{' '}
      <span className="font-mono">{r.ref}</span> —{' '}
      {r.sources.map((s, i) => (
        <span key={s.path}>
          {i > 0 ? '; ' : ''}
          <span className="font-mono">{s.path}</span> ({strip(s.what)})
        </span>
      ))}
      . Nothing here is stored: this page holds no copy of these values.
    </em>
  </p>
);

export async function Generated({ id }: { id: string }) {
  const r = await runBlock(id);

  if (r.error || !r.body) {
    return (
      <div>
        <p>
          <strong>GENERATED — {r.title}.</strong> This block could not be read and therefore renders
          nothing rather than a remembered value: <span className="font-mono">{r.error}</span>
        </p>
        <Provenance r={r} />
      </div>
    );
  }

  const b = r.body;
  return (
    <div>
      {b.kind === 'table' && (
        <table>
          <thead>
            <tr>
              {b.head.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, i) => (
                  <td key={i} className={i === 0 ? 'font-mono' : undefined}>
                    {cell.replace(/`/g, '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {b.kind === 'code' && (
        <pre>
          <code>{b.lines.join('\n')}</code>
        </pre>
      )}
      {b.kind === 'text' && b.lines.filter(Boolean).map((line, i) => <p key={i}>{strip(line)}</p>)}
      {'note' in b && b.note ? <p>{strip(b.note)}</p> : null}
      <Provenance r={r} />
    </div>
  );
}

/**
 * The block bodies are authored as markdown so the `.md` twin is the primary artifact and the HTML is
 * the derivative — the inverse of the usual arrangement, and the right way round for a site half of
 * whose readers fetch `/llms-full.txt`. Here the inline emphasis markers are dropped rather than
 * parsed: a second markdown renderer in the JSX path is a second thing that can disagree with the
 * twin, and the words carry the meaning without the asterisks.
 */
const strip = (s: string) => s.replace(/\*\*/g, '').replace(/`/g, '');
