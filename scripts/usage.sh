#!/usr/bin/env bash
# usage.sh — who read docs.utopiamodels.ai, from Vercel's request log.
#
#   bash scripts/usage.sh [hours]        # default 24
#
# Prints one row per (link tag, path, network, user-agent) with its request count, for every read of a page
# or a machine-readable twin (`/`, `/docs/*`, `*.md`, `/llms*.txt`) and of `/resume.pdf`. The link tag is
# the `?r=<tag>` on a URL handed to a recipient; a request without one is `untagged`. The network is the name of the
# network the request came from: the fleet's own checks all come from one network and carry no tag,
# so the network column is what separates them from a recipient who dropped the tag.
#
# 🔴 THE REQUEST LOG IS SHORT-LIVED. Measured 2026-10-04 on this team's plan: a window starting one
# day back returned rows, a window starting three days back returned none. So this answers "did
# that request arrive" and "what happened today" — it cannot answer "what happened this week". The
# durable record is the `read` event `proxy.ts` sends to Web Analytics; see README, "Usage".
#
# The token is read from $VERCEL_TOKEN, else from the fleet's secret store. It is never printed.
set -euo pipefail

HOURS="${1:-24}"
PROJECT=prj_1rxHmBWTNRXgITkJtValFgrkpbJG
TEAM=team_gq5tNzvoKbKNK0pyDJtAqqUU
HOST=docs.utopiamodels.ai

TOKEN="${VERCEL_TOKEN:-}"
if [ -z "$TOKEN" ] && [ -x "$HOME/.claude/scripts/infisical-get.sh" ]; then
  TOKEN="$(bash "$HOME/.claude/scripts/infisical-get.sh" fleet-infra VERCEL_TOKEN prod)" || TOKEN=""
fi
[ -n "$TOKEN" ] || { echo "usage.sh: no VERCEL_TOKEN in the environment or the secret store" >&2; exit 2; }

end=$(($(date +%s) * 1000))
start=$((end - HOURS * 3600 * 1000))
rows="$(mktemp)"
hdr="$(mktemp)"
trap 'rm -f "$rows" "$hdr"' EXIT
# The token goes to curl in a config file, never as an argument: an argument is readable by every
# user on the box through the process list for as long as the request runs.
printf 'header = "Authorization: Bearer %s"\n' "$TOKEN" >"$hdr"

# 🔴 THE LOG IS WALKED BY TIME, NOT BY PAGE NUMBER. Measured 2026-10-04: `page=0`, `page=1` and
# `page=2` returned the same 50 rows byte for byte, each with `hasMoreRows: true` — so a loop that
# raised `page` never ended once the log held more than 50 requests, and would have counted the
# same 50 again each turn. Each call returns the newest 50 rows of its window, so the next call
# ends where this one's oldest row is; rows are de-duplicated by request id below.
windows=0
while :; do
  body="$(curl -sS --fail-with-body -m 60 -K "$hdr" \
    "https://vercel.com/api/logs/request-logs?projectId=$PROJECT&teamId=$TEAM&ownerId=$TEAM&startDate=$start&endDate=$end&page=0&environment=production")" \
    || { echo "usage.sh: the request-log read failed on window $windows: $body" >&2; exit 1; }
  jq -e 'has("rows")' >/dev/null <<<"$body" \
    || { echo "usage.sh: window $windows is not a request-log page: ${body:0:200}" >&2; exit 1; }
  [ "$(jq '.rows | length' <<<"$body")" -gt 0 ] || break
  jq -c '.rows[]' <<<"$body" >>"$rows"
  [ "$(jq -r '.hasMoreRows // false' <<<"$body")" = "true" ] || break
  oldest="$(date -u -d "$(jq -r '.rows[-1].timestamp' <<<"$body")" +%s%3N)"
  # More than 50 rows in one millisecond would leave the window where it is; step past it.
  [ "$oldest" -lt "$end" ] || oldest=$((end - 1))
  end="$oldest"
  windows=$((windows + 1))
  [ "$windows" -lt 2000 ] || { echo "usage.sh: stopped after $windows windows — the log is larger than this script was measured on" >&2; exit 1; }
done

total="$(jq -s 'unique_by(.requestId) | length' "$rows")"
jq -rs --arg host "$HOST" '
  unique_by(.requestId)
  | map(select(.domain == $host and .requestMethod == "GET"
             and (.requestPath | test("^/$|^/docs(/|$)|\\.md$|^/llms(-full)?\\.txt$|^/resume\\.pdf$"))))
  | map({
      tag: ((.requestSearchParams.r // "") | if test("^[a-z0-9][a-z0-9-]{0,31}$") then . else "untagged" end),
      path: .requestPath,
      status: .statusCode,
      net: ((.asnName // "unknown") | .[0:24]),
      ua: ((.clientUserAgent // "none") | .[0:60]),
    })
  | group_by([.tag, .path, .status, .net, .ua])
  | map({n: length} + .[0])
  | sort_by(-.n)
  | (["count", "tag", "status", "path", "network", "user-agent"] | @tsv),
    (.[] | [.n, .tag, .status, .path, .net, .ua] | @tsv)
' "$rows" | column -t -s $'\t'
echo "-- $total request(s) to the project in the last ${HOURS}h; rows above are reads on $HOST"
