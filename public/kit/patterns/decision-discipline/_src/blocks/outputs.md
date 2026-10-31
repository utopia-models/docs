WRITE THESE FOUR FILES

In the folder they confirmed. These are what the execution prompt reads, so the headings are fixed.

DECISION-MAP.md — the durable one. Headings, in this order:

  ## Where decisions live now      every place a choice is recorded today — a records directory, a
                                   docs page, the instructions file, commit messages, an issue thread —
                                   with the path and how many
  ## Records found                 one row each: file · Status · does its subject still exist · the
                                   command that showed it
  ## Supersessions                 every Supersedes / Superseded-by pair, and whether BOTH ends point at
                                   each other. A one-sided link is a finding
  ## Killed and unrecorded         things deleted or reverted in history that no record mentions, with
                                   the git command that found each
  ## Limits                        every numeric cap found — timeout, retries, concurrency, batch size —
                                   with file:line, and whether a measurement sits beside it
  ## Always-on files               every file Claude Code loads at session start, with its byte count,
                                   and the TOTAL. Prompt 2 adds to this and must not blow it up
  ## Where the records should go   the directory prompt 2 will create or reuse, and why that one

This file is re-read every time a decision changes; the other three are records of one session.

INTERVIEW.md — what you asked and what they said, each marked MEASURED or STATED.

TIER.md — the tier, the markers that decided it with their evidence quoted, and what would move each
dimension up. Score PERSISTENCE, ACTIVATION and COORDINATION separately and show all three: the
profile is the real output and the tier is a compression of it.

DECISIONS.md — every recommendation you made in this session, whether it was accepted, and what was
chosen instead. A later session reads this to know what has already been settled.
