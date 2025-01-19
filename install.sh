
#!/bin/bash

set -ex

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

echo "Docs directory: $script_dir"

#Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "Bun is not installed. Installing..."
    curl -fsSL https://bun.sh/install | bash
else
    echo "Bun is already installed."
fi

bun install

