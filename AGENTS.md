# AntiDPI public installation site

This repository (`exirhub/AntiDPI`) publishes https://exirhub.github.io/AntiDPI/ from `main` root.
The application source is maintained in the private repository `exirhub/anti-dpi-haproxy`.

## Coordination and publication

- Keep this repository limited to the public installation page, browser assets/fonts, compiled installer, checksum, public tests and release/maintenance notes.
- Never copy private backend/panel source, Python bytecode, generated C, build directories, credentials, SSH keys, databases or private logs into this repository.
- After a source change affecting shipped behavior, publish the newly built `.run` and its matching `SHA256SUMS` in the same commit. Reuse the previous tested public release until the replacement has passed native smoke/integrity checks.
- `RELEASE.json` must identify the exact built source commit, installer SHA-256 and size, supported OS/architecture and honest validation status. Never point metadata at source changes that were not included in the binary.
- Sync website copy and install/update commands with the private `site/` source. Preserve the filenames used by download links.
- A page-only edit may be published without rebuilding the installer, but update the private site source too. A documentation-only source commit after compilation need not change the built source commit recorded in release metadata.
- Verify Pages deployment, installer and checksum download responses, and SHA-256 of the downloaded file before reporting a release live.
- Update both repositories' `AGENTS.md` files whenever this coordination procedure or repository paths change. Report blocked systemd/cloud tests accurately rather than claiming a full installation passed.

## Current release validation

Published build e9781c4 passed clean Ubuntu 24.04 systemd install, installed HTTPS/API/TCP/service checks and upgrade preserving accounts/state in run 37696565225. Real remote 3x-ui provisioning remains unverified.
