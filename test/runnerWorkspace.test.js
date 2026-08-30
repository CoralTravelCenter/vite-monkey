import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  RUN_MANIFEST,
  createRunWorkspace,
  isProcessRunning,
  listRunnerCleanupTargets,
  listStaleRunWorkspaces,
  readRunManifest,
  removeRunnerCleanupTargets,
} from "../scripts/lib/runner-workspace.js";

function createFixture(t) {
  const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "runner-lifecycle-"));
  const tempDir = path.join(parentDir, ".runner");
  const config = {
    name: "timer",
    projectDir: path.join(parentDir, "project"),
  };
  t.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));
  return { config, tempDir };
}

test("run workspace stores lifecycle manifest", (t) => {
  const { config, tempDir } = createFixture(t);
  const workspaceDir = createRunWorkspace(config, {
    command: "build",
    pid: 123,
    processKill: () => {},
    runId: "manifest-test",
    startedAt: "2026-08-28T00:00:00.000Z",
    tempDir,
  });
  const manifest = readRunManifest(workspaceDir);

  assert.equal(fs.existsSync(path.join(workspaceDir, RUN_MANIFEST)), true);
  assert.deepEqual(manifest, {
    pid: 123,
    startedAt: "2026-08-28T00:00:00.000Z",
    command: "build",
    projectDir: config.projectDir,
  });
});

test("stale detection removes only workspaces with dead processes", (t) => {
  const { config, tempDir } = createFixture(t);
  const alive = createRunWorkspace(config, {
    pid: 10,
    processKill: () => {},
    runId: "alive",
    tempDir,
  });
  const stale = createRunWorkspace(config, {
    pid: 20,
    processKill: () => {},
    runId: "stale",
    tempDir,
  });
  const processKill = (pid) => {
    if (pid === 20) {
      const error = new Error("not found");
      error.code = "ESRCH";
      throw error;
    }
  };

  assert.deepEqual(listStaleRunWorkspaces({ tempDir, processKill }), [stale]);
  assert.equal(isProcessRunning(10, processKill), true);
  assert.equal(fs.existsSync(alive), true);
});

test("manual cleanup lists legacy and stale targets but skips active runs", (t) => {
  const { config, tempDir } = createFixture(t);
  fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(path.join(tempDir, "legacy.vite.config.mjs"), "config");
  fs.mkdirSync(path.join(tempDir, "builds"));
  createRunWorkspace(config, {
    pid: 10,
    processKill: () => {},
    runId: "active",
    tempDir,
  });
  createRunWorkspace(config, {
    pid: 20,
    processKill: () => {},
    runId: "stale",
    tempDir,
  });
  const processKill = (pid) => {
    if (pid === 20) {
      const error = new Error("not found");
      error.code = "ESRCH";
      throw error;
    }
  };
  const targets = listRunnerCleanupTargets({ tempDir, processKill });

  assert.deepEqual(targets.map((target) => target.type).sort(), [
    "legacy-config",
    "legacy-directory",
    "stale-workspace",
  ]);
  removeRunnerCleanupTargets(targets, tempDir);
  assert.equal(listRunnerCleanupTargets({ tempDir, processKill }).length, 0);
});
