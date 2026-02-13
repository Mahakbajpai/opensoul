import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".opensoul"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", OPENSOUL_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".opensoul-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", OPENSOUL_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".opensoul"));
  });

  it("uses OPENSOUL_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", OPENSOUL_STATE_DIR: "/var/lib/opensoul" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/opensoul"));
  });

  it("expands ~ in OPENSOUL_STATE_DIR", () => {
    const env = { HOME: "/Users/test", OPENSOUL_STATE_DIR: "~/opensoul-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/opensoul-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { OPENSOUL_STATE_DIR: "C:\\State\\opensoul" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\opensoul");
  });
});
