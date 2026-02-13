---
summary: "CLI reference for `opensoul plugins` (list, install, enable/disable, doctor)"
read_when:
  - You want to install or manage in-process Gateway plugins
  - You want to debug plugin load failures
title: "plugins"
---

# `opensoul plugins`

Manage Gateway plugins/extensions (loaded in-process).

Related:

- Plugin system: [Plugins](/tools/plugin)
- Plugin manifest + schema: [Plugin manifest](/plugins/manifest)
- Security hardening: [Security](/gateway/security)

## Commands

```bash
opensoul plugins list
opensoul plugins info <id>
opensoul plugins enable <id>
opensoul plugins disable <id>
opensoul plugins doctor
opensoul plugins update <id>
opensoul plugins update --all
```

Bundled plugins ship with OpenSoul but start disabled. Use `plugins enable` to
activate them.

All plugins must ship a `opensoul.plugin.json` file with an inline JSON Schema
(`configSchema`, even if empty). Missing/invalid manifests or schemas prevent
the plugin from loading and fail config validation.

### Install

```bash
opensoul plugins install <path-or-spec>
```

Security note: treat plugin installs like running code. Prefer pinned versions.

Supported archives: `.zip`, `.tgz`, `.tar.gz`, `.tar`.

Use `--link` to avoid copying a local directory (adds to `plugins.load.paths`):

```bash
opensoul plugins install -l ./my-plugin
```

### Update

```bash
opensoul plugins update <id>
opensoul plugins update --all
opensoul plugins update <id> --dry-run
```

Updates only apply to plugins installed from npm (tracked in `plugins.installs`).
