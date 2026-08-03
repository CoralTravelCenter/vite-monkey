#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { minifySync } from "vite";

import {
  ROOT_DIR,
  getProjectMetadata,
  pathExists,
  resolveProjectDir,
} from "./lib/projects.js";
import { createRunnerViteConfig, runVite } from "./lib/vite.js";

function parseArgs(argv) {
  const [command, projectPath] = argv;

  return {
    command,
    projectPath,
  };
}

function resolveProjectConfig(projectPath) {
  const projectDir = resolveProjectDir(projectPath);
  return getProjectMetadata(projectDir);
}

function assertConfig(config) {
  const entryPath = path.join(config.projectDir, config.entry);

  if (!pathExists(entryPath)) {
    throw new Error(
      `Entry file не найден: ${path.relative(ROOT_DIR, entryPath)}`,
    );
  }

  if (!Array.isArray(config.match) || config.match.length === 0) {
    throw new Error(
      "В experiment.config.json поле match должно быть непустым массивом.",
    );
  }
}

function minifyUserscriptOutput(config) {
  const outputPath = path.join(
    config.projectDir,
    "dist",
    `${config.name}.user.js`,
  );

  if (!pathExists(outputPath)) {
    throw new Error(
      `Собранный userscript не найден: ${path.relative(ROOT_DIR, outputPath)}`,
    );
  }

  const source = fs.readFileSync(outputPath, "utf8");
  const headerMatch = source.match(
    /^(\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*)([\s\S]*)$/,
  );
  const scriptBody = headerMatch?.[2] || source;
  const minifiedBody = minifySync("userscript.js", scriptBody, {
    compress: {
      target: "es2018",
      dropConsole: true,
    },
    mangle: true,
    codegen: { legalComments: "none" },
  }).code.replace(/\\u(0[4-5][0-9a-f]{2})/gi, (_match, code) =>
    String.fromCharCode(Number.parseInt(code, 16)),
  );

  fs.writeFileSync(outputPath, `${minifiedBody}\n`);
}

function main() {
  const { command, projectPath } = parseArgs(process.argv.slice(2));

  if (!["dev", "build"].includes(command)) {
    throw new Error("Команда должна быть dev или build.");
  }

  if (!projectPath) {
    throw new Error(
      `Укажи проект: npm run ${command}:experiment -- project-name`,
    );
  }

  const config = resolveProjectConfig(projectPath);
  assertConfig(config);
  const configPath = createRunnerViteConfig(config);

  console.log(`Experiment: ${config.name}`);
  console.log(
    `Entry: ${path.relative(ROOT_DIR, path.join(config.projectDir, config.entry))}`,
  );
  console.log(`Match: ${config.match.join(", ")}`);

  const isSuccess = runVite(command, configPath);

  if (isSuccess && command === "build") {
    minifyUserscriptOutput(config);
  }
}

try {
  main();
} catch (error) {
  console.error(`\nОшибка: ${error.message}`);
  process.exitCode = 1;
}
