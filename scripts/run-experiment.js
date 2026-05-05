#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');

const {ROOT_DIR, getProjectMetadata, pathExists, resolveProjectDir} = require('./lib/projects.js');
const {createRunnerViteConfig} = require('./lib/vite.js');

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
    throw new Error(`Entry file не найден: ${path.relative(ROOT_DIR, entryPath)}`);
  }

  if (!Array.isArray(config.match) || config.match.length === 0) {
    throw new Error('В experiment.config.json поле match должно быть непустым массивом.');
  }
}

function getViteBin() {
  const viteBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'vite');

  if (!pathExists(viteBin)) {
    throw new Error('Vite не найден в корневом node_modules. Выполни npm install в корне репозитория.');
  }

  return viteBin;
}

function runVite(command, configPath) {
  const viteBin = getViteBin();
  const args = command === 'build'
    ? ['build', '--config', configPath]
    : ['--config', configPath];
  const result = spawnSync(viteBin, args, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exitCode = result.status || 1;
  }
}

function main() {
  const {command, projectPath} = parseArgs(process.argv.slice(2));

  if (!['dev', 'build'].includes(command)) {
    throw new Error('Команда должна быть dev или build.');
  }

  if (!projectPath) {
    throw new Error(`Укажи проект: npm run ${command}:experiment -- project-name`);
  }

  const config = resolveProjectConfig(projectPath);
  assertConfig(config);
  const configPath = createRunnerViteConfig(config);

  console.log(`Experiment: ${config.name}`);
  console.log(`Entry: ${path.relative(ROOT_DIR, path.join(config.projectDir, config.entry))}`);
  console.log(`Match: ${config.match.join(', ')}`);

  runVite(command, configPath);
}

try {
  main();
} catch (error) {
  console.error(`\nОшибка: ${error.message}`);
  process.exitCode = 1;
}
