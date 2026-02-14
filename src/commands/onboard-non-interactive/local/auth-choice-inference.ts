import type { OnboardOptions } from "../../onboard-types.js";

/**
 * A single inferred auth match from CLI flags.
 */
export interface AuthChoiceMatch {
  /** Human-readable label for the matched provider. */
  label: string;
  /** The auth choice key that would be applied. */
  choice: string;
}

/**
 * Result of inferring auth choice from non-interactive flags.
 */
export interface InferredAuthChoice {
  /** The single best-guess auth choice, or `undefined` when ambiguous. */
  choice: string | undefined;
  /** All provider flags that matched. */
  matches: Array<AuthChoiceMatch>;
}

/**
 * Inspects the non-interactive CLI flags and returns the inferred auth
 * provider choice.  When more than one provider key is supplied the
 * caller should ask the user to disambiguate.
 */
export function inferAuthChoiceFromFlags(opts: OnboardOptions): InferredAuthChoice {
  const matches: Array<AuthChoiceMatch> = [];

  // Check for common API key flags and map them to auth choices.
  if (opts.token) {
    matches.push({ label: "--token", choice: "token" });
  }

  // When exactly one match exists, return it directly.
  if (matches.length === 1) {
    return { choice: matches[0].choice, matches };
  }

  // Zero or many matches → caller decides.
  return { choice: undefined, matches };
}
