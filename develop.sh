#!/bin/bash

set -ex

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

echo "Docs directory: $script_dir"

export PATH=${BASE}/node_modules/.bin:$PATH
export NODE_OPTIONS=--openssl-legacy-provider

#bun run start --host 0.0.0.0
bun ${script_dir}/node_modules/.bin/docusaurus start
cd ..
