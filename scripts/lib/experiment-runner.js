import fs from "node:fs";
import path from "node:path";

import { assertExperimentConfig } from "./experiment-config.js";
import {
  ROOT_DIR,
  getProjectMetadata,
  pathExists,
  resolveProjectDir,
} from "./projects.js";
import {
  createRunWorkspace,
  getBuildStagingDir,
  removeRunWorkspace,
} from "./runner-workspace.js";
import { createRunnerViteConfig, runVite } from "./vite.js";
import {
  finalizeUserscriptSource,
  validateUserscriptArtifact,
} from "./userscript.js";

export function assertExperimentCommand(command) {
  if (!["dev", "build"].includes(command)) {
    throw new Error("Команда должна быть dev или build.");
  }
}

export function getUserscriptOutputPath(config) {
  return path.join(config.projectDir, "dist", `${config.name}.user.js`);
}

export function publishUserscriptBuild(config, stagingDir) {
  const stagedPath = path.join(stagingDir, `${config.name}.user.js`);
  const outputPath = getUserscriptOutputPath(config);

  if (!pathExists(stagedPath)) {
    throw new Error(
      `Собранный userscript не найден: ${path.relative(ROOT_DIR, stagedPath)}`,
    );
  }

  const source = fs.readFileSync(stagedPath, "utf8");
  const finalizedSource = finalizeUserscriptSource(source);
  const validation = validateUserscriptArtifact(finalizedSource, config);
  const outputDir = path.dirname(outputPath);
  const pendingPath = path.join(
    outputDir,
    `.${path.basename(outputPath)}.${process.pid}.pending`,
  );

  fs.mkdirSync(outputDir, { recursive: true });

  try {
    fs.writeFileSync(pendingPath, finalizedSource);
    fs.renameSync(pendingPath, outputPath);
  } finally {
    fs.rmSync(pendingPath, { force: true });
  }

  return { outputPath, validation };
}

export function prepareExperiment(command, projectPath) {
  assertExperimentCommand(command);

  if (!projectPath) {
    throw new Error("Проект для запуска не выбран.");
  }

  const projectDir = resolveProjectDir(projectPath);
  const config = getProjectMetadata(projectDir);
  assertExperimentConfig(config, projectDir);

  return {
    command,
    config,
    outputPath: path.relative(ROOT_DIR, getUserscriptOutputPath(config)),
  };
}

export async function executeDev(
  config,
  workspaceDir,
  { onStage, createConfig, run },
) {
  const configPath = createConfig(config, workspaceDir, "dev");
  onStage("dev");
  const result = await run("dev", configPath);

  return { ...result, validation: null };
}

export async function executeBuild(
  config,
  workspaceDir,
  { onStage, createConfig, run, publishBuild },
) {
  const stagingDir = getBuildStagingDir(workspaceDir);
  const runnerConfig = { ...config, buildOutDir: stagingDir };
  const configPath = createConfig(runnerConfig, workspaceDir, "build");

  onStage("build");
  const result = await run("build", configPath);
  onStage("verify");
  const { validation } = publishBuild(config, stagingDir);

  return { ...result, validation };
}

export async function executeExperiment(
  { command, config },
  {
    onStage = () => {},
    createWorkspace = createRunWorkspace,
    createConfig = createRunnerViteConfig,
    run = runVite,
    publishBuild = publishUserscriptBuild,
    removeWorkspace = removeRunWorkspace,
  } = {},
) {
  let workspaceDir;

  try {
    assertExperimentCommand(command);
    onStage("prepare");
    workspaceDir = createWorkspace(config, { command });

    const runtime = { onStage, createConfig, run, publishBuild };

    if (command === "dev") {
      return await executeDev(config, workspaceDir, runtime);
    }

    return await executeBuild(config, workspaceDir, runtime);
  } finally {
    if (workspaceDir) removeWorkspace(workspaceDir);
  }
}

export async function runExperiment(command, projectPath) {
  return executeExperiment(prepareExperiment(command, projectPath));
}
