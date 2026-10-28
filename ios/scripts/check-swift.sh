#!/usr/bin/env bash
# Checks the app's Swift where there is no Xcode (WSL Ubuntu with Swift, from the repository's root):
# parses every file, and type-checks the ones that do not use SwiftUI (Budgy/Core). The app itself
# compiles only on a Mac (codemagic.yaml).
set -uo pipefail
cd ios || exit 1
mapfile -t files < <(find Budgy -name '*.swift')
status=0
swiftc -parse "${files[@]}" && echo "Parsed: ${#files[@]} files" || status=1
swiftc -typecheck Budgy/Core/*.swift && echo "Type-checked: Budgy/Core" || status=1
exit $status
