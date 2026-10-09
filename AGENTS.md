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

Version 0.3.0 ships the unified Origins & outputs page. Native login/API/origins/diagnostics/assets, compiled desktop/mobile navigation, optional SSH, Persian RTL, payload extraction/integrity and SHA-256 checks passed before publication. Clean Ubuntu 24.04 systemd installation, installed public API/TCP/service checks and upgrade preserving accounts/state passed in run 37887040917. Pages deployment and live installer/checksum download verification also passed. Real remote 3x-ui provisioning, public ACME and authenticated Reality remain unverified.

The `.run` payload uses xz compression to keep the compiled distribution compact. Ubuntu 24.04 must have `xz-utils`; the launcher checks for `xz` before extracting. Keep this packaging choice coordinated with the private `packaging/bundle.py` and `packaging/launcher.sh`.

## Installation-page maintenance

- Keep the public `install.sh` bootstrap identical to private `site/install.sh`; it is separate from the private root installer. It downloads only the compiled package and matching checksum over HTTPS, verifies before execution, cleans temporary files and forwards options such as `--update`.
- Keep the page concise, with Persian (RTL) as the default and an English toggle. Commands stay LTR in both languages; language switching preserves the install/update selection.
- Keep both README install commands consistent with the page. Website/bootstrap edits do not require recompiling an unchanged application binary; retain its exact built source commit in `RELEASE.json`.
- When changing page JS/CSS, update their content-hash query versions in both HTML copies to prevent stale browser/CDN assets. Verify live interactions after deployment.
- Bundle Vazirmatn for Persian text and JetBrains Mono for English/terminal text locally, retain their OFL licenses and pinned provenance in `fonts/SOURCES.md`, and verify both languages after typography edits.
