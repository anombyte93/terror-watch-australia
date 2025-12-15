#!/bin/bash
cd "$(dirname "$0")"
exec > >(tee -a "../logs/task-01-project-setup.log") 2>&1

echo "═══════════════════════════════════════════"
echo "🤖 CODEX AGENT: task-01-project-setup"
echo "Started: $(date)"
echo "═══════════════════════════════════════════"
echo ""

# Run codex
if command -v codex &>/dev/null; then
    timeout 7200 codex exec \
        --dangerously-bypass-approvals-and-sandbox \
        --skip-git-repo-check \
        -C "$(pwd)" \
        - < _PROMPT.md
    EXIT_CODE=$?
else
    echo "⚠️  Codex CLI not found, using claude instead..."
    timeout 7200 claude --dangerously-skip-permissions -p "$(cat _PROMPT.md)"
    EXIT_CODE=$?
fi

echo ""
echo "═══════════════════════════════════════════"

# Write completion signal
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "none")
FILES=$(git diff --name-only HEAD~1 2>/dev/null | wc -l || echo "0")

if [ $EXIT_CODE -eq 0 ]; then
    echo '{"status":"complete","commit":"'$COMMIT'","files":'$FILES'}' > .sprint-complete.json
    git add -A && git commit -m "✅ task-01-project-setup complete" 2>/dev/null || true
    echo "✅ AGENT COMPLETE: task-01-project-setup"
else
    echo '{"status":"failed","exit_code":'$EXIT_CODE'}' > .sprint-complete.json
    echo "❌ AGENT FAILED: task-01-project-setup (exit $EXIT_CODE)"
fi

echo "Finished: $(date)"
