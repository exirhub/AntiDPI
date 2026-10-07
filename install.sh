#!/usr/bin/env bash
set -euo pipefail

main() {
    local base='https://exirhub.github.io/AntiDPI'
    local package='AntiDPI-ubuntu24-amd64.run'
    local workdir
    for tool in curl sha256sum mktemp; do
        command -v "$tool" >/dev/null || { printf 'Required command missing: %s\n' "$tool" >&2; return 1; }
    done
    workdir=$(mktemp -d)
    trap "rm -rf -- $(printf '%q' "$workdir")" EXIT
    # Keep downloads isolated, validate the exact package, then forward installer options.
    curl --fail --silent --show-error --location --proto '=https' --proto-redir '=https' --retry 3 --connect-timeout 20 --max-time 300 "$base/$package" -o "$workdir/$package"
    curl --fail --silent --show-error --location --proto '=https' --proto-redir '=https' --retry 3 --connect-timeout 20 --max-time 60 "$base/SHA256SUMS" -o "$workdir/SHA256SUMS"
    local expected filename extra
    read -r expected filename extra < "$workdir/SHA256SUMS"
    if [[ ! "$expected" =~ ^[0-9a-f]{64}$ || "$filename" != "$package" || -n "$extra" || $(wc -l < "$workdir/SHA256SUMS") -ne 1 ]]; then
        printf 'Invalid published checksum. Installation cancelled.\n' >&2
        return 1
    fi
    if ! (cd "$workdir" && sha256sum --check --status SHA256SUMS); then
        printf 'Checksum mismatch. Installation cancelled.\n' >&2
        return 1
    fi
    bash "$workdir/$package" "$@"
}
main "$@"
