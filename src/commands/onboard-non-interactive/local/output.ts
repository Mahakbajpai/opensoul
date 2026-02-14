import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";

/**
 * Parameters for logging the non-interactive onboarding result as JSON.
 */
export interface LogNonInteractiveOnboardingJsonParams {
  opts: OnboardOptions;
  runtime: RuntimeEnv;
  mode: string;
  workspaceDir: string;
  authChoice: string;
  gateway: {
    port: number;
    bind: string;
    authMode?: string;
    tailscaleMode?: string;
  };
  installDaemon: boolean;
  daemonRuntime?: string;
  skipSkills: boolean;
  skipHealth: boolean;
}

/**
 * Logs a machine-readable JSON summary of the onboarding result when
 * `opts.json` is set.
 */
export function logNonInteractiveOnboardingJson(
  params: LogNonInteractiveOnboardingJsonParams,
): void {
  const { opts, runtime, ...rest } = params;

  if (!opts.json) {
    return;
  }

  runtime.log(JSON.stringify(rest, null, 2));
}
