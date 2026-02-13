---
summary: "CLI reference for `opensoul agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
title: "agents"
---

# `opensoul agents`

Manage isolated agents (workspaces + auth + routing).

Related:

- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
opensoul agents list
opensoul agents add work --workspace ~/.opensoul/workspace-work
opensoul agents set-identity --workspace ~/.opensoul/workspace --from-identity
opensoul agents set-identity --agent main --avatar avatars/opensoul.png
opensoul agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/.opensoul/workspace/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
opensoul agents set-identity --workspace ~/.opensoul/workspace --from-identity
```

Override fields explicitly:

```bash
opensoul agents set-identity --agent main --name "OpenSoul" --emoji "🦞" --avatar avatars/opensoul.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "OpenSoul",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/opensoul.png",
        },
      },
    ],
  },
}
```
