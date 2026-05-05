#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const {ROOT_DIR} = require('./lib/projects.js');
const IGNORED_DIRS = new Set(['.git']);
const TEMP_FILE_PATTERN = /(^|[-_.])(temp|tmp)([-_.]|$)/i;
const SOURCE_FILE_PATTERN = /\.(js|ts|jsx|tsx)$/;
const LEGACY_CONFIG_FILES = new Set([
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'vite.config.ts',
]);

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath).split(path.sep).join('/');

    if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    result.push({
      name: entry.name,
      path: relativePath,
      fullPath,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
    });

    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      walk(fullPath, result);
    }
  }

  return result;
}

function findConsoleLogs(files) {
  const matches = [];

  for (const file of files) {
    if (!file.isFile || !SOURCE_FILE_PATTERN.test(file.name)) {
      continue;
    }

    if (!file.path.includes('/src/')) {
      continue;
    }

    const content = fs.readFileSync(file.fullPath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('console.log') || line.includes('debugger')) {
        matches.push(`${file.path}:${index + 1}`);
      }
    });
  }

  return matches;
}

function printSection(title, items) {
  console.log(`\n${title}: ${items.length}`);

  for (const item of items) {
    console.log(`  - ${item}`);
  }
}

function main() {
  const entries = walk(ROOT_DIR);
  const dsStoreFiles = entries
    .filter((entry) => entry.isFile && entry.name === '.DS_Store')
    .map((entry) => entry.path);
  const nodeModulesDirs = entries
    .filter((entry) => entry.isDirectory && entry.name === 'node_modules')
    .map((entry) => entry.path);
  const distDirs = entries
    .filter((entry) => entry.isDirectory && entry.name === 'dist')
    .map((entry) => entry.path);
  const tempFiles = entries
    .filter((entry) => entry.isFile && TEMP_FILE_PATTERN.test(entry.name))
    .map((entry) => entry.path);
  const dirsWithSpaces = entries
    .filter((entry) => entry.isDirectory && entry.path.split('/').some((part) => part.includes(' ')))
    .map((entry) => entry.path);
  const legacyConfigs = entries
    .filter((entry) => (
      entry.isFile &&
      LEGACY_CONFIG_FILES.has(entry.name) &&
      entry.path !== 'package.json' &&
      entry.path !== 'package-lock.json'
    ))
    .map((entry) => entry.path);
  const consoleLogs = findConsoleLogs(entries);

  console.log('Repository hygiene report');
  console.log(`Root: ${ROOT_DIR}`);

  printSection('.DS_Store files', dsStoreFiles);
  printSection('node_modules directories', nodeModulesDirs);
  printSection('dist directories', distDirs);
  printSection('temporary files', tempFiles);
  printSection('directories with spaces', dirsWithSpaces);
  printSection('legacy local package/vite files', legacyConfigs);
  printSection('console.log/debugger entries', consoleLogs);

  console.log('\nNo files were changed.');
}

main();
