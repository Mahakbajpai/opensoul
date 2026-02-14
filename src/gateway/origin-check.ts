type OriginCheckResult = { ok: true } | { ok: false; reason: string };

function normalizeHostHeader(hostHeader?: string): string {
  return (hostHeader ?? "").trim().toLowerCase();
}

function resolveHostName(hostHeader?: string): string {
  const host = normalizeHostHeader(hostHeader);
  if (!host) {
    return "";
  }
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    if (end !== -1) {
      return host.slice(1, end);
    }
  }
  const [name] = host.split(":");
  return name ?? "";
}

function parseOrigin(
  originRaw?: string,
): { origin: string; host: string; hostname: string } | null {
  const trimmed = (originRaw ?? "").trim();
  if (!trimmed || trimmed === "null") {
    return null;
  }
  try {
    const url = new URL(trimmed);
    return {
      origin: url.origin.toLowerCase(),
      host: url.host.toLowerCase(),
      hostname: url.hostname.toLowerCase(),
    };
  } catch {
    return null;
  }
}

function isLoopbackHost(hostname: string): boolean {
  if (!hostname) {
    return false;
  }
  if (hostname === "localhost") {
    return true;
  }
  if (hostname === "::1") {
    return true;
  }
  if (hostname === "127.0.0.1" || hostname.startsWith("127.")) {
    return true;
  }
  return false;
}

/**
 * Virtual hostnames used by platform-specific desktop shells (e.g. WebView2).
 * These serve local files and are security-equivalent to localhost.
 */
const DESKTOP_VIRTUAL_HOSTS = new Set(["opensoul.localapp"]);

function isDesktopVirtualHost(hostname: string): boolean {
  return DESKTOP_VIRTUAL_HOSTS.has(hostname);
}

export function checkBrowserOrigin(params: {
  requestHost?: string;
  origin?: string;
  allowedOrigins?: string[];
}): OriginCheckResult {
  const parsedOrigin = parseOrigin(params.origin);
  if (!parsedOrigin) {
    return { ok: false, reason: "origin missing or invalid" };
  }

  const allowlist = (params.allowedOrigins ?? [])
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.includes(parsedOrigin.origin)) {
    return { ok: true };
  }

  const requestHost = normalizeHostHeader(params.requestHost);
  if (requestHost && parsedOrigin.host === requestHost) {
    return { ok: true };
  }

  const requestHostname = resolveHostName(requestHost);
  if (isLoopbackHost(parsedOrigin.hostname) && isLoopbackHost(requestHostname)) {
    return { ok: true };
  }

  // Allow desktop virtual host origins (e.g. WebView2's opensoul.localapp)
  // when the gateway is running on loopback. These virtual hosts serve local
  // files from the filesystem and are security-equivalent to localhost.
  if (isDesktopVirtualHost(parsedOrigin.hostname) && isLoopbackHost(requestHostname)) {
    return { ok: true };
  }

  return { ok: false, reason: "origin not allowed" };
}
