#!/usr/bin/env bash
# Fail a change that edits a docs page without bumping its `updated:` date (knowledge#10739).
#
#   bash scripts/check-updated.sh <base-ref>        e.g. origin/main, or a PR's base sha
#
# Every `content/docs/**/*.mdx` added or modified since <base-ref> must carry `updated: YYYY-MM-DD` in its
# frontmatter, and a modified page's date must differ from the one it had at <base-ref>. The build already
# refuses a page with no date at all (lib/source.ts); this catches the edit that kept a stale one, which is
# the case the build cannot see. Mirrored `.md` files under content/docs/source/ are dated by the publish
# pipeline itself and are out of scope.
set -uo pipefail
BASE="${1:?usage: check-updated.sh <base-ref>}"
updated_of() { sed -n '1,/^---$/{/^updated:/{s/^updated:[[:space:]]*//;s/[[:space:]]*$//;p;q}}' ; }
fail=0; n=0
while IFS=$'\t' read -r st path <&9; do
  case "$path" in content/docs/*.mdx) ;; *) continue ;; esac
  n=$((n+1))
  new=$(git show "HEAD:$path" | tail -n +2 | updated_of)
  if ! printf '%s' "$new" | grep -Eq '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
    echo "✘ $path: no 'updated: YYYY-MM-DD' in its frontmatter"; fail=1; continue
  fi
  if [ "$st" = M ]; then
    old=$(git show "$BASE:$path" 2>/dev/null | tail -n +2 | updated_of)
    if [ "$new" = "$old" ]; then
      echo "✘ $path: edited but 'updated:' is still $new — bump it to the date of this change"; fail=1; continue
    fi
  fi
  echo "✓ $path: updated $new"
done 9< <(git diff --name-status --no-renames "$BASE"...HEAD | grep -E '^[AM]	')
echo "checked $n page(s)"
exit "$fail"
