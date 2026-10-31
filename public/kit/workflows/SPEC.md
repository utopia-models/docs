# Module 1 — the spec

What the two prompts must achieve, stated as goals and acceptance rather than as shape. Written
because the module was twice built from a description of its structure and twice came out thin.

---

## The two goals, in one line each

**INTERVIEW.** Produce enough recorded fact that execution can write workflows **deterministically,
asking nothing further.** It ends with committed markdown, not with a conversation.

**EXECUTION.** Produce a system where **the entry-way gate fires without the user remembering it
exists**, and where **accepting every recommendation leaves them with a durable working setup.**

Everything below serves those two sentences.

---

## The ladder

| step | prompt | ends with |
|---|---|---|
| 1 | **Classify and interview** | a folder of committed markdown, and a tier |
| 2 | **Build the workflows** | working files, a fired gate, and a verification |

Two prompts, not five. Step 1 asks; step 2 builds. A reader pastes one, runs it, pastes the next.

---

## Tiers — split on WHAT PERSISTS ACROSS SESSIONS

Not on sophistication, and not on tool count. On what survives a session ending, because that is
what predicts which workflows are possible at all.

| tier | signal | what it means |
|---|---|---|
| **1 · BARE** | Claude Code, no instructions file | nothing persists. Every session starts from zero |
| **2 · CONFIGURED** | an instructions file exists, maybe a skill or two | things persist; nothing coordinates them |
| **3 · ORGANIZED** | skills that actually fire · tools connected · notes that are read, not re-explained | context is assembled deliberately |
| **4 · ORCHESTRATED** | **more than one agent runs at once**, or a deliberate context protocol | either a dispatch fleet, or a structured-knowledge substrate |

🔴 **Tier 4 is two shapes, and the dividing question is one line: HOW MANY AGENTS RUN AT ONCE?**
Not "how advanced are you" — both are advanced, and they need opposite advice.

**A BRANCH INSIDE TIER 4, NEVER A FIFTH TIER.** DORA abandoned its own four-tier ladder in 2025,
replacing Elite/High/Medium/Low with seven **non-ordinal archetypes** — because its 2024 report had
already found "medium performers" were *more stable* than "high performers," and the ranking was an
authorial choice imposed on clusters that were not ordered. A fifth tier re-imposes exactly that.
Selected by markers already measured: unattended-run evidence + a queue → dispatch; a
config-referenced knowledge directory + high skill count with no queue → context.

- **4-FLEET** — many agents, unattended, a queue. *Engineers the RUN.*
- **4-CONTEXT** — one agent, deep structured knowledge, a closed taxonomy, trust that does not
  launder through derivation. *Engineers the READ.*

A context-protocol operator handed dispatch advice has been answered a question they did not ask.

---

## Classification — how the agent decides

Measured, never asked. The reader is never made to self-assess before they have the vocabulary.

🔴 **SCORE THREE DIMENSIONS INDEPENDENTLY, THEN DERIVE THE TIER. Do not count signals.** This
reverses an earlier draft of this file, and CMMI's own spec says why: counting makes every signal
interchangeable, so six trivial slash commands outrank one well-scoped subagent plus a green gate.

| dimension | the question |
|---|---|
| **PERSISTENCE** | does anything survive a session ending? |
| **ACTIVATION** | does what persists actually fire? |
| **COORDINATION** | does anything run without a human in the loop? |

The agent emits ~10 boolean markers with **quoted evidence**, into fixed fields — never a reasoning
paragraph. Each marker is a *description*, never a judgement: `instructions_file_present` with a byte
count, not "the config is good." Then arithmetic produces the tier.

**Hard gates, not just totals**, or a high total masks a disqualifying absence: no instructions file →
cannot be tier 2+, whatever else is present. No evidence of a run that completed without a human →
cannot be tier 4.

🔴 **The per-dimension profile is the real output; the tier is a lossy projection of it.** The
boundary case — a strong instructions file and no skills — resolves as high PERSISTENCE, zero
ACTIVATION: CONFIGURED, with the gap named. CNCF's platform-engineering model states the payoff
directly: *"The true outcome of a maturity model assessment isn't what level you are at but the list
of things you need to work on to improve."*

**Do not define BARE by absence.** Claude Code installed and working is a real state with real next
actions, not "not yet tier 2."

**Expect ~70% accuracy at the CONFIGURED/ORGANIZED boundary, not 85%.** Unambiguous BARE and
ORCHESTRATED classify reliably; the middle is near coin-flip. Design so an adjacent-tier error costs
one click.

🔴 **Under-classify at a boundary.** A tier-3 user given tier-2 templates gets material slightly
below them and can say so in one sentence. A tier-2 user given tier-4 templates gets instructions
referencing infrastructure they do not have, and every one of them fails. The two errors are not
symmetric.

🔴 **Show it as a ONE-STEP NUDGE, not a question.**

> **You're at ORGANIZED.** Skills with real trigger descriptions, two MCP servers authenticated,
> notes your config points at — but nothing runs unattended.
> `[right]`  `[further along ↑]`  `[take it slower ↓]`

Dietvorst *et al.* (Management Science 64(3), 2018) is the mechanism: people accept an imperfect
algorithm far more readily when they can adjust it, *"even when severely restricted in the
modifications they could make."* A one-step adjustment captures essentially the whole benefit.

**Never ask "how experienced are you?"** Self-report is what the classifier exists to replace, and
asking it surrenders the algorithm-appreciation effect that makes a less-expert user accept the tier
at all.

🔴 **TIER IS RIGOR OF PRACTICE, NOT LEVEL OF ACHIEVEMENT.** Carry NIST's framing (CSF 1.1 §2.2):
*"Tiers do not represent maturity levels."* A consultant on one laptop who sits at CONFIGURED by
choice is correctly classified, not behind. Without that framing the module ships level envy.

---

## What the interview must produce

The output is a **folder**, chosen with the user, containing markdown the execution step reads.
By default a **dedicated folder per module** — `<chosen>/school/01-workflows/` — even at tier 4.

| file | holds |
|---|---|
| `CONTEXT-MAP.md` | every file loaded at session start with its byte count · what fires on a trigger vs always · what is pointed at but never read · **the total always-on cost** · every I/O path |
| `INTERVIEW.md` | what was asked, what was answered, marked measured vs stated |
| `TIER.md` | the tier, the signals that decided it, and what would move them up |
| `DECISIONS.md` | every recommendation made, whether accepted, and what was chosen instead |

🔴 **`CONTEXT-MAP.md` is the durable artifact.** The other three are records of one session; the map
is re-read every time anything changes. It is the reason this module is worth running once a quarter
rather than once.

**The interview covers only what cannot be measured.** The survey ran first. Asking someone what
version of Claude Code they run, after reading it, is how a technical reader stops trusting the process.

🔴 **ONE QUESTION AT A TIME. 5–7 questions, hard ceiling 10.** This reverses `kit/interview.md`'s
"rounds of four," and the reason is not abandonment — this audience finishes. It is **satisficing**:
Krosnick's weak satisficing is answering *"incompletely and with bias"*, and a high-ability,
high-motivation reader who has decided the interview is not listening will complete question 11 with
a reasonable-sounding answer produced by no actual thought. That failure is invisible — the interview
completes and the answers look fine. Batching also makes a follow-up probe structurally impossible.

**Question 1 costs 2.5× what question 3 does** (75s vs ~30s, measured across 100,000 surveys). Never
spend it on a warm-up.

🔴 **Open by stating what was found and inviting correction — not by asking.** And distinguish the two
kinds of prefill, the way Stripe does: a **measured** fact is asserted and not offered for editing; an
**inferred** one is shown as a correctable default. Collapsing them produces either an interview that
re-asks measured facts, or one that silently locks in a wrong inference.

🔴 **Terminate on precision, not count.** After each answer: is any tier still live? If one is now the
only candidate, stop. A fixed script is the fixed-form test that adaptive testing exists to beat.

**Beware supplying the answer.** Pew measured 58% selecting "the economy" when offered as a choice
against 35% volunteering it unprompted. Multiple choice partly *authors* the goal — use open text for
goals, options only for genuine either/ors.

🔴 **The failure mode to build against:** a 399-participant study found LLM interviewers score high on
conventional quality metrics and **significantly underperform on richness** — *"the responses rarely
capture participants' specific motives or personalized examples."* For template selection that is the
worst possible failure: confident input routing to a plausible wrong template with no signal anything
went wrong. The mitigation is never asking for motives in the abstract. *"I see X on this machine;
what are you trying to do with it?"* beats *"what are your goals?"*

---

## What execution must produce

**The entry-way gate — the mechanism that makes the school reach the agent unprompted.**

Tier 1–2 get the default, recommended, with the option to differ. Tier 3–4 get **3–5 ranked options
matched to their infrastructure, exactly one marked RECOMMENDED**, one line of why each.

🔴 **The bar: accept-all yields a durable system.** A user who reads nothing and clicks the
recommendation every time must end with something that works. That is what makes a recommendation
honest rather than a menu with a default.

**The workflows themselves** — built from `INTERVIEW.md` plus the tier's execution template. What
gets built differs by tier, but every tier gets at least: a way to run a module, a record of what has
been run and what changed as a result, and a way to learn a new module exists.

🔴 **A tracker row that says "done" with nothing in the what-changed column is a module that was not
completed.** The record must make that visible rather than let a tick hide it.

---

## Acceptance — how we know it worked

Not "the agent said it finished."

1. **The gate fires.** Say a sentence that should trigger it; it fires. Say one that should not; it
   stays quiet. 🔴 **Both tests, always** — a gate that fires on everything is as broken as one that
   fires on nothing, and only the negative test catches it.
2. **`CONTEXT-MAP.md` exists** and its always-on byte total matches what Claude Code actually loads.
3. **Every recommendation is recorded in `DECISIONS.md`** with what was chosen, so a later session
   knows what was already decided.
4. **The classification is right at both ends.** Dogfooded against a bare machine and a fully
   orchestrated one. If it cannot separate those, it is broken.

---

## What this module is NOT

- **Not a survey-and-interview module.** That was step 1 of a different module and became the opening
  of every module by copy-paste. This one classifies, then asks only what it could not measure.
- **Not a course.** Nothing here explains what an AI agent is.
- **Not open-ended.** Every decision arrives as a recommendation with a reason. The user may differ;
  they are never asked to invent an answer from nothing.

---

## How the templates are built

**Ten flat, self-contained files, generated from one source, committed.** Not includes, not overlays.

```
public/kit/workflows/
  SPEC.md                              this file
  tiers/                               THE SERVED ARTIFACTS — flat, complete, committed
    1-bare-interview.md                1-bare-execution.md
    2-configured-interview.md          2-configured-execution.md
    3-organized-interview.md           3-organized-execution.md
    4-dispatch-interview.md            4-dispatch-execution.md
    4-context-interview.md             4-context-execution.md
  _src/
    blocks/          shared prose, one file per block. NO block includes another
    tiers/*.yaml     which blocks, in what order, plus tier-specific prose
    *.j2             exactly two templates — interview and execution
    build.py
```

🔴 **The served file must be FLAT, and that is not a preference.** An HTTP fetch of a file containing
an include directive delivers the literal directive string to the model. The consumer cannot resolve
it. So flatness is required either way — the only question is whether it comes from authoring or from
generating, and generating is how eight files stay consistent.

🔴 **Every extra fetch is a failure mode.** Claude Code's Skills achieve progressive disclosure only
because the agent has a filesystem, code execution, and instructions about what each file holds.
Over plain HTTP with none of that, a "also fetch the shared rubric" line converts a guaranteed
single fetch into a probabilistic multi-fetch. **Do not model this on Skills.**

**Inheritance depth exactly one.** Kustomize's stated reasons for refusing templating are the
indictment: *"The source material is no longer structured… it's now logic that must be compiled"* ·
*"Errors in the output are disconnected from the edit that caused it."* Note what it does accept —
base plus one flat overlay, addition-only — and that it refuses removal outright. A tier system needs
removal, which is why blocks are **selected by data**, never overridden.

**Every generated file opens with an HTML comment**, so it does not reach the model as instruction
text:

```
<!-- Generated by _src/build.py from 3-organized.yaml. DO NOT EDIT. -->
```

**CI is the mechanism that catches "edited one, forgot the others":**
`python build.py && git diff --exit-code tiers/`. The diff's blast radius is the review — a shared
block change produces eight identical hunks; a one-tier change produces one. A hunk count that does
not match the intent is the signal.

🔴 **Delete the generator the moment it needs a conditional.** If a template grows
`{% if tier == 3 %}`, the data model is wrong — fix the data, not the template. Eight files is near
the break-even where authoring context-free fragments costs more than maintaining duplicates.

**A higher tier's template should be visibly, unapologetically SHORTER.** Google's equation:
*good documentation = what the audience needs − what they already know.* If the ORCHESTRATED document
is as long as the BARE one, the tiering has failed and four documents were written for one reader.

---

## Writing the tier templates — seven devices

1. **Progressive disclosure, never staged.** Staged fails on interdependent content, and making a
   senior engineer pass through BARE to reach ORGANIZED is exactly that. Structural; no tone fixes it.
2. **Route on situation, never self-assessed skill.** Copy PostgreSQL's grammar: *"Everyone who runs a
   server, be it for private use or for others, should read this part."* A skill label forces a
   self-judgement; a situation label asks a fact.
3. **Explicit skip permission WITH a named destination.** The Rust Book gives both — permission alone
   is weak; permission plus a pointer lets an expert leave without wondering what they missed.
4. **Conditional skip-branches keyed on state already held.** *"You already have hooks wired — skip to
   §4."* The highest-value device available, precisely because the survey ran first.
5. 🔴 **Objection-shaped asides for the skeptical expert.** Tailwind answers the experienced reader's
   objection *before* teaching — *"Why not just use inline styles?"* It inverts the condescension
   polarity, treating skepticism as legitimate rather than as resistance. Every tier boundary should
   carry one.
6. **Split action from explanation per section.** A section blending how-to with why reads
   condescending to the expert *and* thin to the novice.
7. 🔴 **Information scent on everything collapsed.** A section labelled "Advanced" or "More details"
   **fails** — the expert cannot tell whether their answer is inside, so they open everything and the
   overwhelm returns. Label by content: *"Why the runner posts its start marker before anything that
   can fail."*

🔴 **Condescension is a cognitive-load problem with measured performance cost, not a tone problem.**
The expertise reversal effect: techniques effective for novices *"can lose their effectiveness and
even have negative consequences"* for experienced learners. Redundant guidance consumes the working
memory that would have done the work. You cannot fix it by writing the beginner content more politely
— it has to be genuinely absent from the expert's path.
