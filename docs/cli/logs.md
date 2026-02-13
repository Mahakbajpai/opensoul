---
summary: "CLI reference for `opensoul logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `opensoul logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
opensoul logs
opensoul logs --follow
opensoul logs --json
opensoul logs --limit 500
```
