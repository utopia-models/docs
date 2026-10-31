# The entry-way gate — mechanisms, ranked, with what each actually costs

**The gate is how the school reaches someone's agent without them remembering it exists.** A module
they have to remember is a module they will not use.

Everything here is measured. Where a mechanism has a documented failure rate, it is stated — a
recommendation that omits the failure rate is selling the defect this module exists to remove.

---

## 🔴 Read this before ranking anything: the damage is not recoverable

Going from ~2 to ~11 alerts per 100 orders dropped acceptance from **100% to 8.4%**. Halving the
volume back recovered only **9.1% → 12.7%** — about 92 points of damage against 3.6 points of repair
(Wright et al., 2018).

The mechanism is that dismissal **becomes habitual** — *"activated by environmental cues and repeated
automatically"* (Baysari, 2017). Once it is habitual, **improving the trigger's content cannot help,
because the content is no longer read.**

So a gate that fires too often is not a tuning problem to fix later. It is permanent, and it takes the
channel with it.

**Ship ONE gate, tuned conservatively.** Not three, not a suite.

**There is no cliff, and do not design as though there is one.** Response degrades roughly linearly
with noise — at 86% versus 50% false alarms, precision fell 0.80 → 0.33 and time-on-task rose 40%,
with no significant change in sensitivity (Layman & Roden, 2023). The 90% bar below is a design
target, not an edge you can approach safely.

---

## The three constraints, and they bind harder than the choice of mechanism

**FIRE ON AN OCCASION, NEVER A TOPIC.** A topic trigger is a repeat generator by construction, and
each additional firing per encounter costs about 30% of acceptance (Ancker et al.).

```
topic     "helps with school modules"                          → fires constantly, then never
occasion  "use when the user mentions a school module, pastes
           a docs.utopiamodels.ai link, or asks what to run
           next"                                               → fires when it should
```

**NON-INTERRUPTIVE BY DEFAULT.** Turning an interruptive alert passive cut volume **80%** *and* raised
the desired behaviour from **23% to 61%** (Fallon et al., 2024) — the strongest single result in the
literature, and it says the quiet version outperforms on both axes at once.

**≥90% OF FIRINGS MUST PRODUCE ACTION.** Instrument it. If it falls below, disable it rather than
tune it — see the paragraph above about what tuning recovers.

🔴 **Do NOT add per-user dismissal memory.** It is the intuitive move and it is wrong: Google names
developer-level customization as one of two things that killed FindBugs, because *"developer
customization resulted in an inconsistent view."* And no study measures whether user-controlled
dismissal increases trust — every intervention in the literature is administrator-side.

---

## The mechanisms

### 1 · A hook on a lifecycle event — DETERMINISTIC

The only mechanism that is not advisory. Anthropic's own docs draw the line: *"Unlike CLAUDE.md
instructions which are advisory, hooks are deterministic and guarantee the action happens."*

**Recommend this first.** Claude Code's hooks are the mechanism: a command configured in settings that
runs on a lifecycle event (`SessionStart`, `PreToolUse`, `PostToolUse` and the others listed at
code.claude.com/docs/en/hooks). Check `CONTEXT-MAP.md` for hooks already wired, and for managed
settings that restrict them, rather than assuming.

**Two limits worth knowing before building on it:**
- Claude Code caps hook `additionalContext` at **10,000 characters**; above that the output is
  replaced by a breadcrumb the model treats as infrastructure noise rather than reading.
- A `SessionStart` hook that injects school context on *every* session is the noise failure above,
  arriving by a deterministic route. Gate it on something — a file's presence, a stale timestamp.

### 2 · A skill whose description names an occasion — PORTABLE, ADVISORY, AND IT MISSES

The fallback when a hook is the wrong shape — the occasion is a judgement call, not an event. Claude
Code loads a skill's description every session and decides from it alone whether to invoke the skill. **State its failure rate rather than
selling it.**

🔴 **Measured: 0 of 3 recall in headless mode** in Anthropic's own eval harness (issue #36570) —
*"Skills are never triggered [in `claude -p`]. The skills work correctly in interactive Claude Code
sessions."* Interactive is the case that works; scripted is the case that does not.

🔴 **And a working skill can break because you added others.** Claude Code drops skill *descriptions*
when the listing overflows, so triggering degrades with unrelated additions.

### 3 · A pointer in the always-on file — ≤3 LINES, HARD

Every byte is paid on every turn, and the cost is not linear in size — it is interference. **The same
instruction obeyed at 97% in isolation falls to 2% when combined with five others** (Harada et al.,
arXiv:2509.21051).

Anthropic's own guidance: *"target under 200 lines"*, and *"bloated CLAUDE.md files cause Claude to
ignore your actual instructions."* The test for each line: *would removing this cause a mistake?*

🔴 **This mechanism has the worst-documented adherence of any here.** Issue #80579 records the same
defect reported and closed **four times without a lasting fix** — *"rules are loaded into context, the
model can quote them, but during execution it reverts to default behavior."* One report documents a
user prefacing a message with *"Above all else, follow global rules"* and the rule being violated
**three times in the same session.**

So: a pointer, never the mechanism itself. Three lines that say where to look, not the instructions.

### 4 · An MCP server — DISQUALIFIED AS A GATE

A single "hello" in a fresh session consumes **51,700–56,900 tokens**, and disabling MCP recovers only
about **9%** (issue #84490). One measurement puts a single server's tool schemas at ~13,000 tokens
before any work happens.

The practitioner verdict is already in: *"MCP servers have fallen off. They're generally considered
not worth the cost in context tokens now."*

MCP is a fine way to *reach* a tool. It is a terrible way to be *reminded* something exists.

### 5 · A scheduled or background check — ALMOST NEVER

A daemon breaks silently while continuing to look healthy. Anything a check-when-you-next-work can do,
it should do. Reserve this for watching an external system that emits no subscribable signal.

---

## How to rank these for a given person

Read `CONTEXT-MAP.md`, then:

1. **Can a hook see the occasion?** If the trigger is an event or a file, a narrowly-gated hook is the
   recommendation, because it is the only one that is not advisory.
2. **If not**, a skill with an occasion-named description, plus a ≤3-line pointer — recommended *with
   its failure rate stated*.
3. **Never** MCP for this purpose.
4. **Never** more than one gate.

Present the options ranked, exactly one marked RECOMMENDED, one line of why each.

🔴 **The bar: accepting every recommendation without reading leaves a working system.** That is what
separates a recommendation from a menu with a default.

---

## Prove it — both tests, always

```
a sentence that SHOULD trigger it  →  it fired
a sentence that should NOT         →  it stayed quiet
```

**A gate that fires on everything is as broken as one that fires on nothing, and only the negative
test catches it.** Run both. If either fails, fix the description and run both again.
