# AntiDPI

Install AntiDPI on Ubuntu 24.04 x86_64 from https://exirhub.github.io/AntiDPI/.

Download `AntiDPI-ubuntu24-amd64.run` and `SHA256SUMS` into the same directory:

```bash
sha256sum --check SHA256SUMS
sudo bash AntiDPI-ubuntu24-amd64.run
```

For an existing installation, add `--update` to the installer command.

This repository contains the installation website and compiled distribution only. Application backend source is maintained privately. The current build adds SSH provisioning of fresh output servers, latest stable 3x-ui installation/database restoration, and a named reusable x-ui backup catalog.

Native login/API/assets, package integrity and responsive page/download-link checks passed. Complete systemd installation/update and real destination provisioning remain unverified. See `RELEASE.json` for the exact build and checksum; see `AGENTS.md` for maintenance coordination.

Compilation excludes original application Python source and bytecode from the installer. Browser assets and root-readable configuration remain inspectable, and native code can still be reverse engineered.
