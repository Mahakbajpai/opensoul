---
summary: "CLI reference for `opensoul config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `opensoul config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `opensoul configure`).

## Examples

```bash
opensoul config get browser.executablePath
opensoul config set browser.executablePath "/usr/bin/google-chrome"
opensoul config set agents.defaults.heartbeat.every "2h"
opensoul config set agents.list[0].tools.exec.node "node-id-or-name"
opensoul config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
opensoul config get agents.defaults.workspace
opensoul config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
opensoul config get agents.list
opensoul config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
opensoul config set agents.defaults.heartbeat.every "0m"
opensoul config set gateway.port 19001 --json
opensoul config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
