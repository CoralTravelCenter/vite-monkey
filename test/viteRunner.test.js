import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createRunWorkspace,
  getBuildStagingDir,
  getRunWorkspacePath,
  getRunnerViteConfigPath,
  removeRunWorkspace,
} from "../scripts/lib/runner-workspace.js";
import {
  createRunnerViteConfigSource,
  createViteCliArgs,
  isExpectedDevStop,
  runVite,
  ViteProcessError,
} from "../scripts/lib/vite.js";

function createConfig(overrides = {}) {
  return {
    name: "example-experiment",
    entry: "src/main.js",
    match: ["https://example.com/*"],
    projectDir: path.join(path.sep, "repository", "brands", "coral", "example"),
    ...overrides,
  };
}

function createSpawnResult({ status = 0, signal = null, error } = {}) {
  return (_executable, _args, _options) => {
    const child = new EventEmitter();
    child.killed = false;
    child.kill = (nextSignal) => {
      child.killed = true;
      queueMicrotask(() => child.emit("exit", null, nextSignal));
    };

    queueMicrotask(() => {
      if (error) child.emit("error", error);
      else child.emit("exit", status, signal);
    });

    return child;
  };
}

test("generated Vite config contains the Monkey build contract", () => {
  const config = createConfig({
    buildOutDir: path.join(path.sep, "repository", "staging", "build"),
  });
  const source = createRunnerViteConfigSource(config, "build");

  assert.equal(
    source.includes(`root: ${JSON.stringify(config.projectDir)}`),
    true,
  );
  assert.equal(
    source.includes(
      `entry: ${JSON.stringify(path.join(config.projectDir, config.entry))}`,
    ),
    true,
  );
  assert.match(source, /'@utils'/);
  assert.match(source, /minify: 'oxc'/);
  assert.equal(
    source.includes(`outDir: ${JSON.stringify(config.buildOutDir)}`),
    true,
  );
  assert.match(source, /plugin-monkey/);
  assert.equal(source.includes(JSON.stringify(config.match, null, 8)), true);
  assert.equal(
    source.includes(`fileName: ${JSON.stringify(`${config.name}.user.js`)}`),
    true,
  );
});

test("generated build config contains only build mode settings", () => {
  const buildOutDir = path.join(path.sep, "repository", "staging", "build");
  const source = createRunnerViteConfigSource(
    createConfig({ buildOutDir }),
    "build",
  );

  assert.equal(source.includes(`outDir: ${JSON.stringify(buildOutDir)}`), true);
  assert.match(source, /minify: 'oxc'/);
  assert.match(source, /fileName:/);
  assert.doesNotMatch(source, /server:/);
  assert.doesNotMatch(source, /install\.user\.js/);
});

test("generated dev config contains only server mode settings", () => {
  const source = createRunnerViteConfigSource(createConfig(), "dev");

  assert.match(source, /server:/);
  assert.match(source, /port: 5173/);
  assert.match(source, /strictPort: false/);
  assert.match(source, /install\.user\.js/);
  assert.doesNotMatch(source, /outDir:/);
  assert.doesNotMatch(source, /minify:/);
  assert.doesNotMatch(source, /fileName:/);
});

test("dev and build configs share the same userscript metadata", () => {
  const config = createConfig({ buildOutDir: "/staging" });
  const devSource = createRunnerViteConfigSource(config, "dev");
  const buildSource = createRunnerViteConfigSource(config, "build");

  for (const expected of [
    `name: ${JSON.stringify(config.name)}`,
    "namespace: 'mindbox/vite-monkey'",
    JSON.stringify(config.match, null, 8),
  ]) {
    assert.equal(devSource.includes(expected), true);
    assert.equal(buildSource.includes(expected), true);
  }
});

test("build config does not contain the dev port policy", () => {
  const source = createRunnerViteConfigSource(
    createConfig({ buildOutDir: "/staging" }),
    "build",
  );

  assert.doesNotMatch(source, /port: 5173/);
  assert.doesNotMatch(source, /strictPort/);
});

test("Vite config generator rejects an unknown mode", () => {
  assert.throws(
    () => createRunnerViteConfigSource(createConfig(), "preview"),
    /dev или build/,
  );
  assert.throws(
    () => createRunnerViteConfigSource(createConfig(), "build"),
    /staging outDir/,
  );
});

test("run workspaces isolate parallel launches and projects", () => {
  const tempDir = path.join(path.sep, "repository", ".runner");
  const coralConfig = createConfig({
    projectDir: path.join(path.sep, "repository", "coral", "timer"),
  });
  const sunmarConfig = createConfig({
    projectDir: path.join(path.sep, "repository", "sunmar", "timer"),
  });
  const coralFirst = getRunWorkspacePath(coralConfig, "run-1", tempDir);
  const coralSecond = getRunWorkspacePath(coralConfig, "run-2", tempDir);
  const sunmarFirst = getRunWorkspacePath(sunmarConfig, "run-1", tempDir);

  assert.notEqual(coralFirst, coralSecond);
  assert.notEqual(coralFirst, sunmarFirst);
  assert.equal(
    getRunnerViteConfigPath(coralFirst),
    path.join(coralFirst, "vite.config.mjs"),
  );
  assert.equal(getBuildStagingDir(coralFirst), path.join(coralFirst, "build"));
  assert.throws(
    () => getRunWorkspacePath(coralConfig, "../outside", tempDir),
    /Некорректный идентификатор/,
  );
});

test("Vite CLI arguments distinguish dev and build commands", () => {
  const cliPath = path.join(path.sep, "repository", "vite.js");
  const configPath = path.join(path.sep, "repository", "runner.config.mjs");

  assert.deepEqual(createViteCliArgs("dev", configPath, cliPath), [
    cliPath,
    "--config",
    configPath,
  ]);
  assert.deepEqual(createViteCliArgs("build", configPath, cliPath), [
    cliPath,
    "build",
    "--config",
    configPath,
  ]);
});

test("run workspace owns config and build staging and is safely removed", (t) => {
  const parentDir = fs.mkdtempSync(path.join(os.tmpdir(), "vite-runner-"));
  const tempDir = path.join(parentDir, ".runner");
  fs.mkdirSync(tempDir);
  t.after(() => fs.rmSync(parentDir, { recursive: true, force: true }));
  const workspaceDir = createRunWorkspace(createConfig(), {
    runId: "test-run",
    tempDir,
  });
  const configPath = getRunnerViteConfigPath(workspaceDir);
  const stagingDir = getBuildStagingDir(workspaceDir);
  fs.writeFileSync(configPath, "export default {};\n");
  fs.mkdirSync(stagingDir);
  fs.writeFileSync(path.join(stagingDir, "artifact.js"), "content");

  removeRunWorkspace(workspaceDir, tempDir);
  assert.equal(fs.existsSync(workspaceDir), false);
  assert.throws(
    () => removeRunWorkspace(path.join(tempDir, "..", "outside"), tempDir),
    /Небезопасный путь workspace/,
  );
});

test("runVite returns the child-process result without mutating CLI state", async () => {
  const result = await runVite("build", "/runner.config.mjs", {
    fileExists: () => true,
    spawnProcess: (_executable, args, options) => {
      assert.deepEqual(args, [
        "/vite.js",
        "build",
        "--config",
        "/runner.config.mjs",
      ]);
      assert.equal(options.stdio, "inherit");
      return createSpawnResult()();
    },
    viteCliPath: "/vite.js",
  });

  assert.equal(result.status, 0);
});

test("dev treats SIGINT and SIGTERM as expected stops", async () => {
  for (const signal of ["SIGINT", "SIGTERM"]) {
    const result = await runVite("dev", "/runner.config.mjs", {
      fileExists: () => true,
      spawnProcess: createSpawnResult({ status: null, signal }),
      viteCliPath: "/vite.js",
    });

    assert.equal(result.signal, signal);
    assert.equal(isExpectedDevStop("dev", result), true);
  }

  assert.equal(isExpectedDevStop("dev", { status: 130, signal: null }), true);
  assert.equal(
    isExpectedDevStop("build", { status: 130, signal: null }),
    false,
  );
});

test("runVite forwards a parent signal and removes signal listeners", async () => {
  const processTarget = new EventEmitter();

  const result = await runVite("dev", "/runner.config.mjs", {
    fileExists: () => true,
    processTarget,
    spawnProcess: () => {
      const child = new EventEmitter();
      child.killed = false;
      child.kill = (signal) => {
        child.killed = true;
        queueMicrotask(() => child.emit("exit", null, signal));
      };
      queueMicrotask(() => processTarget.emit("SIGINT"));
      return child;
    },
    viteCliPath: "/vite.js",
  });

  assert.equal(result.signal, "SIGINT");
  assert.equal(processTarget.listenerCount("SIGINT"), 0);
  assert.equal(processTarget.listenerCount("SIGTERM"), 0);
});

test("build treats interruption as a process error", async () => {
  await assert.rejects(
    () =>
      runVite("build", "/runner.config.mjs", {
        fileExists: () => true,
        spawnProcess: createSpawnResult({ status: null, signal: "SIGINT" }),
        viteCliPath: "/vite.js",
      }),
    (error) =>
      error instanceof ViteProcessError &&
      error.exitCode === 130 &&
      /SIGINT/.test(error.message),
  );
});

test("runVite exposes process failures as typed errors", async () => {
  await assert.rejects(
    () =>
      runVite("build", "/runner.config.mjs", {
        fileExists: () => true,
        spawnProcess: createSpawnResult({ status: 7 }),
        viteCliPath: "/vite.js",
      }),
    (error) => error instanceof ViteProcessError && error.exitCode === 7,
  );
  await assert.rejects(
    () =>
      runVite("dev", "/runner.config.mjs", {
        fileExists: () => true,
        spawnProcess: createSpawnResult({ error: new Error("spawn failed") }),
        viteCliPath: "/vite.js",
      }),
    /Не удалось запустить Vite/,
  );
});
