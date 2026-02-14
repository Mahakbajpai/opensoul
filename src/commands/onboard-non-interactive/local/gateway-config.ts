import type { OpenSoulConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";

/**
 * Result of applying gateway configuration.
 */
export interface GatewayConfigResult {
  nextConfig: OpenSoulConfig;
  port: number;
  bind: string;
  gatewayToken?: string;
  authMode?: string;
  tailscaleMode?: string;
}

/**
 * Parameters for applying gateway configuration non-interactively.
 */
export interface ApplyNonInteractiveGatewayConfigParams {
  nextConfig: OpenSoulConfig;
  opts: OnboardOptions;
  runtime: RuntimeEnv;
  defaultPort: number;
}

/**
 * Applies gateway configuration from non-interactive CLI flags.
 * Returns the updated config and resolved gateway params, or
 * `undefined` if configuration is invalid.
 */
export function applyNonInteractiveGatewayConfig(
  params: ApplyNonInteractiveGatewayConfigParams,
): GatewayConfigResult | undefined {
  const { nextConfig, opts, defaultPort } = params;

  const port = opts.gatewayPort ?? defaultPort;
  const bind = opts.gatewayBind ?? "loopback";
  const authMode = opts.gatewayAuth ?? "token";
  const tailscaleMode = opts.tailscale ?? "off";
  const gatewayToken = opts.gatewayToken;

  const updatedConfig: OpenSoulConfig = {
    ...nextConfig,
    gateway: {
      ...nextConfig.gateway,
      mode: "local",
      port,
    },
  };

  return {
    nextConfig: updatedConfig,
    port,
    bind,
    gatewayToken,
    authMode,
    tailscaleMode,
  };
}
