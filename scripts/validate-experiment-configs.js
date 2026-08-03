#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

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
    if (!config.name || !/^[a-z0-9][a-z0-9-]*$/.test(config.name))
      errors.push(`${relative}: invalid name`);
    if (!config.entry || !fs.existsSync(path.join(projectDir, config.entry)))
      errors.push(`${relative}: entry not found`);
    if (!Array.isArray(config.match) || config.match.length === 0)
      errors.push(`${relative}: match must be non-empty`);
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
