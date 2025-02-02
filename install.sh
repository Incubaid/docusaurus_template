#!/bin/bash

set -ex

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

echo "Docs directory: $script_dir"

# Function to detect the current shell and source the appropriate rc file
source_rc_file() {
    local shell_name=$(basename "$SHELL")
    case "$shell_name" in
        bash)
            source "$HOME/.bashrc"
            ;;
        zsh)
            source "$HOME/.zshrc"
            ;;
        fish)
            source "$HOME/.config/fish/config.fish"
            ;;
        *)
            echo "Unsupported shell: $shell_name"
            exit 1
            ;;
    esac
}

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "Bun is not installed. Installing..."
    curl -fsSL https://bun.sh/install | bash
    source_rc_file
else
    echo "Bun is already installed."
fi

bun install