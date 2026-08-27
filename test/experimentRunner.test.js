import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertExperimentCommand,
  executeExperiment,
  getUserscriptOutputPath,
  publishUserscriptBuild,
} from "../scripts/lib/experiment-runner.js";
import {
  createRunWorkspace,
  removeRunWorkspace,
} from "../scripts/lib/runner-workspace.js";
import { createRunnerViteConfig } from "../scripts/lib/vite.js";

test("accepts supported experiment commands", () => {
  assert.doesNotThrow(() => assertExperimentCommand("dev"));
  assert.doesNotThrow(() => assertExperimentCommand("build"));
});

test("rejects unsupported commands", () => {
  assert.throws(() => assertExperimentCommand("preview"), /dev или build/);
});

test("resolves the final userscript output path", () => {
  assert.equal(
    getUserscriptOutputPath({
      name: "timer",
      projectDir: path.join(path.sep, "repository", "brands", "coral", "timer"),
    }),
    path.join(
      path.sep,
      "repository",
      "brands",
      "coral",
      "timer",
      "dist",
      "timer.user.js",
    ),
  );
});

function createBuildFixture(t, previousOutput = "previous build") {
  const projectDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "experiment-publish-"),
  );
  const stagingDir = path.join(projectDir, "staging");
  const outputDir = path.join(projectDir, "dist");
  const config = {
    name: "timer",
    match: ["https://example.com/*"],
    projectDir,
  };

  fs.mkdirSync(stagingDir);
  fs.mkdirSync(outputDir);
  fs.writeFileSync(getUserscriptOutputPath(config), previousOutput);
  t.after(() => fs.rmSync(projectDir, { recursive: true, force: true }));

  return { config, stagingDir };
}

test("publishes a verified userscript over the previous build", (t) => {
  const { config, stagingDir } = createBuildFixture(t);
  fs.writeFileSync(
    path.join(stagingDir, "timer.user.js"),
    "// ==UserScript==\n// @name timer\n// @namespace mindbox/vite-monkey\n// @match https://example.com/*\n// ==/UserScript==\n\n'use strict';(()=>{})();",
  );

  publishUserscriptBuild(config, stagingDir);

  const output = fs.readFileSync(getUserscriptOutputPath(config), "utf8");
  assert.equal(
    output,
    "// ==UserScript==\n// @name timer\n// @namespace mindbox/vite-monkey\n// @match https://example.com/*\n// ==/UserScript==\n\n'use strict';(()=>{})();\n",
  );
});

test("keeps the previous build when staged userscript is invalid", (t) => {
  const { config, stagingDir } = createBuildFixture(t);
  fs.writeFileSync(path.join(stagingDir, "timer.user.js"), "invalid build");

  assert.throws(
    () => publishUserscriptBuild(config, stagingDir),
    /metadata block не найден/,
  );
  assert.equal(
    fs.readFileSync(getUserscriptOutputPath(config), "utf8"),
    "previous build",
  );
});

test("keeps the previous build when staged JavaScript has invalid syntax", (t) => {
  const { config, stagingDir } = createBuildFixture(t);
  fs.writeFileSync(
    path.join(stagingDir, "timer.user.js"),
    "// ==UserScript==\n// @name timer\n// @namespace mindbox/vite-monkey\n// @match https://example.com/*\n// ==/UserScript==\n\nfunction broken(",
  );
  config.match = ["https://example.com/*"];

  assert.throws(
    () => publishUserscriptBuild(config, stagingDir),
    /Некорректный JavaScript userscript/,
  );
  assert.equal(
    fs.readFileSync(getUserscriptOutputPath(config), "utf8"),
    "previous build",
  );
});

function createRunnerFixture(t) {
  const parentDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "experiment-signal-"),
  );
  const tempDir = path.join(parentDir, ".runner");
  const projectDir = path.join(parentDir, "project");
  const config = {
    name: "timer",
    entry: "src/main.js",
    match: ["https://example.com/*"],
    projectDir,
  };
  let workspaceDir;

  fs.mkdirSync(path.join(projectDir, "src"), { recursive: true });
  fs.writeFileSync(path.join(projectDir, "src", "main.js"), "export {};\n");
  t.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));

  return {
    config,
    createWorkspace(currentConfig) {
      workspaceDir = createRunWorkspace(currentConfig, {
        runId: "signal-test",
        tempDir,
      });
      return workspaceDir;
    },
    removeWorkspace(currentWorkspace) {
      removeRunWorkspace(currentWorkspace, tempDir);
    },
    workspace: () => workspaceDir,
  };
}

test("dev interruption is successful and cleans its workspace", async (t) => {
  const fixture = createRunnerFixture(t);
  let publishCalled = false;

  const result = await executeExperiment(
    { command: "dev", config: fixture.config },
    {
      createWorkspace: fixture.createWorkspace,
      createConfig(config, workspaceDir, command) {
        assert.equal(config.buildOutDir, undefined);
        assert.equal(command, "dev");
        return createRunnerViteConfig(config, workspaceDir, command);
      },
      run: async () => ({ status: null, signal: "SIGINT" }),
      publishBuild: () => {
        publishCalled = true;
        throw new Error("dev не должен публиковать build");
      },
      removeWorkspace: fixture.removeWorkspace,
    },
  );

  assert.equal(result.signal, "SIGINT");
  assert.equal(result.validation, null);
  assert.equal(publishCalled, false);
  assert.equal(fs.existsSync(fixture.workspace()), false);
});

test("build uses staging, validates and publishes through its own pipeline", async (t) => {
  const fixture = createRunnerFixture(t);
  const stages = [];
  let publishedStagingDir;

  const result = await executeExperiment(
    { command: "build", config: fixture.config },
    {
      onStage: (stage) => stages.push(stage),
      createWorkspace: fixture.createWorkspace,
      createConfig(config, workspaceDir, command) {
        assert.equal(config.buildOutDir, path.join(workspaceDir, "build"));
        assert.equal(command, "build");
        return createRunnerViteConfig(config, workspaceDir, command);
      },
      run: async (command) => {
        assert.equal(command, "build");
        return { status: 0, signal: null };
      },
      publishBuild: (_config, stagingDir) => {
        publishedStagingDir = stagingDir;
        return {
          validation: { metadata: true, javascript: true, sizeBytes: 100 },
        };
      },
      removeWorkspace: fixture.removeWorkspace,
    },
  );

  assert.deepEqual(stages, ["prepare", "build", "verify"]);
  assert.equal(publishedStagingDir, path.join(fixture.workspace(), "build"));
  assert.equal(result.validation.metadata, true);
  assert.equal(fs.existsSync(fixture.workspace()), false);
});

test("build interruption fails, cleans workspace and publishes nothing", async (t) => {
  const fixture = createRunnerFixture(t);

  await assert.rejects(
    () =>
      executeExperiment(
        { command: "build", config: fixture.config },
        {
          createWorkspace: fixture.createWorkspace,
          createConfig: createRunnerViteConfig,
          run: async () => {
            const error = new Error("Vite прерван сигналом SIGINT.");
            error.exitCode = 130;
            throw error;
          },
          removeWorkspace: fixture.removeWorkspace,
        },
      ),
    /SIGINT/,
  );

  assert.equal(fs.existsSync(fixture.workspace()), false);
  assert.equal(fs.existsSync(getUserscriptOutputPath(fixture.config)), false);
});
