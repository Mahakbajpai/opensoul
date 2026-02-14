import type { OpenSoulConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";

/**
 * Parameters for installing the gateway daemon non-interactively.
 */
export interface InstallGatewayDaemonNonInteractiveParams {
  nextConfig: OpenSoulConfig;
  opts: OnboardOptions;
  runtime: RuntimeEnv;
  port: number;
  gatewayToken?: string;
}

/**
 * Installs and starts the gateway daemon in non-interactive mode.
 * When `opts.installDaemon` is false this is a no-op.
 */
export async function installGatewayDaemonNonInteractive(
  params: InstallGatewayDaemonNonInteractiveParams,
): Promise<void> {
  const { opts, runtime } = params;

  if (!opts.installDaemon) {
    return;
  }

  runtime.log("Installing gateway daemon (non-interactive)…");
  // TODO: implement daemon installation logic.
}
