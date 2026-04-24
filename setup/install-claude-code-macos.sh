#!/usr/bin/env bash

set -euo pipefail

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Dette skriptet er laget for macOS."
  exit 1
fi

info() {
  printf '\n==> %s\n' "$1"
}

warn() {
  printf '\n[OBS] %s\n' "$1"
}

update_shell_rc() {
  local rc_file="$1"
  local api_key="$2"
  local tmp_file

  mkdir -p "$(dirname "$rc_file")"
  touch "$rc_file"

  tmp_file="$(mktemp)"
  grep -v '^export ANTHROPIC_API_KEY=' "$rc_file" > "$tmp_file" || true
  printf '\nexport ANTHROPIC_API_KEY="%s"\n' "$api_key" >> "$tmp_file"
  mv "$tmp_file" "$rc_file"
}

pick_shell_rc() {
  if [[ -n "${ZSH_VERSION:-}" ]] || [[ "${SHELL:-}" == */zsh ]]; then
    echo "${ZDOTDIR:-$HOME}/.zshrc"
    return
  fi

  if [[ "${SHELL:-}" == */bash ]]; then
    if [[ -f "$HOME/.bash_profile" ]]; then
      echo "$HOME/.bash_profile"
    else
      echo "$HOME/.bashrc"
    fi
    return
  fi

  echo "${ZDOTDIR:-$HOME}/.zshrc"
}

info "Installerer Claude Code via offisiell macOS-installasjon"

if command -v claude >/dev/null 2>&1; then
  echo "Claude Code ser allerede ut til å være installert:"
  claude --version || true
else
  curl -fsSL https://claude.ai/install.sh | bash
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "Fant ikke 'claude' etter installasjon."
  exit 1
fi

info "Claude Code er tilgjengelig"
claude --version || true

echo
read -r -p "Vil du lagre ANTHROPIC_API_KEY i shell-profilen? [y/N] " should_set_key

case "${should_set_key:-n}" in
  [yY][eE][sS]|[yY])
    echo
    read -r -s -p "Lim inn ANTHROPIC_API_KEY: " api_key
    echo

    if [[ -z "${api_key}" ]]; then
      warn "Ingen API-nokkel oppgitt. Hopper over lagring."
    else
      rc_file="$(pick_shell_rc)"
      update_shell_rc "$rc_file" "$api_key"
      export ANTHROPIC_API_KEY="$api_key"

      info "Lagret ANTHROPIC_API_KEY i $rc_file"
      echo "Nokkelen er lagret utenfor repoet, i hjemmekatalogen din."
      warn "ANTHROPIC_API_KEY overstyrer vanlig Claude-login nar den er aktiv."
      echo "Apne et nytt terminalvindu eller kjor:"
      echo "source \"$rc_file\""
    fi
    ;;
  *)
    warn "API-nokkel ble ikke lagret. Du kan fortsatt logge inn ved a kjore 'claude'."
    ;;
esac

info "Ferdig"
echo "Neste steg:"
echo "1. Gå til prosjektmappen din"
echo "2. Kjor 'claude'"
echo "3. Hvis du bruker API-nokkel, godkjenn 'Use custom API key' ved behov"
echo
warn "Ikke lagre API-nokler i filer i dette repoet, for eksempel .env, settings-filer eller notater."
