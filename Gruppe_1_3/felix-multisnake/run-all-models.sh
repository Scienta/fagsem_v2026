#!/bin/bash
# Run all GitHub Copilot models in parallel, each creating a snake game.
# Results go into per-model subdirectories.

MODELS=(
  github-copilot/claude-haiku-4.5
  github-copilot/claude-opus-4.5
  github-copilot/claude-opus-4.6
  github-copilot/claude-opus-4.7
  github-copilot/claude-sonnet-4
  github-copilot/claude-sonnet-4.5
  github-copilot/claude-sonnet-4.6
  github-copilot/gemini-2.5-pro
  github-copilot/gemini-3-flash-preview
  github-copilot/gemini-3.1-pro-preview
  github-copilot/gpt-4.1
  github-copilot/gpt-4o
  github-copilot/gpt-5-mini
  github-copilot/gpt-5.2
  github-copilot/gpt-5.2-codex
  github-copilot/gpt-5.3-codex
  github-copilot/gpt-5.4
  github-copilot/gpt-5.4-mini
  github-copilot/grok-code-fast-1
)

PROMPT="Create a single self-contained HTML file called index.html with a fully playable Snake game. It must include all HTML, CSS, and JS inline. Requirements: arrow key controls, score display, game over detection, ability to restart, and it should look polished."

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
PIDS=()

echo "Launching ${#MODELS[@]} models in parallel..."
echo ""

for MODEL in "${MODELS[@]}"; do
  DIR_NAME="${MODEL#github-copilot/}"
  DIR="$BASE_DIR/$DIR_NAME"
  mkdir -p "$DIR"

  # Remove old file so we get a fresh generation
  rm -f "$DIR/index.html"

  echo "  Starting: $DIR_NAME"
  (
    START=$(date +%s)
    opencode run \
      -m "$MODEL" \
      --dir "$DIR" \
      --format json \
      --dangerously-skip-permissions \
      "$PROMPT" \
      > "$DIR/agent-output.json" 2>&1
    END=$(date +%s)
    ELAPSED=$(( END - START ))

    # Extract token usage by summing all step_finish events
    INPUT_TOKENS=$(grep '"type":"step_finish"' "$DIR/agent-output.json" 2>/dev/null \
      | sed 's/.*"input":\([0-9]*\).*/\1/' | awk '{s+=$1} END {print s+0}')
    OUTPUT_TOKENS=$(grep '"type":"step_finish"' "$DIR/agent-output.json" 2>/dev/null \
      | sed 's/.*"output":\([0-9]*\).*/\1/' | awk '{s+=$1} END {print s+0}')
    REASONING_TOKENS=$(grep '"type":"step_finish"' "$DIR/agent-output.json" 2>/dev/null \
      | sed 's/.*"reasoning":\([0-9]*\).*/\1/' | awk '{s+=$1} END {print s+0}')
    CACHE_WRITE=$(grep '"type":"step_finish"' "$DIR/agent-output.json" 2>/dev/null \
      | sed 's/.*"write":\([0-9]*\).*/\1/' | awk '{s+=$1} END {print s+0}')
    CACHE_READ=$(grep '"type":"step_finish"' "$DIR/agent-output.json" 2>/dev/null \
      | sed 's/.*"read":\([0-9]*\).*/\1/' | awk '{s+=$1} END {print s+0}')
    TOTAL_TOKENS=$(grep '"type":"step_finish"' "$DIR/agent-output.json" 2>/dev/null \
      | sed 's/.*"total":\([0-9]*\).*/\1/' | awk '{s+=$1} END {print s+0}')

    # Write a small summary file for easy parsing later
    cat > "$DIR/stats.txt" <<STATS
model=$DIR_NAME
elapsed_seconds=$ELAPSED
input_tokens=$INPUT_TOKENS
output_tokens=$OUTPUT_TOKENS
reasoning_tokens=$REASONING_TOKENS
cache_write_tokens=$CACHE_WRITE
cache_read_tokens=$CACHE_READ
total_tokens=$TOTAL_TOKENS
STATS

    if [ -f "$DIR/index.html" ]; then
      SIZE=$(wc -c < "$DIR/index.html")
      LINES=$(wc -l < "$DIR/index.html")
      echo "  DONE: $DIR_NAME  (${ELAPSED}s, ${SIZE}B, in:${INPUT_TOKENS} out:${OUTPUT_TOKENS} reason:${REASONING_TOKENS} total:${TOTAL_TOKENS})"
    else
      echo "  FAIL: $DIR_NAME  (${ELAPSED}s, no index.html produced)"
    fi
  ) &
  PIDS+=($!)
done

echo ""
echo "All ${#MODELS[@]} models launched. Waiting for completion..."
echo ""

for PID in "${PIDS[@]}"; do
  wait "$PID"
done

echo ""
echo "=== All models finished ==="
echo ""

# Summary table
printf "%-25s %6s %6s %6s %5s %8s %8s %8s %8s %8s\n" \
  "MODEL" "STATUS" "BYTES" "LINES" "TIME" "IN_TOK" "OUT_TOK" "REASON" "TOTAL" "CACHE_R"
printf "%-25s %6s %6s %6s %5s %8s %8s %8s %8s %8s\n" \
  "-------------------------" "------" "------" "------" "-----" "--------" "--------" "--------" "--------" "--------"
for MODEL in "${MODELS[@]}"; do
  DIR_NAME="${MODEL#github-copilot/}"
  DIR="$BASE_DIR/$DIR_NAME"

  # Read stats
  ELAPSED="-"; IN="-"; OUT="-"; REASON="-"; TOTAL="-"; CREAD="-"
  if [ -f "$DIR/stats.txt" ]; then
    ELAPSED=$(grep elapsed_seconds "$DIR/stats.txt" | cut -d= -f2)
    IN=$(grep input_tokens "$DIR/stats.txt" | cut -d= -f2)
    OUT=$(grep output_tokens "$DIR/stats.txt" | cut -d= -f2)
    REASON=$(grep reasoning_tokens "$DIR/stats.txt" | cut -d= -f2)
    TOTAL=$(grep total_tokens "$DIR/stats.txt" | cut -d= -f2)
    CREAD=$(grep cache_read_tokens "$DIR/stats.txt" | cut -d= -f2)
  fi

  if [ -f "$DIR/index.html" ]; then
    SIZE=$(wc -c < "$DIR/index.html")
    LINES=$(wc -l < "$DIR/index.html")
    printf "%-25s %6s %6s %6s %4ss %8s %8s %8s %8s %8s\n" \
      "$DIR_NAME" "OK" "$SIZE" "$LINES" "$ELAPSED" "$IN" "$OUT" "$REASON" "$TOTAL" "$CREAD"
  else
    printf "%-25s %6s %6s %6s %4ss %8s %8s %8s %8s %8s\n" \
      "$DIR_NAME" "FAIL" "-" "-" "$ELAPSED" "$IN" "$OUT" "$REASON" "$TOTAL" "$CREAD"
  fi
done
