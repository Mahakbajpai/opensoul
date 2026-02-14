import type { OpenSoulConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";

/**
 * Parameters for applying a non-interactive auth choice.
 */
export interface ApplyNonInteractiveAuthChoiceParams {
  nextConfig: OpenSoulConfig;
  authChoice: string;
  opts: OnboardOptions;
  runtime: RuntimeEnv;
  baseConfig: OpenSoulConfig;
}

/**
 * Applies the selected auth choice to the config in a non-interactive
 * onboarding flow.  Returns the updated config, or `undefined` if the
 * choice is invalid and the process should abort.
 */
export async function applyNonInteractiveAuthChoice(
  params: ApplyNonInteractiveAuthChoiceParams,
): Promise<OpenSoulConfig | undefined> {
  const { nextConfig, authChoice, opts, runtime } = params;

  if (authChoice === "skip") {
    return nextConfig;
  }

  // Apply token-based auth when a token is provided.
  if (authChoice === "token" && opts.token) {
    return {
      ...nextConfig,
      auth: {
        ...nextConfig.auth,
        token: opts.token,
        provider: opts.tokenProvider,
      },
    } as OpenSoulConfig;
  }

  runtime.error(`Unsupported auth choice for non-interactive mode: ${authChoice}`);
  runtime.exit(1);
  return undefined;
}
