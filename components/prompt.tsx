'use client';

import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Check, ChevronRight, Copy, Sparkles } from 'lucide-react';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { copyText } from '@/lib/clipboard';
import { ASK_TOKEN, expandAsk, HARNESSES, type Harness } from '@/lib/harness';

/*
 * The meta prompts: a harness toggle over collapsed blocks.
 *
 * Four properties here are load-bearing, and each is a decision rather than a style choice.
 *
 * 1. EACH PROMPT IS A TOP-LEVEL CODE FENCE IN THE MDX, TAGGED `title="prompt-N"`.
 *    `getLLMText()` emits *processed* markdown, and a fence nested inside a JSX element comes back
 *    out of that serializer INDENTED by its nesting depth — measured 2026-08-16: four leading
 *    spaces on all 47,000 characters, which puts a heredoc body inside prompts 3 and 5 at an
 *    indentation Python rejects. `/docs.md` and `/llms-full.txt` are the exact payload prompts 2-5
 *    tell a stranger's agent to fetch, so the fences stay at the top level and this file rebuilds
 *    the card around them from the `pre` override instead. `title` is used because it is one of the
 *    four attributes Fumadocs' default `parseMetaString` whitelists, so no MDX config changes.
 *
 * 2. THE TOGGLE AND THE BLOCKS ARE SIBLINGS, SO THE SHARED STATE IS A MODULE STORE.
 *    React context would need a common JSX ancestor, which is the nesting that (1) rules out.
 *
 * 3. COPY WORKS WHILE COLLAPSED. Copying is the primary action and reading is the optional one, so
 *    a control that required expanding first would have inverted them. The folded region is hidden
 *    with the `hidden` attribute, never unmounted, so the button reads the same DOM either way.
 *    Shiki emits one `.line` span per source line; joining those is what preserves newlines that a
 *    bare `textContent` would drop if the highlighter stopped emitting newline text nodes.
 *
 * 4. THE CHARACTER COUNT IS MEASURED FROM THE SAME DOM THE COPY BUTTON READS, after mount, rather
 *    than declared in a table beside it. A declared count is a second copy of a fact and drifts the
 *    first time a prompt is re-audited; this one cannot disagree with what you are about to paste.
 *
 * 5. `{{ASK}}` IN A FENCE BECOMES THE ACTIVE HARNESS'S REAL QUESTION TOOL, HERE, AT RENDER.
 *    A prompt that says "USE THE `AskUserQuestion` TOOL" is right under one tab and false under the
 *    other five, and it fails SILENTLY: the agent cannot call a tool it does not have, so it asks in
 *    prose, which carries no options and therefore no RECOMMENDED option. The fence writes the token
 *    once; `lib/harness.ts` holds what it expands to, per harness, each name read from that vendor's
 *    own source. Because the substitution happens in the rendered tree, the copy button and the
 *    character count — both of which read this DOM — cannot disagree with what is on screen.
 *    The `.md` twin has no selected harness and expands the same token to the lookup instead
 *    (`ASK_NEUTRAL`, applied in `lib/source.ts`), so neither representation of a page invents a
 *    harness for its reader.
 */

let harness: Harness = 'claude-code';
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setHarness(next: Harness) {
  harness = next;
  for (const listener of listeners) listener();
}

/*
 * A page fixed to one harness (every page but the root — `pageHarness`, knowledge#8025). The store
 * above is module state, so it SURVIVES client-side navigation: a reader who picked "Codex CLI" on
 * the root and then opened a module would otherwise see that module's `{{ASK}}` expanded to Codex's
 * tool and its `claude-code`-pinned cards hidden. The context wins over the store wherever it is set.
 */
const FixedHarnessContext = createContext<Harness | null>(null);

export function FixedHarness({ harness: fixed, children }: { harness?: Harness; children: ReactNode }) {
  return <FixedHarnessContext.Provider value={fixed ?? null}>{children}</FixedHarnessContext.Provider>;
}

function useHarness(): Harness {
  const fixed = useContext(FixedHarnessContext);
  const chosen = useSyncExternalStore(
    subscribe,
    () => harness,
    () => 'claude-code' as const,
  );
  return fixed ?? chosen;
}

/*
 * 🔴 THERE IS NO PROMPTS MAP, AND ITS ABSENCE IS THE FIX (school@33c94f7, 2026-08-30).
 *
 * This file used to carry `const PROMPTS: Record<number, {harness, title, blurb}>` — a per-page,
 * per-prompt-number table living in a component shared by every page. It was written when the
 * prompts on one page were harness VARIANTS of one instruction, so pinning prompt 2 to a harness
 * was correct.
 *
 * It stopped being correct the moment a page's prompts became STEPS rather than variants, and the
 * failure was silent: `active !== meta.harness` returned null, so a prompt with the wrong entry
 * rendered nowhere while another kept a stale title from a deleted module. A page shipped with two
 * prompts and showed one. Nothing errored.
 *
 * The metadata now comes from the fence itself, so a page cannot disagree with a component about
 * what it contains, and adding a prompt needs no edit here at all.
 *
 * A harness pin is still honoured for the genuine case: a prompt that only makes sense where it can
 * reach a shell (a `curl` pipeline pasted into Desktop reads as broken on first paste). A fence with
 * no harness renders for every harness, which is the right default now that a step is a step.
 */

export function HarnessToggle() {
  const active = useHarness();

  return (
    <div className="not-prose mt-6 flex flex-wrap items-center gap-3">
      <span
        id="harness-label"
        className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground"
      >
        Harness
      </span>
      <div
        role="radiogroup"
        aria-labelledby="harness-label"
        className="inline-flex flex-wrap rounded-xl border border-fd-primary/25 bg-fd-primary/5 p-1"
      >
        {HARNESSES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active === option.id}
            data-harness-option={option.id}
            data-active={active === option.id}
            onClick={() => setHarness(option.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              active === option.id
                ? 'bg-fd-primary text-fd-primary-foreground shadow-sm'
                : 'text-fd-muted-foreground hover:bg-fd-primary/10 hover:text-fd-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The line that renders under the Desktop tab, where the shell prompts are not shown.
 *
 * The default names "the other four" because `/docs` pins one prompt to Desktop and four to the
 * terminal. A page with NO Desktop prompt (the CLI-only modules) passes its own line as children,
 * because "the other four" there would be a count of prompts the page does not have.
 */
export function HarnessNote({ children }: { children?: ReactNode }) {
  const active = useHarness();
  if (active !== 'desktop') return null;

  return (
    <p className="not-prose mt-3 text-sm text-fd-muted-foreground" data-harness-note="">
      {children ?? 'The other four need a shell and parallel subagents. Switch to any terminal harness to see them.'}
    </p>
  );
}

/**
 * `{{ASK}}` → the active harness's mechanism, walking the RENDERED tree rather than the raw source.
 *
 * It has to be the tree: `PromptCard` never sees the fence's text, only the highlighted elements
 * Shiki produced from it, and the copy button reads the DOM those elements mount into. Substituting
 * anywhere else would leave the thing on screen and the thing on the clipboard able to disagree.
 *
 * 🔴 THE TOKEN MUST SURVIVE HIGHLIGHTING AS ONE STRING, which is why every prompt fence on this
 * site is ```text: the plaintext grammar emits a whole line as a single token, so `{{ASK}}` is
 * never split across two spans. A prompt fence tagged with a real language could split it, and the
 * failure would be a visible `{{ASK}}` rather than a silent one — which is the right failure, but
 * it is still a reason not to tag a prompt fence with a language.
 */
function substituteAsk(node: ReactNode, active: Harness): ReactNode {
  if (typeof node === 'string') return node.includes(ASK_TOKEN) ? expandAsk(node, active) : node;
  if (Array.isArray(node)) return Children.map(node, (child) => substituteAsk(child, active));
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    const kids = element.props.children;
    if (kids === undefined) return element;
    return cloneElement(element, undefined, substituteAsk(kids, active));
  }
  return node;
}

function PromptCard({
  n,
  name,
  note,
  harness: only,
  children,
}: {
  n: number;
  name?: string;
  note?: string;
  harness?: Harness[];
  children: ReactNode;
}) {
  const active = useHarness();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chars, setChars] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const regionId = `prompt-${n}-text`;

  // Reads the folded region whether or not it is open — see note 3 at the top of this file.
  function readPromptText(): string {
    const pre = bodyRef.current?.querySelector('pre');
    if (!pre) return '';
    const lines = pre.querySelectorAll('.line');
    const text = lines.length
      ? Array.from(lines)
          .map((line) => line.textContent ?? '')
          .join('\n')
      : (pre.textContent ?? '');
    return text.replace(/\n+$/, '') + '\n';
  }

  // Re-runs when the harness changes: a card the toggle was hiding has no mounted DOM to measure,
  // so measuring only on mount left the one Desktop prompt reading "0 chars" until it was expanded.
  useEffect(() => {
    const text = readPromptText();
    if (text.trim()) setChars(text.length);
  }, [active]);

  // Renders for every harness unless the fence pinned some. The old rule was the inverse — a prompt
  // with no map entry rendered NOWHERE — which is how a shipped prompt became invisible.
  if (only && !only.includes(active)) return null;

  async function copy() {
    const text = readPromptText();
    if (!text.trim()) return;
    await copyText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /*
   * Below `sm` the two buttons carry `min-h-11`: 44px is the touch-target floor, and at text-sm with
   * py-2 they measured 36px and 20px on a 375px phone (knowledge#8088).
   *
   * THE CARD IS STYLED AS AN ACTION, NOT AS A CODE BLOCK (knowledge#8074). The primary content of
   * this site is prompts a reader pastes into an agent, so the card borrows the precedent of the two
   * docs sites that treat "copy this prompt" as first-class UI — Vercel's "Agent Prompt" card and
   * Resend's "Copy prompt" card: a tinted accent surface, a kicker naming the pattern, and a filled
   * primary button. Every colour is a `--color-fd-primary` tint, so it follows the `solar` preset and
   * the theme toggle rather than introducing a palette of its own. Presentation only — the fold, the
   * copy source, the count and the `{{ASK}}` walk below are exactly the properties 1-5 above.
   */
  return (
    <div
      data-prompt={n}
      data-harness={only ? only.join(' ') : 'any'}
      className="not-prose relative my-4 overflow-hidden rounded-xl border border-fd-primary/30 bg-linear-to-b from-fd-primary/10 to-fd-card shadow-sm"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-fd-primary via-fd-primary/40 to-transparent"
      />
      <div className="flex flex-wrap items-start gap-x-4 gap-y-3 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-fd-primary/30 bg-fd-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-fd-primary">
            <Sparkles aria-hidden="true" className="size-3" />
            Prompt {n}
          </span>
          <p className="mt-2 text-base font-semibold text-fd-foreground">{name ?? `Step ${n}`}</p>
          {note && <p className="mt-1 text-sm text-fd-muted-foreground">{note}</p>}
        </div>
        <button
          type="button"
          onClick={copy}
          data-copy-prompt={n}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 max-sm:min-h-11 text-sm font-medium text-fd-primary-foreground shadow-sm transition-colors hover:bg-fd-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-fd-primary/20 bg-fd-background/40 px-4 py-2 sm:px-5">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={regionId}
          data-toggle-prompt={n}
          className="inline-flex items-center gap-1 max-sm:min-h-11 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-primary"
        >
          <ChevronRight
            aria-hidden="true"
            className={cn('size-4 transition-transform', open && 'rotate-90')}
          />
          {open ? 'Hide full text' : 'Show full text'}
        </button>
        <span
          className="rounded-md bg-fd-primary/10 px-2 py-0.5 text-xs tabular-nums empty:hidden text-fd-muted-foreground"
          data-prompt-chars={n}
        >
          {chars === null ? '' : `${chars.toLocaleString('en-US')} chars`}
        </span>
      </div>

      {/* The fold soft-wraps; the rule lives in app/global.css, which explains why. */}
      <div id={regionId} ref={bodyRef} hidden={!open} className="px-4 pb-4 sm:px-5">
        {substituteAsk(children, active)}
      </div>
    </div>
  );
}

const HARNESSES_SET = new Set<Harness>(HARNESSES.map((option) => option.id));

/**
 * The `pre` override. A fence tagged `title="prompt-N"` becomes a prompt card; everything else on
 * the site keeps rendering through the same Fumadocs `CodeBlock` it always did.
 *
 * 🔴 ALL METADATA RIDES IN `title`, AND THAT IS A CONSTRAINT RATHER THAN A CHOICE. Fumadocs'
 * default `parseMetaString` whitelists four attributes, so a `name=` or `note=` on the fence is
 * dropped before this component ever sees it. Encoding them in `title` — the attribute that IS
 * whitelisted — is what keeps a page's prompt metadata in the page, with no MDX config to change
 * and no second place for it to drift into.
 *
 *   ```text title="prompt-1"
 *   ```text title="prompt-1|Understand this fleet"
 *   ```text title="prompt-1|Understand this fleet|desktop"
 *   ```text title="prompt-2|Understand this fleet|claude-code,opencode|Fans subagents across the wiki."
 *
 * Fields, pipe-separated: N | display name | harness | note. All but N are optional, and an omitted
 * harness renders the card under EVERY tab — the right default now that a page's prompts are steps
 * rather than variants of one instruction.
 *
 * 🔴 THE HARNESS FIELD IS A COMMA-SEPARATED LIST, not a single value, because this site's real
 * split is REACH rather than brand: prompts 2-5 shell out and fan subagents, which every terminal
 * harness can do and Claude Desktop cannot. A single pin could only say that with a false narrowing
 * (four terminal tabs rendering nothing) or a false widening (a `curl` pipeline offered to Desktop)
 * — and a tab that silently renders nothing is the exact defect this component was rewritten to
 * kill. An unrecognised harness id is dropped rather than honoured, so a typo widens the card to
 * every tab instead of hiding it from all of them.
 */
export function Pre$(props: ComponentProps<'pre'> & { title?: string }) {
  const raw = props.title ?? '';
  const match = /^prompt-(\d+)(?:\|(.*))?$/.exec(raw);

  if (match) {
    const [name, harness, note] = (match[2] ?? '').split('|').map((x) => x.trim());
    const pinned = (harness ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter((id): id is Harness => HARNESSES_SET.has(id as Harness));
    const { title: _title, ...rest } = props;
    return (
      <PromptCard
        n={Number(match[1])}
        name={name || undefined}
        note={note || undefined}
        harness={pinned.length ? pinned : undefined}
      >
        <CodeBlock {...rest}>
          <Pre>{props.children}</Pre>
        </CodeBlock>
      </PromptCard>
    );
  }

  return (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
}
