#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["psutil"]
# ///
"""
Gruppe 3.3 – Lokal LLM i praksis
Live observer: samples CPU/RAM from ollama process tree and extracts tokens/sec
from Ollama's server log. Run in a separate terminal alongside Claude Code + Ollama.

Usage:
  uv run benchmarks/observer.py --label "qwen3:8b – oppgave 1"

Requires OLLAMA_DEBUG=1 (or recent Ollama with INFO-level timing) for tokens/sec.
CPU and RAM are always captured regardless of log verbosity.
"""

import argparse
import csv
import datetime
import json
import os
import re
import socket
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path
from statistics import mean, median

try:
    import psutil
except ImportError:
    sys.exit("ERROR: psutil not found.\n  Install: pip install --user psutil\n  Or use:  uv run benchmarks/observer.py")


# ── hardware fingerprint ──────────────────────────────────────────────────────

def _cpu_model_name() -> str:
    try:
        for line in Path("/proc/cpuinfo").read_text().splitlines():
            if line.startswith("model name"):
                return line.split(":", 1)[1].strip()
    except Exception:
        pass
    return "unknown"


def hw_info() -> dict:
    return {
        "host": socket.gethostname(),
        "cpu_model": _cpu_model_name(),
        "cpu_threads": psutil.cpu_count(logical=True),
        "ram_total_gb": round(psutil.virtual_memory().total / 1024 ** 3, 1),
    }


# ── Ollama process tree ───────────────────────────────────────────────────────

def _find_ollama_root() -> "psutil.Process | None":
    candidates = []
    for proc in psutil.process_iter(["name", "pid", "ppid"]):
        try:
            if proc.info["name"] in ("ollama", "ollama_llama_server", "ollama_runner"):
                candidates.append(proc)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    if not candidates:
        return None
    # Return the one with the lowest PID (oldest parent in the tree)
    return min(candidates, key=lambda p: p.pid)


def _proc_tree(root: "psutil.Process") -> "list[psutil.Process]":
    try:
        return [root] + root.children(recursive=True)
    except (psutil.NoSuchProcess, psutil.AccessDenied):
        return [root]


def _sample_tree(root: "psutil.Process") -> "tuple[float, int]":
    cpu, rss = 0.0, 0
    for p in _proc_tree(root):
        try:
            cpu += p.cpu_percent()
            rss += p.memory_info().rss
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return cpu, rss


# ── Ollama API helpers ────────────────────────────────────────────────────────

def _get_json(url: str) -> dict | None:
    try:
        with urllib.request.urlopen(url, timeout=3) as r:
            return json.loads(r.read())
    except Exception:
        return None


def check_ollama(port: int) -> bool:
    return _get_json(f"http://localhost:{port}/api/tags") is not None


def detect_model(port: int) -> str:
    data = _get_json(f"http://localhost:{port}/api/ps")
    if data:
        models = data.get("models", [])
        if models:
            return models[0].get("name", "unknown")
    return "unknown"


# ── log tailer ────────────────────────────────────────────────────────────────

class LogTailer:
    """Tails Ollama server log and extracts per-generation eval metrics."""

    def __init__(self, log_path: "Path | None"):
        self._path = log_path
        self._gens: list[dict] = []   # {"ec": int, "ed_ns": int}
        self._lock = threading.Lock()
        self._running = False
        self._thread: "threading.Thread | None" = None
        self._proc: "subprocess.Popen | None" = None
        self._fh = None
        # state for multiline human-readable pattern
        self._pending_count: "int | None" = None
        self._pending_dur_s: "float | None" = None

    def start(self):
        self._running = True
        if self._path and self._path.exists():
            self._fh = open(self._path, "r", errors="replace")
            self._fh.seek(0, 2)  # start from end — only count new generations
            target = self._tail_file
        else:
            target = self._tail_journalctl
        self._thread = threading.Thread(target=target, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._proc:
            try:
                self._proc.terminate()
            except Exception:
                pass
        if self._fh:
            try:
                self._fh.close()
            except Exception:
                pass

    def generations(self) -> list[dict]:
        with self._lock:
            return list(self._gens)

    def _record(self, ec: int, ed_ns: int):
        if ec > 0 and ed_ns > 0:
            with self._lock:
                self._gens.append({"ec": ec, "ed_ns": ed_ns})

    def _parse_line(self, line: str):
        # Pattern 1: structured key=value  (OLLAMA_DEBUG=1, same line)
        #   eval_count=234 eval_duration=16325542858
        m = re.search(r"\beval_count=(\d+)\b.*?\beval_duration=(\d+)\b", line)
        if m:
            self._record(int(m.group(1)), int(m.group(2)))
            return

        # Pattern 2: JSON field on one line  (newer Ollama structured logging)
        #   {"eval_count":234,"eval_duration":16325542858,...}
        m_ec = re.search(r'"eval_count"\s*:\s*(\d+)', line)
        m_ed = re.search(r'"eval_duration"\s*:\s*(\d+)', line)
        if m_ec and m_ed:
            self._record(int(m_ec.group(1)), int(m_ed.group(1)))
            return

        # Pattern 3: human-readable verbose output (multiline, accumulate state)
        #   eval count:      234 token(s)
        #   eval duration:   16.325542858s
        #   eval rate:       14.33 tokens/s   ← flush on this line
        mc = re.search(r"\beval count:\s+(\d+)\s+token", line)
        if mc:
            self._pending_count = int(mc.group(1))

        md = re.search(r"\beval duration:\s+([\d.]+)s\b", line)
        if md:
            self._pending_dur_s = float(md.group(1))

        mr = re.search(r"\beval rate:\s+[\d.]+\s+tokens/s", line)
        if mr and self._pending_count is not None and self._pending_dur_s is not None:
            self._record(self._pending_count, int(self._pending_dur_s * 1e9))
            self._pending_count = None
            self._pending_dur_s = None

    def _tail_file(self):
        while self._running:
            line = self._fh.readline()
            if line:
                self._parse_line(line)
            else:
                time.sleep(0.1)

    def _tail_journalctl(self):
        try:
            cmd = ["journalctl", "--user-unit=ollama", "-f", "--output=cat", "-n", "0"]
            self._proc = subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
                text=True, bufsize=1,
            )
            for line in self._proc.stdout:
                if not self._running:
                    break
                self._parse_line(line)
        except FileNotFoundError:
            pass  # journalctl not available on this system


# ── resource sampler ──────────────────────────────────────────────────────────

class Sampler:
    def __init__(self, root: "psutil.Process"):
        self._root = root
        self.cpu_samples: list[float] = []
        self.rss_samples: list[int] = []
        self._running = False
        self._thread: "threading.Thread | None" = None

    def start(self):
        # Warm up cpu_percent — first call always returns 0.0
        for p in _proc_tree(self._root):
            try:
                p.cpu_percent()
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False

    def _run(self):
        while self._running:
            cpu, rss = _sample_tree(self._root)
            if rss > 0:
                self.cpu_samples.append(cpu)
                self.rss_samples.append(rss)
            time.sleep(0.5)


# ── reporting ─────────────────────────────────────────────────────────────────

CSV_FIELDS = [
    "timestamp", "host", "cpu_model", "cpu_threads", "ram_total_gb",
    "label", "model",
    "n_generations", "total_eval_tokens",
    "gen_tokens_per_sec", "p50_gen_tokens_per_sec", "e2e_tokens_per_sec",
    "cpu_mean_pct", "cpu_peak_pct",
    "rss_peak_mb", "rss_mean_mb",
    "wall_clock_s", "notes",
]


def _na(v) -> str:
    return "N/A" if v is None else str(v)


def build_report(
    label: str,
    model: str,
    hw: dict,
    gens: list[dict],
    cpu_samples: list[float],
    rss_samples: list[int],
    wall_clock: float,
    ts: str,
) -> "tuple[dict, str]":
    n_gens = len(gens)
    total_tokens = sum(g["ec"] for g in gens)

    if n_gens > 0 and total_tokens > 0:
        per_gen = [g["ec"] / (g["ed_ns"] / 1e9) for g in gens if g["ed_ns"] > 0]
        gen_tps = round(mean(per_gen), 2) if per_gen else None
        p50_tps = round(median(per_gen), 2) if per_gen else None
        e2e_tps = round(total_tokens / wall_clock, 2) if wall_clock > 0 else None
    else:
        gen_tps = p50_tps = e2e_tps = None

    cpu_mean = round(mean(cpu_samples), 1) if cpu_samples else None
    cpu_peak = round(max(cpu_samples), 1) if cpu_samples else None
    rss_peak = round(max(rss_samples) / 1024 ** 2) if rss_samples else None
    rss_mean = round(mean(rss_samples) / 1024 ** 2) if rss_samples else None

    notes = (
        ""
        if n_gens > 0
        else "0 generasjoner fanget — start Ollama med OLLAMA_DEBUG=1 for token-statistikk"
    )

    row = {
        "timestamp": ts,
        "host": hw["host"],
        "cpu_model": hw["cpu_model"],
        "cpu_threads": hw["cpu_threads"],
        "ram_total_gb": hw["ram_total_gb"],
        "label": label,
        "model": model,
        "n_generations": n_gens,
        "total_eval_tokens": total_tokens,
        "gen_tokens_per_sec": _na(gen_tps),
        "p50_gen_tokens_per_sec": _na(p50_tps),
        "e2e_tokens_per_sec": _na(e2e_tps),
        "cpu_mean_pct": _na(cpu_mean),
        "cpu_peak_pct": _na(cpu_peak),
        "rss_peak_mb": _na(rss_peak),
        "rss_mean_mb": _na(rss_mean),
        "wall_clock_s": round(wall_clock, 1),
        "notes": notes,
    }

    md_lines = [
        f'**Måling** ({ts}, "{label}"):',
        f"- Maskin: {hw['host']} — {hw['cpu_model']}, {hw['cpu_threads']} tråder, {hw['ram_total_gb']} GB RAM",
        f"- Modell: {model}",
        f"- Generasjoner i vinduet: {n_gens}",
        f"- Total generert: {total_tokens} tokens",
        f"- Gen-tokens/sek (aktiv generering, mean): {_na(gen_tps)}",
        f"- Gen-tokens/sek (p50): {_na(p50_tps)}",
        f"- E2E-tokens/sek (inkl. prompt-eval og vente-tid): {_na(e2e_tps)}",
        f"- CPU (mean/peak): {_na(cpu_mean)} % / {_na(cpu_peak)} %",
        f"- RSS (mean/peak): {_na(rss_mean)} MB / {_na(rss_peak)} MB",
        f"- Veggklokke: {round(wall_clock, 1)} s",
    ]
    if notes:
        md_lines.append(f"- Merk: {notes}")

    return row, "\n".join(md_lines)


def _append_csv(csv_path: Path, row: dict):
    new_file = not csv_path.exists()
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with open(csv_path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        if new_file:
            writer.writeheader()
        writer.writerow(row)


# ── log detection ─────────────────────────────────────────────────────────────

def _find_log() -> "Path | None":
    candidates = [
        Path(os.environ.get("OLLAMA_LOGS", "~/.ollama/logs")).expanduser() / "server.log",
        Path.home() / ".ollama" / "logs" / "server.log",
        Path("/var/log/ollama/server.log"),
    ]
    for c in candidates:
        if c.exists():
            return c
    return None


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Live Ollama observer — gruppe 3.3, Lokal LLM i praksis"
    )
    parser.add_argument(
        "--label", default="unlabeled run",
        help="Run label, e.g. 'qwen3:8b – oppgave 1' (wrap in quotes)",
    )
    parser.add_argument("--log-path", type=Path, default=None, help="Ollama server log path")
    parser.add_argument("--port", type=int, default=11434, help="Ollama API port")
    parser.add_argument("--output", type=Path, default=None, help="CSV output path")
    args = parser.parse_args()

    # CSV path: default to <repo-root>/arbeidslogg/benchmarks.csv
    if args.output is None:
        repo_root = Path(__file__).resolve().parent.parent
        csv_path = repo_root / "arbeidslogg" / "benchmarks.csv"
    else:
        csv_path = args.output

    hw = hw_info()
    print(f"[observer] {hw['host']} — {hw['cpu_model']}, {hw['cpu_threads']} tråder, {hw['ram_total_gb']} GB")

    if not check_ollama(args.port):
        sys.exit(f"ERROR: Ollama ikke nåbar på localhost:{args.port}. Er 'ollama serve' startet?")
    print(f"[observer] Ollama OK på :{args.port}")

    root_proc = _find_ollama_root()
    if root_proc is None:
        sys.exit("ERROR: Finner ikke 'ollama'-prosessen. Er 'ollama serve' kjørende?")
    print(f"[observer] Sporer PID {root_proc.pid} ({root_proc.name()}) + barn")

    model = detect_model(args.port)
    print(f"[observer] Lastet modell: {model}")

    log_path = args.log_path or _find_log()
    if log_path:
        print(f"[observer] Tailer logg: {log_path}")
    else:
        print("[observer] Loggfil ikke funnet — prøver journalctl --user-unit=ollama")
        print("[observer] TIPS: start Ollama med  OLLAMA_DEBUG=1 ollama serve  for token-statistikk")

    tailer = LogTailer(log_path)
    tailer.start()

    sampler = Sampler(root_proc)
    sampler.start()

    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    start = time.monotonic()

    print(f"\n[observer] Sampling... Trykk Ctrl-C for å stoppe og generere rapport.\n")

    try:
        tick = 0
        while True:
            time.sleep(5)
            tick += 1
            elapsed = time.monotonic() - start
            gens = tailer.generations()
            cpu = sampler.cpu_samples
            rss = sampler.rss_samples
            cpu_now = f"{round(mean(cpu)):4d}%" if cpu else "   -"
            rss_now = f"{round(max(rss) / 1024**2):5d}MB" if rss else "    -"
            print(
                f"  {elapsed:6.0f}s | gens={len(gens):3d} | cpu≈{cpu_now} | rss≈{rss_now}",
                flush=True,
            )
    except KeyboardInterrupt:
        pass

    wall_clock = time.monotonic() - start
    tailer.stop()
    sampler.stop()

    # Re-check model in case it changed or was unknown at start
    late_model = detect_model(args.port)
    if late_model != "unknown":
        model = late_model

    row, md = build_report(
        label=args.label,
        model=model,
        hw=hw,
        gens=tailer.generations(),
        cpu_samples=sampler.cpu_samples,
        rss_samples=sampler.rss_samples,
        wall_clock=wall_clock,
        ts=ts,
    )

    _append_csv(csv_path, row)

    print("\n" + "=" * 60)
    print(md)
    print("=" * 60)
    print(f"\n[observer] Rad lagt til: {csv_path}")
    print("[observer] Kopier blokken ovenfor inn i 'Måling / eksempel:' i eksperimentlogg.md")


if __name__ == "__main__":
    main()
