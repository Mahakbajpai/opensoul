import type { OpenSoulConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";

/**
 * Parameters for applying skills configuration non-interactively.
 */
export interface ApplyNonInteractiveSkillsConfigParams {
  nextConfig: OpenSoulConfig;
  opts: OnboardOptions;
  runtime: RuntimeEnv;
}

/**
 * Applies skills-related configuration from non-interactive CLI flags.
 * Returns the (potentially updated) config.
 */
export function applyNonInteractiveSkillsConfig(
  params: ApplyNonInteractiveSkillsConfigParams,
): OpenSoulConfig {
  const { nextConfig, opts } = params;

  if (opts.skipSkills) {
    return nextConfig;
  }

  // Default: keep existing skills config unchanged.
  return nextConfig;
}
