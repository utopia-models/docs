# Environment survey — the commands, per platform

You are running this because a meta prompt told you to. Work through it, record what each command
actually printed, and **never assume a command exists** — check first, and say "not available" rather
than inventing a result.

## 0 · What am I?

```
uname -srm
cat /etc/os-release 2>/dev/null | head -3
```

**WSL detection** — three independent signals, because any one of them can be absent:

```
grep -qi microsoft /proc/version && echo "WSL"
test -e /run/WSL && echo "WSL2 runtime present"
ls /mnt/c >/dev/null 2>&1 && echo "Windows drive mounted at /mnt/c"
```

**Container detection:**

```
test -f /.dockerenv && echo "inside a container"
grep -qa 'docker\|containerd' /proc/1/cgroup 2>/dev/null && echo "container cgroup"
```

**Remote or local:** `test -n "$SSH_CONNECTION" && echo "reached over ssh"`

**If this is WSL, record whether systemd is running** — a whole class of "keep it going after I
close the terminal" answers depends on it:

```
ps -p 1 -o comm=
systemctl --user is-system-running 2>&1 | head -1
```

`init` rather than `systemd` means it is off. That is a prerequisite, not something to fix here —
the *Setting up Claude Code in WSL* module covers it. Record which state this machine is in and move
on.

## 1 · The shell and the PATH

```
echo "$SHELL"
echo "$PATH" | tr ':' '\n'
```

🔴 **PATH is not one thing.** A login shell, a non-interactive shell and a shell started over ssh get
different PATHs, and a tool installed under `~/.nvm` or `~/.local/bin` is often missing from the
narrowest of them. Check the difference explicitly, because it is the reason a job that works when
typed by hand fails when something else starts it:

```
bash -lc 'command -v node' ; bash -c 'command -v node'
```

## 2 · What is installed

Check each, and record the PATH as well as the version — a second copy of a tool at a different path
is a real finding:

```
for c in node npm pnpm yarn git curl wget jq python3 pip3 docker systemd-run gh code; do
  printf '%-12s %s\n' "$c" "$(command -v $c 2>/dev/null || echo ABSENT)"
done
```

🔴 **Do not treat `jq` as present.** It is missing from a default Ubuntu and from most fresh WSL
installs. Anything you write that parses JSON must either check for it or use `python3 -c`.

**Claude Code** — you are running inside it, so record its version and where it is installed:

```
claude --version 2>/dev/null
command -v claude
ls -d ~/.claude 2>/dev/null
```

## 3 · Configuration that is already loaded

Find every file Claude Code reads at session start and **read each one**. Record the path, the byte
size, and what it actually asserts.

```
ls -la ~/.claude/ 2>/dev/null
wc -c ~/.claude/CLAUDE.md 2>/dev/null
ls ~/.claude/skills/ ~/.claude/rules/ ~/.claude/hooks/ ~/.claude/agents/ 2>/dev/null
find . -maxdepth 3 \( -name 'CLAUDE.md' -o -name 'CLAUDE.local.md' -o -name 'AGENTS.md' \) 2>/dev/null | head
ls .claude/rules/ .claude/skills/ .claude/agents/ 2>/dev/null
ls -la .mcp.json .claude/settings.json .claude/settings.local.json ~/.claude/settings.json 2>/dev/null
python3 -c 'import json,sys
for f in sys.argv[1:]:
    try: d=json.load(open(f))
    except Exception: continue
    print(f, "hooks:", list((d.get("hooks") or {}).keys()))' ~/.claude/settings.json .claude/settings.json .claude/settings.local.json
```

🔴 **`AGENTS.md` loads only when no `CLAUDE.md` does.** Claude Code reads a repository's `AGENTS.md`
as its project instructions when there is no `CLAUDE.md`, `.claude/CLAUDE.md` or `CLAUDE.local.md` in
the working directory or above it; by default, once one of those exists, `AGENTS.md` is not read
unless a `CLAUDE.md` imports it or the *Project instructions* setting was changed. If you find both, say which one is actually loading — two instruction files
that drift apart, one of them unread, is a real finding.

🔴 **A skill or rule whose description does not say WHEN to use it never fires.** For every one you
find, quote its description and judge it: would an agent, mid-task, reading only that description,
decide to invoke it? Name the ones that would not. They exist and do nothing, and their owner almost
certainly believes they work.

## 4 · Reach

```
ls -d ~/ ~/dev ~/projects ~/code 2>/dev/null
git -C . remote -v 2>/dev/null
cat ~/.claude.json 2>/dev/null | python3 -c 'import sys,json; d=json.load(sys.stdin); print("mcp servers:", list((d.get("mcpServers") or {}).keys()))' 2>/dev/null
env | grep -iE 'proxy|_ca_|cert' | sed 's/=.*/=<set>/'
```

🔴 **Report that a credential file EXISTS and where. Never read its contents, never print a value.**

**Corporate management** — any of these means installs and network paths may be constrained:

```
ls /usr/local/share/ca-certificates/ 2>/dev/null | head
test -f /etc/apt/apt.conf.d/proxy.conf && echo "apt proxy configured"
command -v jamf mdmclient intune 2>/dev/null
```

## 5 · Capacity

```
nproc ; free -h | head -2 ; df -h ~ | tail -1
```

---

## What to do with all of this

Write it into the `## WHAT IS` section of your intake file, **each fact with the command that produced
it**, so the person reading can re-run any line and check you. Where a check was inconclusive, write
"inconclusive" — never fill the gap with what is usually true.
