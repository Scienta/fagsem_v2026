# Multisnake

A benchmark comparing how 19 different AI models (via GitHub Copilot) implement the same prompt:

> *"Create a single self-contained HTML file with a fully playable Snake game."*

Each model gets its own directory with the generated `index.html`. A top-level viewer lets you flip between them and compare.

## Quick Start

```bash
open index.html
```

Use the dropdown or **Prev / Next** buttons to switch models. **Alt+Arrow keys** navigate without interfering with in-game controls. Badges in the toolbar show each model's key traits at a glance.

## Reproducing

The script launches all 19 models in parallel via `opencode run`, captures JSON output, and extracts token usage:

```bash
./run-all-models.sh
```

Requirements: [OpenCode](https://opencode.ai) with a GitHub Copilot provider configured.

## Results

| Model | Status | Size (B) | Lines | Time (s) | Input Tok | Output Tok | Reasoning Tok | Total Tok | Cache Read |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| claude-haiku-4.5 | OK | 15,124 | 500 | 39 | 6 | 4,683 | 0 | 35,379 | 13,154 |
| claude-opus-4.5 | OK | 10,714 | 406 | 50 | 2 | 3,928 | 0 | 34,020 | 13,151 |
| claude-opus-4.6 | OK | 5,031 | 124 | 58 | 3 | 2,200 | 0 | 30,622 | 13,152 |
| claude-opus-4.7 | OK | 11,831 | 467 | 81 | 7 | 6,042 | 0 | 66,386 | 36,399 |
| claude-sonnet-4 | OK | 12,214 | 376 | 67 | 20 | 4,832 | 0 | 81,594 | 58,384 |
| claude-sonnet-4.5 | OK | 12,659 | 428 | 51 | 6 | 4,071 | 0 | 34,201 | 21,819 |
| claude-sonnet-4.6 | OK | 9,611 | 332 | 63 | 3 | 3,877 | 0 | 33,879 | 13,151 |
| gemini-2.5-pro | OK | 7,231 | 227 | 37 | 14,369 | 2,215 | 0 | 28,047 | 11,463 |
| gemini-3-flash-preview | OK | 9,234 | 300 | 27 | 26,405 | 2,878 | 0 | 29,283 | 0 |
| gemini-3.1-pro-preview | OK | 9,922 | 341 | 49 | 26,574 | 2,823 | 0 | 29,397 | 0 |
| gpt-4.1 | FAIL | - | - | 144 | 10,620 | 2,768 | 0 | 13,388 | 0 |
| gpt-4o | FAIL | - | - | 39 | 10,662 | 1,500 | 0 | 24,194 | 12,032 |
| gpt-5-mini | OK | 14,319 | 381 | 134 | 13,541 | 5,796 | 0 | 30,985 | 11,648 |
| gpt-5.2 | OK | 25,066 | 841 | 275 | 19,111 | 8,956 | 639 | 57,250 | 28,544 |
| gpt-5.2-codex | OK | 14,070 | 514 | 98 | 23,193 | 5,316 | 64 | 62,109 | 33,536 |
| gpt-5.3-codex | OK | 12,950 | 489 | 89 | 8,996 | 4,935 | 306 | 29,469 | 15,232 |
| gpt-5.4 | OK | 16,349 | 625 | 138 | 19,837 | 6,858 | 812 | 81,907 | 54,400 |
| gpt-5.4-mini | OK | 12,735 | 457 | 42 | 12,772 | 4,830 | 218 | 39,836 | 22,016 |
| grok-code-fast-1 | BROKEN | 5,635 | 193 | 33 | 11,403 | 1,419 | 0 | 26,180 | 13,358 |

## Analysis

### Broken / Non-Playable (3 of 19)

| Model | Issue |
|---|---|
| **gpt-4.1** | Failed to produce any `index.html` |
| **gpt-4o** | Failed to produce any `index.html` |
| **grok-code-fast-1** | Instant game over on first tick -- snake starts stationary (dx=0, dy=0) with length 1, so the head is placed at its own position, triggering self-collision before the player can press a key. Food also doesn't avoid the snake body. Uses deprecated `keyCode`. |

### Similarity Groups

**Group A -- "Purple Glassmorphism"** (`#667eea` / `#764ba2` background):
- **claude-sonnet-4** and **claude-sonnet-4.5** are the most similar pair in the set. Same purple gradient, same teal/red colors (`#4ecdc4`, `#ff6b6b`), both `setInterval`, both lack a `nextDirection` buffer (direction race-condition bug), both start with length 1 stationary.
- **claude-haiku-4.5** shares the purple background but adds levels, speed increase, and snake eyes.
- **grok-code-fast-1** also uses the same palette but is broken and far simpler.

**Group B -- "Dark Navy Canvas"** (`#1a1a2e` / `#0f3460`):
- **claude-opus-4.5** and **gemini-3.1-pro-preview** share the same dark navy + teal (`#4ecca3`) + red food scheme.
- **claude-opus-4.6** uses the same dark base but with a cyan (`#0ff`) accent.

**Group C -- "Tailwind-esque Dark"** (`#0f172a` / `#4ade80` / `#22d3ee`):
- **claude-opus-4.7** and **claude-sonnet-4.6** both use 24-cell grids, WASD + arrows, green-to-cyan gradients from the Tailwind palette, and `R` key restart.
- **gpt-5.3-codex** uses the same color family with a checkerboard grid.

**Group D -- "GPT-5.x rAF Family"**:
- **gpt-5.2**, **gpt-5.2-codex**, **gpt-5.3-codex**, **gpt-5.4**, **gpt-5.4-mini** all use `requestAnimationFrame` with delta/accumulator timing, `localStorage` high scores, and dark blue-navy backgrounds. Same architectural DNA, varying polish.

**Group E -- "Minimal / Clean"**:
- **gemini-2.5-pro** and **grok-code-fast-1** are the simplest (`setInterval` 100ms, 20x20, no frills), but grok is broken.

### Standouts

| Category | Winner | Why |
|---|---|---|
| Most polished | **gpt-5.2** | 841 lines, DPR-aware canvas, ARIA regions, auto-pause on blur, smart tail collision, win detection |
| Best architecture | **claude-opus-4.7** | State machine (MENU/PLAYING/PAUSED/OVER), rAF, WASD+arrows, pause, keyboard hints |
| Most compact | **claude-opus-4.6** | 124 lines, fully playable and polished |
| Most unique | **gpt-5.2-codex** | Only wrap-around walls (no wall death), "Neon Serpent" branding, snake eyes |
| Fastest completion | **gemini-3-flash-preview** | 27s, solid result with start screen + localStorage high score |
| Buggiest (playable) | **claude-sonnet-4** | Direction race condition, always-running loop, partial food avoidance |

### Feature Matrix

| Feature | haiku 4.5 | opus 4.5 | opus 4.6 | opus 4.7 | sonnet 4 | sonnet 4.5 | sonnet 4.6 | gem 2.5 | gem 3-flash | gem 3.1 | 5-mini | 5.2 | 5.2-cdx | 5.3-cdx | 5.4 | 5.4-mini | grok |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Playable | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | N |
| Game loop | sTO | sI | sI | rAF | sI | sI | sI | sI | sI | sTO | rAF | rAF | rAF | rAF | rAF | rAF | sI |
| Speed ramp | Y | Y | - | Y | - | - | - | - | - | Y | Y | Y | Y | Y | Y | - | - |
| WASD | - | - | - | Y | - | - | Y | Y | - | - | Y | - | - | - | - | - | - |
| Pause | - | - | - | Y | Y | - | - | - | - | - | Y | Y | - | - | - | - | - |
| Start screen | - | Y | Y | Y | - | - | Y | - | Y | - | - | Y | - | - | Y | Y | - |
| High score | Y | Y | - | Y | Y | Y | - | - | Y | - | Y | Y | Y | Y | Y | Y | - |
| Wrap walls | - | - | - | - | - | - | - | - | - | - | - | - | Y | - | - | - | - |
| Snake eyes | Y | Y | - | Y | - | - | - | - | - | - | - | - | Y | Y | Y | - | - |
| Mobile | - | - | - | - | - | - | - | - | - | - | Y | - | Y | - | - | - | - |
| Dir buffer | Y | Y | Y | Y | - | - | Y | - | Y | Y | Y | Y | Y | Y | Y | Y | Y |

**Legend:** sI = setInterval, sTO = setTimeout, rAF = requestAnimationFrame

## Project Structure

```
multisnake/
  index.html              # Viewer with model selector + iframe
  run-all-models.sh       # Benchmark script
  README.md
  <model-name>/
    index.html            # Generated snake game
    agent-output.json     # Raw opencode JSON event stream
    stats.txt             # Parsed token/timing stats
```
