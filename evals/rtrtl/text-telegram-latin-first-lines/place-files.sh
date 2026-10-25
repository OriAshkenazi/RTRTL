#!/usr/bin/env bash
# Copy this case's input files into the run's workspace (the current directory).
set -euo pipefail
cp -R "$(cd "$(dirname "$0")" && pwd)/files/." .
