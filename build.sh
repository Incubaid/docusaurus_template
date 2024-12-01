#!/bin/bash

set -ex

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

export PATH=${BASE}/node_modules/.bin:$PATH


echo "Docs directory: $script_dir"

#bun build
#bun ${script_dir}/node_modules/.bin/docusaurus build
pnpm build

#rsync -rv --delete ${script_dir}/docs_website/build/ root@info.ourworld.tf:/root/hero/www/info/testdocs/
