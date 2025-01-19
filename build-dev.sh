#!/bin/bash

set -ex

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

export PATH=${BASE}/node_modules/.bin:$PATH

echo "Docs directory: $script_dir"

# Change baseUrl to '/tftechdev/'
sed -i "s|/tftech/|/tftechdev/|g" docusaurus.config.ts ./src/pages/index.tsx

bun docusaurus build

rsync -rv --delete ${script_dir}/build/ root@info.ourworld.tf:/root/hero/www/info/tftechdev

# Change baseUrl to '/tftech/'
sed -i "s|/tftechdev/|/tftech/|g" docusaurus.config.ts ./src/pages/index.tsx