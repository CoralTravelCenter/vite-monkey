#!/usr/bin/env node

import path from "node:path";

import { validateExperimentConfig } from "./lib/experiment-config.js";
import {
  ROOT_DIR,
  listProjectDirs,
  normalizePath,
  pathExists,
  readJson,
} from "./lib/projects.js";

const errors = [];
for (const projectDir of listProjectDirs()) {
  const configPath = path.join(projectDir, "experiment.config.json");
  if (!pathExists(configPath)) continue;
  const relative = normalizePath(path.relative(ROOT_DIR, configPath));
  try {
    const config = readJson(configPath);
    for (const error of validateExperimentConfig(config, projectDir)) {
      errors.push(`${relative}: ${error}`);
    }
  } catch (error) {
    errors.push(`${relative}: ${error.message}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("All experiment configs are valid.");
}
