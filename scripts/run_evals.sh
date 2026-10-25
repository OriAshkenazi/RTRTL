#!/usr/bin/env bash
# Run evals/rtrtl against one version of the skill, inside a throwaway plugin wrapper.
# Usage: scripts/run_evals.sh [--ref <git-ref>] [--out <dir>] [claude plugin eval options...]
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
ref=''
out=''
while [ $# -gt 0 ]; do
  case "$1" in
    --ref) ref=$2; shift 2 ;;
    --out) out=$2; shift 2 ;;
    *) break ;;
  esac
done

out=${out:-$(mktemp -d "${TMPDIR:-/tmp}/rtrtl-evals.XXXXXX")}
rm -rf "$out/skills" "$out/evals"
mkdir -p "$out/.claude-plugin" "$out/skills"
if [ -n "$ref" ]; then
  git -C "$root" archive "$ref" skills/rtrtl | tar -x -C "$out"
else
  cp -R "$root/skills/rtrtl" "$out/skills/"
fi
cp -R "$root/evals/rtrtl" "$out/evals"
printf '{"name": "rtrtl", "version": "0.0.0-eval", "license": "MIT"}\n' > "$out/.claude-plugin/plugin.json"

echo "Skill: ${ref:-working tree} · wrapper: $out" >&2
cd "$out"
exec claude plugin eval . --eval-dir evals --no-publish --runs "${RTRTL_EVAL_RUNS:-1}" "$@"
