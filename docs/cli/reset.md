---
summary: "CLI reference for `opensoul reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `opensoul reset`

Reset local config/state (keeps the CLI installed).

```bash
opensoul reset
opensoul reset --dry-run
opensoul reset --scope config+creds+sessions --yes --non-interactive
```
