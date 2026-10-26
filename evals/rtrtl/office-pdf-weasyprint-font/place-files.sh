#!/usr/bin/env bash
# Copy the case's input files into the run's empty workspace.
set -euo pipefail
cp -R "$(dirname "$0")/files/." .
