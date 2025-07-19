#!/bin/bash

# Enable debug mode - print timestamp function
debug_print() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[DEBUG][${timestamp}] $1"
}

# Error function with timestamp
error_print() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[ERROR][${timestamp}] $1" >&2
}

debug_print "Script starting: $(basename "$0")"

# Check if bun is installed
debug_print "Checking if bun is installed"
if ! command -v bun &> /dev/null; then
    error_print "bun is not installed. Please install bun first: https://bun.sh/docs/installation"
    exit 1
fi
debug_print "bun is installed: $(bun --version)"

# Print all commands before execution and exit on error
set -ex

# Get the directory where this script is located
debug_print "Getting script directory"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
debug_print "Script directory: ${script_dir}"
cd "${script_dir}"
debug_print "Changed working directory to: $(pwd)"

# Delete /tmp/docusaurus_test recursively if it exists
debug_print "Checking if /tmp/docusaurus_test exists"
if [ -d "/tmp/docusaurus_test" ]; then
    error_print "run example.sh first"
fi

# Copy template and example directories to /tmp/docusaurus_test using rsync
debug_print "Copying template directory contents to destination root"
rsync -a "${script_dir}/template/" /tmp/docusaurus_test/
debug_print "Template directory contents copied to root"

debug_print "Copying example directory contents to destination root"
rsync -a "${script_dir}/example/" /tmp/docusaurus_test/
debug_print "Example directory contents copied to root"

# List files in the destination to verify copy
debug_print "Contents of /tmp/docusaurus_test: $(ls -la /tmp/docusaurus_test)"

# Change to the destination directory
debug_print "Changing to destination directory"
cd /tmp/docusaurus_test
debug_print "Current directory: $(pwd)"


# Execute build.sh
# debug_print "Executing build.sh"
# if [ -f "./build.sh" ]; then
#     ./build.sh
#     debug_print "build.sh execution completed"
# else
#     error_print "build.sh not found in current directory"
#     exit 1
# fi

# Execute develop.sh
debug_print "Executing develop.sh"
if [ -f "./develop.sh" ]; then
    ./develop.sh
    debug_print "develop.sh execution completed"
else
    error_print "develop.sh not found in current directory"
    exit 1
fi

debug_print "Script execution completed: $(basename "$0")"