# `/kit` — the files the meta prompts point at

Every file here is fetched by an agent, not read by a person. They are public and unauthenticated on
purpose: a client's agent has to reach them from their machine, in their session, with no account.

**Why these are files rather than prose inside the prompts.** A prompt that carries its own content
can only be improved by editing the prompt, which means every harness variant drifts separately and a
correction has to be made six times. A prompt that points at a file improves when the file does, for
every harness, immediately — and the interview is *identical* for all six, so it belongs in one place.

| file | fetched by | what it is |
|---|---|---|
| `survey.md` | step 1 | the environment commands, per platform, with what each one actually proves |
| `interview.md` | step 1 | the questions, the rounds-of-four rule, and who the reader is |
| `intake-schema.md` | step 1 → 2 | the output contract for `AI-INTAKE.md`, so step 2 can rely on its shape |
| `fleet-architecture.md` | step 2 | how a real dispatch fleet is built, and the decisions behind it |
| `dispatch-anatomy.md` | step 2 | the run path — dispatch, runner, sweeper — and the pre-flight refusals |
| `doctrine-pattern.md` | step 2 | how agent behaviour is configured so it survives a context reset |
| `gap-report.md` | step 2 → 3 | the output contract for the gap report |
| `fleet-design.md` | step 3 → 4 | the output contract for the design and its manifest |
| `verification.md` | step 5 | what "it works" means, as commands whose output gets pasted |

## `patterns/<id>/` — one architectural-pattern module each

A pattern module reuses this kit rather than carrying its own: `survey.md` is its survey, module 01's
twelve markers and five tiers are its classification, and its `_src/build.py` imports the loader and
the four module-agnostic blocks from `workflows/_src/build.py`. What a pattern directory holds is only
what is its own — three blocks, five tier YAMLs, the ten generated tier files, and any file its build
prompt copies verbatim. `python3 patterns/<id>/_src/build.py --check` exits 1 on a stale tier file.

| directory | page |
|---|---|
| `patterns/decision-discipline/` | `/docs/patterns/decision-discipline` — pattern 14: records, kill records, `Superseded-by` in the same commit, a limit is a measurement |

## Rules for anything added here

- **Written for an agent.** No marketing, no second person plural, no throat-clearing.
- **Every claim carries the command that proves it**, or is marked as a decision rather than a fact.
- **No hostnames, usernames, accounts or credential paths.** These are public. Describe the role, not
  the value.
- **A file is a contract.** If a later step reads it, changing its shape breaks that step — say so at
  the top of the file, as `intake-schema.md` does.
