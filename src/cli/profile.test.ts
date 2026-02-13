import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "opensoul",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "opensoul", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "opensoul", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "opensoul", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "opensoul", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "opensoul", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "opensoul", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (dev first)", () => {
    const res = parseCliProfileArgs(["node", "opensoul", "--dev", "--profile", "work", "status"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (profile first)", () => {
    const res = parseCliProfileArgs(["node", "opensoul", "--profile", "work", "--dev", "status"]);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join("/home/peter", ".opensoul-dev");
    expect(env.OPENSOUL_PROFILE).toBe("dev");
    expect(env.OPENSOUL_STATE_DIR).toBe(expectedStateDir);
    expect(env.OPENSOUL_CONFIG_PATH).toBe(path.join(expectedStateDir, "opensoul.json"));
    expect(env.OPENSOUL_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      OPENSOUL_STATE_DIR: "/custom",
      OPENSOUL_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.OPENSOUL_STATE_DIR).toBe("/custom");
    expect(env.OPENSOUL_GATEWAY_PORT).toBe("19099");
    expect(env.OPENSOUL_CONFIG_PATH).toBe(path.join("/custom", "opensoul.json"));
  });
});

describe("formatCliCommand", () => {
  it("returns command unchanged when no profile is set", () => {
    expect(formatCliCommand("opensoul doctor --fix", {})).toBe("opensoul doctor --fix");
  });

  it("returns command unchanged when profile is default", () => {
    expect(formatCliCommand("opensoul doctor --fix", { OPENSOUL_PROFILE: "default" })).toBe(
      "opensoul doctor --fix",
    );
  });

  it("returns command unchanged when profile is Default (case-insensitive)", () => {
    expect(formatCliCommand("opensoul doctor --fix", { OPENSOUL_PROFILE: "Default" })).toBe(
      "opensoul doctor --fix",
    );
  });

  it("returns command unchanged when profile is invalid", () => {
    expect(formatCliCommand("opensoul doctor --fix", { OPENSOUL_PROFILE: "bad profile" })).toBe(
      "opensoul doctor --fix",
    );
  });

  it("returns command unchanged when --profile is already present", () => {
    expect(
      formatCliCommand("opensoul --profile work doctor --fix", { OPENSOUL_PROFILE: "work" }),
    ).toBe("opensoul --profile work doctor --fix");
  });

  it("returns command unchanged when --dev is already present", () => {
    expect(formatCliCommand("opensoul --dev doctor", { OPENSOUL_PROFILE: "dev" })).toBe(
      "opensoul --dev doctor",
    );
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("opensoul doctor --fix", { OPENSOUL_PROFILE: "work" })).toBe(
      "opensoul --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("opensoul doctor --fix", { OPENSOUL_PROFILE: "  jbopensoul  " })).toBe(
      "opensoul --profile jbopensoul doctor --fix",
    );
  });

  it("handles command with no args after opensoul", () => {
    expect(formatCliCommand("opensoul", { OPENSOUL_PROFILE: "test" })).toBe(
      "opensoul --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm opensoul doctor", { OPENSOUL_PROFILE: "work" })).toBe(
      "pnpm opensoul --profile work doctor",
    );
  });
});
