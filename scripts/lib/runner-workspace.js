import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { ROOT_DIR } from "./projects.js";

export const TEMP_DIR = path.join(ROOT_DIR, ".vite-monkey-runner");
export const RUN_MANIFEST = "run.json";

function getProjectHash(config) {
  return createHash("sha256")
    .update(config.projectDir)
    .digest("hex")
    .slice(0, 10);
}

export function getRunWorkspacePath(config, runId, tempDir = TEMP_DIR) {
  if (!/^[a-zA-Z0-9-]+$/.test(runId)) {
    throw new Error(`Некорректный идентификатор запуска: ${runId}`);
  }
  return path.join(tempDir, `${getProjectHash(config)}-${runId}`);
}

export function isProcessRunning(pid, processKill = process.kill) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    processKill(pid, 0);
    return true;
  } catch (error) {
    return error.code !== "ESRCH";
  }
}

export function readRunManifest(workspaceDir) {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(workspaceDir, RUN_MANIFEST), "utf8"),
    );
  } catch {
    return null;
  }
}

export function listStaleRunWorkspaces({
  tempDir = TEMP_DIR,
  processKill = process.kill,
} = {}) {
  if (!fs.existsSync(tempDir)) return [];
  return fs
    .readdirSync(tempDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(tempDir, entry.name))
    .filter((workspaceDir) => {
      const manifest = readRunManifest(workspaceDir);
      return manifest && !isProcessRunning(manifest.pid, processKill);
    });
}

export function removeRunWorkspace(workspaceDir, tempDir = TEMP_DIR) {
  const resolvedWorkspaceDir = path.resolve(workspaceDir);
  const resolvedTempDir = path.resolve(tempDir);
  if (path.dirname(resolvedWorkspaceDir) !== resolvedTempDir) {
    throw new Error(`Небезопасный путь workspace: ${workspaceDir}`);
  }
  fs.rmSync(resolvedWorkspaceDir, { recursive: true, force: true });
}

export function cleanupStaleRunWorkspaces(options = {}) {
  const staleWorkspaces = listStaleRunWorkspaces(options);
  for (const workspaceDir of staleWorkspaces) {
    removeRunWorkspace(workspaceDir, options.tempDir || TEMP_DIR);
  }
  return staleWorkspaces;
}

export function createRunWorkspace(
  config,
  {
    command = "unknown",
    pid = process.pid,
    runId = randomUUID(),
    startedAt = new Date().toISOString(),
    tempDir = TEMP_DIR,
    processKill = process.kill,
  } = {},
) {
  cleanupStaleRunWorkspaces({ tempDir, processKill });
  const workspaceDir = getRunWorkspacePath(config, runId, tempDir);
  fs.mkdirSync(tempDir, { recursive: true });
  fs.mkdirSync(workspaceDir, { recursive: false });
  fs.writeFileSync(
    path.join(workspaceDir, RUN_MANIFEST),
    `${JSON.stringify({ pid, startedAt, command, projectDir: config.projectDir }, null, 2)}\n`,
  );
  return workspaceDir;
}

export function getRunnerViteConfigPath(workspaceDir) {
  return path.join(workspaceDir, "vite.config.mjs");
}

export function getBuildStagingDir(workspaceDir) {
  return path.join(workspaceDir, "build");
}

export function listRunnerCleanupTargets({
  tempDir = TEMP_DIR,
  processKill = process.kill,
} = {}) {
  if (!fs.existsSync(tempDir)) return [];
  const targets = [];
  for (const entry of fs.readdirSync(tempDir, { withFileTypes: true })) {
    const targetPath = path.join(tempDir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".vite.config.mjs")) {
      targets.push({ path: targetPath, type: "legacy-config" });
      continue;
    }
    if (!entry.isDirectory()) continue;
    const manifest = readRunManifest(targetPath);
    if (!manifest) {
      targets.push({ path: targetPath, type: "legacy-directory" });
    } else if (!isProcessRunning(manifest.pid, processKill)) {
      targets.push({ path: targetPath, type: "stale-workspace" });
    }
  }
  return targets.sort((left, right) => left.path.localeCompare(right.path));
}

export function removeRunnerCleanupTargets(targets, tempDir = TEMP_DIR) {
  for (const target of targets) removeRunWorkspace(target.path, tempDir);
}
