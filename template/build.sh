#!/bin/bash

set -ex

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

export PATH=${BASE}/node_modules/.bin:${HOME}/.bun/bin/:$PATH

echo "Docs directory: $script_dir"

bun docusaurus build
