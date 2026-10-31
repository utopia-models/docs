# The interview

You have already surveyed the machine. **Do not ask anything the survey answered** — assert what you
measured and let the person correct you. Asking someone what OS they are on, after reading it, is the
fastest way to lose a technical person's attention.

## How to ask

- **Ask with your harness's own interactive question tool (Claude Code `AskUserQuestion` · opencode
  `question` · Codex CLI `request_user_input` · Gemini CLI `ask_user` · Cursor's built-in
  Ask-questions tool; Claude Desktop has none — write the option list out instead).**
  If your harness is not in that list, or has no such tool: plain text, four at a time,
  waiting between rounds, options written out and the recommended one marked.
- **Rounds of no more than four.**
- **Lead with your own answer.** Every question carries your best guess from the survey, so they are
  correcting rather than composing. This is the single largest difference between an interview that
  gets real answers and one that gets shrugs.
- **Skip anything already known.** The list below is a ceiling, not a quota. A round that asks three
  questions because the survey answered the fourth is the system working.
- **Contradictions get raised immediately.** If an answer disagrees with what you measured, say so in
  that round and ask which is right. Do not collect it silently for the report.

## Who you are talking to

A senior technical person: an engineer, an analyst who writes SQL and builds decks, a founder who
still ships. They already use AI daily and have already hit its limits. They are not asking whether
this works — they are asking why theirs works less well than it should.

**So: no explaining what a model is, no enthusiasm, no reassurance.** Ask the question and take the
answer. Where they are wrong about their own setup, say so with the evidence.

---

## Round group A · The work

1. Your role, in the words your employer uses.
2. What you are accountable for delivering — the thing that gets noticed if it slips.
3. Who consumes your output: a client, an internal team, a manager, the public.
4. How many distinct projects or clients you are carrying right now.
5. Which one takes the most time, and whether they are related or genuinely separate domains.
6. The shape of a normal day, hour by hour.
7. Which parts of that repeat.
8. Which parts need your judgement and could never be delegated.
9. What you do that a peer at your level does not.
10. The longest-running thing you own.

## Round group B · Current AI use

11. Which tools in a normal week; which you reach for first, and why that one.
12. Roughly how many sessions a day.
13. What you use it for most.
14. What you have tried and given up on. **Ask this one directly** — it is where the real limits are.
15. What it gets wrong often enough that you no longer trust it there.
16. What context you paste repeatedly.
17. How long a session runs before you start a new one, and what makes you start over.
18. Whether it has lost track mid-task, and what happened.
19. Whether you use it inside other applications.
20. Which of the skills and rules on this machine you believe are firing. **Then tell them which ones
    actually would** — you read the descriptions during the survey. This is usually the moment the
    conversation gets real.

## Round group C · Knowledge and files

21. Where your project notes live; one place or several.
22. Whether the same fact is written in more than one place.
23. How you find out when two of your notes disagree.
24. What you re-explain every single session.
25. Which files you reference by pasting a path, and whether those paths change.
26. What you call those files out loud.
27. Where finished work goes; where drafts go.
28. Whether any of it is in version control.
29. The file you would be most upset to lose.
30. Whether any data here may not leave the machine — contractually, or by your employer's judgement.

## Round group D · Friction

**Ask these concretely.** *"What is annoying"* gets a shrug; *"what did you do twice yesterday"* gets
the truth.

31. What you did more than once yesterday that a machine could have done.
32. The most tedious recurring task in your month.
33. What takes longest that should be fast.
34. What you procrastinate on, and what specifically makes it unpleasant.
35. What breaks regularly, and what you do when it breaks.
36. What you check manually that should alert you instead.
37. What you copy between two systems.
38. What you produce on a schedule.
39. What you keep in your head that should be written down.
40. What you recently had to re-derive because nobody recorded it.

## Round group E · Constraints

41. Whether you can install software on this machine.
42. Your employer's actual policy on AI tools, and whether there is an approved list.
43. Whether data from here may reach a third-party service.
44. Whether anything must never be automated, for compliance reasons.
45. Whether anyone else works in the same files.
46. Your backup situation.
47. The worst realistic outcome if something went wrong.

## Round group F · Direction

48. What your job looks like in three months if this works.
49. What you want to stop doing entirely.
50. Whether you are chasing speed, accuracy, or relief from tedium — ranked.
51. How much you want to be able to change yourself later, without help.
52. What would make you say this was worth doing.
53. **What I should have asked and did not.**

---

## Stopping

Stop when you can write the four sections of the intake file, not when you reach 53. A short
interview that produced a real `WHAT CONTRADICTS` section beats a complete one that produced a survey
transcript.
