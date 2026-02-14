import type { OpenSoulConfig } from "../../../config/config.js";
import type { OnboardOptions } from "../../onboard-types.js";

/**
 * Parameters for resolving the workspace directory non-interactively.
 */
export interface ResolveNonInteractiveWorkspaceDirParams {
  opts: OnboardOptions;
  baseConfig: OpenSoulConfig;
  defaultWorkspaceDir: string;
}

/**
 * Resolves the workspace directory for non-interactive onboarding.
 * Priority: CLI flag → existing config → default.
 */
export function resolveNonInteractiveWorkspaceDir(
  params: ResolveNonInteractiveWorkspaceDirParams,
): string {
  const { opts, baseConfig, defaultWorkspaceDir } = params;

  if (opts.workspace) {
    return opts.workspace;
  }

  const existingWorkspace = baseConfig.agents?.defaults?.workspace;
  if (existingWorkspace) {
    return existingWorkspace;
  }

  return defaultWorkspaceDir;
}
