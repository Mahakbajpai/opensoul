import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "opensoul", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "opensoul", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "opensoul", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "opensoul", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "opensoul", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "opensoul", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "opensoul", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "opensoul"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "opensoul", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "opensoul", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "opensoul", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "opensoul", "status", "--timeout=2500"], "--timeout")).toBe(
      "2500",
    );
    expect(getFlagValue(["node", "opensoul", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "opensoul", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "opensoul", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "opensoul", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "opensoul", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "opensoul", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "opensoul", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "opensoul", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "opensoul", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "opensoul", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["node", "opensoul", "status"],
    });
    expect(nodeArgv).toEqual(["node", "opensoul", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["node-22", "opensoul", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "opensoul", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["node-22.2.0.exe", "opensoul", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "opensoul", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["node-22.2", "opensoul", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "opensoul", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["node-22.2.exe", "opensoul", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "opensoul", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["/usr/bin/node-22.2.0", "opensoul", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "opensoul", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["nodejs", "opensoul", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "opensoul", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["node-dev", "opensoul", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "opensoul", "node-dev", "opensoul", "status"]);

    const directArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["opensoul", "status"],
    });
    expect(directArgv).toEqual(["node", "opensoul", "status"]);

    const bunArgv = buildParseArgv({
      programName: "opensoul",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "opensoul",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "opensoul", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "opensoul", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "opensoul", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "opensoul", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "opensoul", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "opensoul", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "opensoul", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "opensoul", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
