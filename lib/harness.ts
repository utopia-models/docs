/**
 * The six harnesses this site's meta prompts are written for, and — for each — the REAL mechanism
 * that harness uses to ask its reader a question.
 *
 * 🔴 WHY THIS TABLE EXISTS. A prompt that says "USE THE `AskUserQuestion` TOOL" is correct in
 * Claude Code and false in the other five: no such tool exists there, so the instruction that was
 * supposed to force a structured question with a RECOMMENDED option instead names something the
 * agent cannot call, and it falls back to prose. That failure is silent — the conversation still
 * looks fine while the recommendation, the entire mechanism by which a reader who reads nothing
 * still ends up with a working system, has been dropped (school@20546f0 measured exactly this in
 * the other direction: the prompts named NO tool and every question came out as prose).
 *
 * 🔴 AND WHY IT IS A TABLE RATHER THAN SIX COPIES OF EACH PROMPT. The alternative — one fence per
 * harness, each naming its own tool, pinned with `harness=` — was measured before it was rejected:
 * the three affected fences (all in `utopia-models/school`, which carries the same table) are
 * 21,181 characters, so six pinned copies is +106,000 characters of duplicated prompt prose that
 * every future edit has to be made in six places, correctly, forever. A token expanded from one
 * table is the same instruction with one copy of it. The full argument, with the measurement and
 * the rejected alternatives, is the PR body of docs-wiki#30.
 *
 * 🔴 EVERY NAME BELOW WAS READ FROM THE VENDOR'S OWN SOURCE ON 2026-09-04, not recalled:
 *
 *   claude-code  `AskUserQuestion`     @anthropic-ai/claude-code/sdk-tools.d.ts (installed here)
 *   opencode     `question`            sst/opencode packages/opencode/src/tool/question.ts —
 *                                      `Tool.define<...>("question", ...)`
 *   codex        `request_user_input`  openai/codex codex-rs/core/src/tools/handlers/
 *                                      request_user_input_spec.rs —
 *                                      `REQUEST_USER_INPUT_TOOL_NAME: &str = "request_user_input"`
 *   gemini       `ask_user`            google-gemini/gemini-cli docs/tools/ask-user.md —
 *                                      "**Tool name:** `ask_user`"
 *   cursor       (no published id)     cursor.com/docs/agent/tools documents the capability as
 *                                      "Ask questions" and publishes no tool identifier. The issue
 *                                      brief predicted this; it is still true. So the prompt names
 *                                      the capability the way Cursor's own docs name it.
 *   desktop      artifact buttons      Claude Desktop has no `AskUserQuestion`-equivalent TOOL, but
 *                                      Artifacts with real clickable `<button>` elements ARE
 *                                      reachable from plain Desktop/claude.ai chat — confirmed live
 *                                      2026-09-18 (support.claude.com/en/articles/9487310: "Ask for
 *                                      one in any conversation with Claude... including on desktop").
 *                                      Superseded 2026-09-18: this file previously said "Claude
 *                                      Desktop has no interactive-question tool at all... write the
 *                                      option list out," true when written 2026-09-04 but stale —
 *                                      it never checked whether the ARTIFACT surface (not a tool)
 *                                      could substitute. It can: a rendered HTML artifact whose
 *                                      buttons post the choice back into the conversation is the
 *                                      practical equivalent of a click-driven ask, with a
 *                                      recommended option markable the same way the other five mark
 *                                      one. Kept per `a-closed-fork-rewrites-what-it-invalidated` —
 *                                      the old claim stays legible as a considered reversal, not a
 *                                      silent edit.
 *
 * A name that changes upstream changes HERE, once, and every prompt on the site follows.
 */

export type Harness = 'claude-code' | 'opencode' | 'codex' | 'cursor' | 'gemini' | 'desktop';

/*
 * SIX HARNESSES, and the order is the answer to "which do I pick?" — the default first, then the
 * other terminal agents, then the one that cannot see your filesystem. A reader who does not know
 * which they are on picks the first and is right.
 *
 * 🔴 THE SPLIT IS ABOUT REACH, NOT BRAND. Every terminal harness can survey the machine; Claude
 * Desktop cannot, so its prompt is a different prompt rather than the same one with a caveat.
 */
export const HARNESSES: { id: Harness; label: string }[] = [
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'opencode', label: 'opencode' },
  { id: 'codex', label: 'Codex CLI' },
  { id: 'cursor', label: 'Cursor CLI' },
  { id: 'gemini', label: 'Gemini CLI' },
  { id: 'desktop', label: 'Claude Desktop' },
];

/**
 * What `{{ASK}}` becomes under each tab.
 *
 * Each value is a NOUN PHRASE, not a bare identifier, because the six do not share a grammar: five
 * have a tool and one does not, and one of the five has a capability with no published name. A
 * bare-name token would read as "USE THE Cursor's Ask-questions tool TOOL" under one tab and as a
 * plain lie under another. Every prompt sentence is therefore phrased "ask … with {{ASK}}".
 */
export const ASK_MECHANISM: Record<Harness, string> = {
  'claude-code': 'the `AskUserQuestion` tool',
  opencode: 'the `question` tool',
  codex: 'the `request_user_input` tool',
  cursor: "Cursor's built-in Ask-questions tool",
  gemini: 'the `ask_user` tool',
  desktop:
    'an Artifact with real clickable buttons — Claude Desktop has no `AskUserQuestion`-equivalent tool, but Artifacts are reachable from the same chat',
};

/**
 * What `{{ASK}}` becomes where NO harness has been chosen: the `.md` twin of a page,
 * `/llms-full.txt`, and the kit files a reader downloads. Those are read by an agent that already
 * knows which harness it is, so the honest substitution is the lookup itself rather than one
 * harness's answer — the whole defect being fixed here is one harness's answer served to six.
 */
export const ASK_NEUTRAL =
  "your harness's own interactive question tool (Claude Code `AskUserQuestion` · opencode " +
  '`question` · Codex CLI `request_user_input` · Gemini CLI `ask_user` · Cursor\'s built-in ' +
  "Ask-questions tool; Claude Desktop has none, but render an Artifact with real clickable " +
  'buttons instead)';

/** The literal a prompt fence carries. One token, so a prompt cannot half-adopt the mechanism. */
export const ASK_TOKEN = '{{ASK}}';

/**
 * The harness a page is written for, or `undefined` where the reader chooses one.
 *
 * 🔴 ONLY THE ROOT IS MULTI-HARNESS (knowledge#8025, Tyler 2026-09-27: *"all of the modules (except
 * for the root 'The Utopia Fleet') to have claude code as the one harness only"*). Every other page
 * is fixed to Claude Code in BOTH representations — the rendered page (`FixedHarness` in
 * `app/docs/[[...slug]]/page.tsx`) and the `.md` twin / `/llms-full.txt` (`getLLMText`) — so a reader
 * who flipped the root's toggle to another tab and then navigated on still gets Claude Code's tool,
 * and an agent fetching a module's markdown gets the one answer rather than the six-way lookup.
 * Decided once, here, by slug: a new module inherits it with no per-page markup to forget.
 */
export function pageHarness(slugs: string[]): Harness | undefined {
  return slugs.length === 0 ? undefined : 'claude-code';
}

/** Substitutes `{{ASK}}` in a single string. `harness` omitted ⇒ the harness-neutral lookup. */
export function expandAsk(text: string, harness?: Harness): string {
  const replacement = harness ? ASK_MECHANISM[harness] : ASK_NEUTRAL;
  return text.split(ASK_TOKEN).join(replacement);
}
