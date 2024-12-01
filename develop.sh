#!/bin/bash

set -ex

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}"

echo "Docs directory: $script_dir"

export NODE_OPTIONS=--openssl-legacy-provider

npm run start -- --host 0.0.0.0
