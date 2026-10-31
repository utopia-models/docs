<!--
Decision record template. Adapted from MADR minimal (github.com/adr/madr, CC0).
Copy to <records dir>/NNNN-<short-title>.md, numbered in the order decisions were made.
check-supersession.py reads the four header lines above the first "# " heading and nothing else, so keep
them as plain `Key: value` lines and keep this comment ABOVE them.

WRITE ONE ONLY WHEN the choice is expensive to reverse, or a later reader (a person, or an agent with no
memory of today) will otherwise propose it again. Anything else goes in the commit message.

STATUS VALUES:
  proposed    written, not yet acted on
  accepted    in force
  superseded  replaced — Superseded-by names the record that replaced it. NEVER delete a superseded record.
  killed      something was built and deleted — fill in "What was killed" below

SUPERSEDING: the new record says `Supersedes: <old file>`. In THE SAME COMMIT, the old record's header
becomes `Status: superseded` and `Superseded-by: <new file>`. A decision silently invalidated with nothing
marking it dead keeps being cited as live.
-->
Status: proposed
Date: YYYY-MM-DD
Supersedes:
Superseded-by:

# {short title — the problem and the answer, e.g. "Store sessions in SQLite, not Redis"}

## Context

{Two or three sentences. What forced a choice, and what it binds. Link the issue or conversation if one
exists.}

## Options considered

* {option 1}
* {option 2}
* {keep what exists / do nothing — include it honestly; it is often the right answer}

## Decision

Chosen: "{option}", because {the one reason that decided it}.

### Consequences

* Good, because {…}
* Bad, because {… — write a real one; a record with no downside was not a decision}

### Grounding

{What was READ to make this call — a file and line, a command and its output, a URL. A decision built on a
remembered fact about a system that has since changed is the failure this section exists to prevent.}

<!-- ============ ONLY FOR Status: killed — delete otherwise ============ -->

## What was killed

{What it was, and the date it was deleted.}

**Why it died:** {the measured reason, not the mood.}

**What replaced it:** {the successor, or "nothing — the need went away".}

**What would reopen it:** {the NEW INFORMATION that would justify rebuilding it. Disagreement is not new
information. If this line is empty, the answer to "should we bring it back?" is no.}

<!-- ============ ONLY WHEN THE DECISION IS A NUMBER — delete otherwise ============ -->

## The measurement

{A limit — a timeout, a retry count, a concurrency cap, a batch size — is a measurement, never a
precaution. The number, the command or load test that produced it, and the date. A cap chosen from
caution silently becomes the system's capacity and never fails loudly enough to be noticed.}
