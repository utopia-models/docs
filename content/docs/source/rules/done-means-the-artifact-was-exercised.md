---
title: "A green build is evidence about the SOURCE. \"Done\" is a claim about the ARTIFACT."
description: "Mirrored from the fleet knowledge base: _rules/done-means-the-artifact-was-exercised.md"
updated: 2026-10-31
---

> Mirrored verbatim from `utopia-models/knowledge` `_rules/done-means-the-artifact-was-exercised.md` by the allowlisted publish pipeline. Edit it there, not here.

```yaml
name: done-means-the-artifact-was-exercised
cases: [2026-07-01-agent-acceptance-measures-outcome, 2026-07-23-telegram-false-completion-and-48h-delete-limit, 2026-08-01-cloud-shipped-mechanism-needs-an-auto-loaded-caller, 2026-08-01-cloud-verify-a-features-must-not-list-by-measuring, 2026-08-01-dmv-verify-acceptance-not-plan-checkmarks, 2026-08-02-i-stop-at-the-first-reportable-moment, 2026-08-03-i-shipped-a-skeleton-and-called-it-live, 2026-08-09-a-green-build-is-not-a-verified-artifact, 2026-08-13-merged-is-not-deployed, 2026-08-13-a-pr-carries-more-than-its-title-says, 2026-08-14-a-tab-that-does-not-rescope-is-the-merge-again, 2026-08-14-a-diagram-asserting-completeness-must-be-verified, 2026-08-14-render-and-look-before-shipping-a-visual, 2026-08-14-a-verify-that-writes-a-doc-has-not-verified-anything, 2026-08-15-measure-the-thing-the-user-sees-not-a-proxy, 2026-08-15-state-the-data-is-mock-before-being-asked, 2026-08-16-exercise-a-peers-fix-before-relaying-it, 2026-08-16-a-close-out-marker-is-a-claim-not-a-measurement, 2026-08-16-a-grader-that-tests-one-url-form-is-blind-to-the-other, 2026-08-17-a-diagram-that-embarrasses-tyler-is-not-shipped, 2026-08-19-deploy-verified-at-the-live-url-not-at-the-merge, 2026-08-19-generated-diagram-inherits-the-generators-palette-not-the-pages, 2026-08-20-a-masters-self-report-is-not-a-measurement, 2026-08-27-a-structural-probe-is-not-looking-at-the-artifact, 2026-08-28-the-diagram-i-never-looked-at, 2026-08-28-my-own-monitor-was-the-thing-that-was-broken, 2026-09-08-a-plan-of-self-reports-is-not-a-verified-plan, 2026-10-05-verify-phone-surfaces-yourself-with-playwright-and-vision, 2026-10-17-video-choices-sent-as-stills-again-because-the-media-rule-did-not-load, 2026-10-17-one-element-pair-passing-is-not-a-whole-page-overlap-check, 2026-10-17-review-a-site-as-a-site-routes-diffed-ctas-clicked-real-engine, 2026-10-17-a-visual-review-is-mine-geometry-checks-are-not-one, 2026-08-11-documenting-a-mechanism-is-not-building-it, 2026-08-20-i-fixed-the-wrong-mechanism-and-called-it-done]
status: active
mechanism: stop-hook: done|shipped|complete|live|fixed in the turn AND build/test in tool history AND no curl/render/run of the artifact
audience: agent
last-recurrence: 2026-10-17
```

# A green build is evidence about the SOURCE. "Done" is a claim about the ARTIFACT.

## Fires when
About to write "done", "shipped", "working", "live", "fixed" while the newest green thing in scroll-back is a build, CI run, passing test, or a script's own success count. Also: relaying a subagent's or script's success claim; any VISUAL about to be looked at (draft included); a run's own close-out marker (`⚠`/`✔`/`✘`); `MERGED` or a Vercel `READY`.
🔴 **A site is not done until the site-audit passes in the user's real engine and input** (2026-10-17: `/` and `/commercial` shipped byte-identical; three overlaps found on his phone): every element vs every other at phone + desktop sizes · WebKit · real wheel scroll · every CTA and form clicked · every video plays — then LOOK at the screenshots (`_infra/scripts/site-audit/`, #9116 P3). **Deliver the media type asked for** — a video request gets playable `.mp4`s, never stills.

## Trigger detail (full text — kept out of the always-loaded bundle)
About to write "done", "shipped", "complete", "working", "live", "fixed" — and the newest green thing
in scroll-back is a build, a CI run, a compile, a passing test, or a script's own success count. Also
when relaying a subagent's or a script's own success claim; on any VISUAL about to be looked at,
draft included; on a run's own close-out marker (`⚠`/`✔`/`✘`); and on `MERGED` or a Vercel `READY`.

🔴 **A SITE IS NOT DONE UNTIL THE SITE-AUDIT PASSES IN THE USER'S REAL ENGINE AND INPUT** (2026-10-17:
`/` and `/commercial` shipped byte-identical; three overlaps found on his phone). Routes listed, hashed
and given a job · every element vs every other at phone + desktop sizes · WebKit · real wheel scroll ·
every CTA and form clicked · every video plays — then LOOK at the screenshots. The pair in the bug report
passing is not this. Spec: `_infra/scripts/site-audit/` (#9116 P3). And **deliver the media type asked
for** — a video request gets playable `.mp4`s he can open, never stills or a gallery.

## The rule
🔴 **A MECHANISM I ARMED IS AN ARTIFACT, AND "IT STARTED" IS NOT EXERCISING IT** (2026-08-28). A
Monitor that arms successfully and one that reports the right events look identical at arm time — both
print a snapshot. Three defects shipped inside one armed watch that way, and **every one of them was
SILENCE**, indistinguishable from a healthy chain: a display slice taking the first character rendered
a heading-form `## ✔` as `#`; the same bug in `starts=` disabled the retry detector entirely; and `🪫`
was absent from the marker alphabet, so a quota death read as still-running. **Feed one fixture per
state the detector claims to catch, before reporting it armed** — four fixtures took two minutes and
found a defect the filed bug report had missed.

🔴 **AND ON A DIAGRAM, VALIDATE THE SHAPE, NOT ONLY THE MARKUP.** Zero duplicate ids and zero dangling
refs are properties of the FILE; legibility is a property of the RENDER, and every check can pass on a
page nobody can read. Compute the aspect ratio and compare it to an artifact Tyler already approved —
406×1408 is a rope, 2903×115 is a hairline, ~1.4 is the target. And enumerate the components from the
SOURCE, never from the plan's own findings: 9 nodes were drawn for a 16-stage path because the diagram
illustrated my argument instead of mapping the system.

🔴 **FOUR THINGS THAT FEEL LIKE MEASUREMENTS AND ARE CLAIMS.** (1) A **structural check** — parses, no
duplicate ids, sane bytes — grades the FILE; ugly, generic and teaches-nothing pass every one.
(2) A **generated diagram** inherits the generator's canvas palette, so valid output FEELS styled —
grep the emission (`fill="#`, `font-family=`) and view it in BOTH themes. (3) A **close-out marker**
is a claim about the run written in the register of a measurement. (4) 🔴 **A MERGE IS NOT A DEPLOY** —
`MERGED`, a green run and a Vercel `READY` describe the pipeline's INPUT; the artifact is the URL
Tyler opens, so poll it for a string only the new build contains.

**The deploy is not done until the live URL serves the change.** `curl -s <url> | grep -c <marker>` is
the whole check. Three unrelated mechanisms produce the identical symptom *the site did not change* and
none announces itself — an unseated commit author, a hung job starving the runner pool, and a global
`npm install -g` that exits 0 while the next step dies at 127. All three fired on one merge on
2026-08-19 and the third had frozen production for two days; the mechanisms and run ids are in
the case.

**Look at a visual in BOTH themes before publishing it.** A defect that hides in the theme you happen
to be in is invisible to exactly half the people who open it, and dark mode hid all three of
2026-08-19's. For a generated diagram the strip pass must remove **every** `font-family` presentation
attribute (not just the one string the skill names) and remap text fills to tokens — a CSS
`font-family` on the `<svg>` loses to a presentation attribute on each `<text>`.

**Exercise the artifact the acceptance criterion names, this session, before claiming anything.**
Curl the deploy · render it and look · run the binary · read the real sink (the API response, the
live page), never the runner's self-report. A build proves the source compiles — it constrains
nothing about what the running thing does, and they are claims about different objects.
When the only proof in hand is a green build, the honest report is **"builds clean, not yet verified
live"**, and the next action is to go exercise it — not to compose a completion sentence.
🔴 **ON A VISUAL, TWO STEPS PAST "IT RENDERS."** `dot -Tpng` renders directly, so an empty probe for a
viewing tool is a claim about the probe. **(a)** Look at it and answer in words: *what does a reader
understand from this that the adjacent paragraph does not say?* "Nothing" = decoration, does not ship.
**(b)** A completeness claim ("every component") is an acceptance criterion — enumerate from source,
never from memory. The bar is `start-planning.md`'s artifact bar and it applies to PUBLIC surfaces
too. **A bad diagram on a public surface is worse than none: remove it, never leave it live while a
better one is made.**
🔴 **A CLOSE-OUT MARKER IS SETTLED BY TWO `gh` CALLS** — `issue view --json state,closedAt` and
`pr view --json body`. Marker says closed + issue is OPEN → the marker is wrong. **Fix the detector,
not the comment.**
🔴 **And "merged" is a claim about a DIFF, not about your line.** Before reporting any merge, run
`git show --stat <sha>` and check the deploy ran (`gh run list --workflow=<deploy> --limit 1`). A
grep proving *your* symbol landed says nothing about the other 1,186 lines a stale tree carried in.

🔴 **A ✔ FROM ANOTHER AGENT IS A CLAIM, NOT EVIDENCE — RE-RUN THE ACCEPTANCE COMMAND** (2026-08-14). The
runner's ✔ is earned by *a merged PR that closes the issue*; that rule catches a run shipping NOTHING and
has no answer for a run shipping the WRONG thing. #5487 merged a real PR, earned a legitimate ✔, and left
the one credential it existed to fix failing byte-identically. One `mint-token.sh` overturned four stacked
green signals. **Before relaying any dispatched ✔, run the criterion's own command.**

🔴 **UNVERIFIED CLOSES COMPOUND ACROSS A CHAIN, AND THE SECOND SIGNAL IS "TYLER ASKS AGAIN"**
(2026-09-08). Four dependent issues in one plan (PLAN-291) each closed on their own close-out comment;
none was independently re-queried against live data before I marked the plan's data-truth gate
"resolved" in the artifact. The compounding is invisible because accepting issue N's close felt locally
reasonable — issue N-1 in the same chain was "already verified." A live warning comment, posted by a
sibling investigation directly onto the closing issue before it closed, was never read as a blocker
because a comment on a CLOSED issue reads as settled history, not an open gate. **When Tyler challenges
the same data-truth claim a SECOND time, that is the signal the scoped-patch loop isn't converging — the
correct response is an independent adversarial re-audit from scratch (ideally a fork explicitly told not
to trust prior close-outs), not another targeted fix issue.** Before marking a plan-level gate
"resolved," read every comment on the closing issue, not just its close-out marker.

🔴 **AN AUTOMATED CHECK OF THE RENDERING CAN ITSELF BE A PROXY — AND THE USER'S EYES OUTRANK IT**
(2026-08-15). The clauses above push from "structural check" to "render it and look"; this is the next
edge, and it cost SIX rounds. I diffed two screenshots of an animated page, got "changing: true", and
told Tyler it animated while he told me six times it did not. The diff was measuring the one layer that
still moved and reporting it as proof about the layer he was watching, which a `var`-hoisting shadow had
frozen. **When a user reports something broken and my instrument disagrees, the instrument is wrong until
proven otherwise: re-aim it at the exact element named** (teal dot pixels, not whole-canvas delta — that
one measurement settled it: 15285/15285/15285 before, 12086/13291/14957 after). **And reproduce their
ENVIRONMENT** — `prefers-reduced-motion` silently disables rAF work and never appeared in my local runs.

🔴 **A DEMO ARTIFACT MUST STATE WHAT ITS DATA IS, UNPROMPTED AND LEADING** (2026-08-15). Fifteen
iterations into a dashboard fed by synthetic data, Tyler asked *"Is this the actual data? or are you just
using mock data?"* — a balanced "what's real / what's placeholder" banner is structurally invisible, and
every republish that raised the fidelity widened the gap between how real it LOOKS and how real it IS.
**Lead with the strongest true statement** ("none of this data is real, and it cannot be yet — and here
is why"), **disclose the DATA and the RENDERING separately**, and treat a fidelity increase as a trigger
to strengthen the caveat.

🔴 **A VERIFY that produced only `.md` has verified nothing**, whatever its close-out says — and a missing
verdict JSON is NOT a pass. Both are silent by construction: `verify-verdict.sh` files blockers *from* the
file, so absent reads as PASS. **Write the acceptance as a COMMAND AND ITS EXPECTED OUTPUT**, never a
description: a criterion satisfiable by writing prose is not a criterion.

## Cost when it fired
🔴 **2026-08-17, the PUBLIC one:** docs.utopiamodels.ai shipped architecture diagrams that cleared
every structural check and rendered fine. Tyler opened the live public wiki — the surface built so
outsiders and agents read it — and led with *"these architecture diagrams look terrible."* Third
diagram complaint in four days, and the first on a surface anyone can see. They come OFF the site;
the standard for putting one back is that he wants to look at it.
🔴 **2026-08-14, PLAN-166:** T3 closed ✔ with a merged PR; its credential
(`webmasters.readonly` domain-wide delegation) still returned `unauthorized_client`, unchanged. Its VERIFY
closed on a **docs-only PR** — the runner printed *"changed only `.md` files, but the issue's Acceptance
names `render`"* and closed anyway — and wrote **no verdict JSON** on either box. Four green signals, one
broken credential, no layer looking past the one below it. Tyler found it by reading `0 of 1 closed` on the
OCC. ·
Four times in seven weeks, captured each time, compacted only on the fourth.
**2026-07-23:** claimed *"deleted 58 messages"*, deleted **zero** — the count was a script bug.
**2026-08-02:** reported a turn complete with tasks 4–5 of an approved 6-task plan undone and 9
sub-issues unstarted. **2026-08-03:** wrote rawphones.com into a **VC application** as "live and
clean"; it shipped six identical `raw phone` cards, never rendered. **2026-08-09**, Tyler: *"you keep
reporting a task as done when only the build is green. Done means you exercised the live artifact.
Stop doing that."*
**2026-08-13, the worst:** reported a 2-line label change shipped by reading the symbol on
`origin/main`. The PR carried **1,188 deletions** that removed six exports its own components still
import, so `main` was unbuildable and the prod deploy had been red for **34 hours** — undetected until
Tyler read a stale word on the OCC. One `git show --stat` would have shown six changed files.
**2026-08-14, twice in one artifact:** published a diagram captioned as showing *every component* that
omitted the entry point, the frame it loads, and all three STEP ZERO commands — and drew step 1's order
backwards, reproducing the exact error its source file had been corrected for **24 hours earlier** in a
red-flagged note I had not opened. Then shipped the corrected version **without ever looking at it**;
Tyler screenshotted it back: *"it is just very disorganized right now."* Labels sat on boundary lines
and one edge crossed the full canvas width. `dot -Tpng` + read the image found all four defects in
ninety seconds — a loop available the whole time.
