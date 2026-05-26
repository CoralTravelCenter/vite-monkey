#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import {
  BRANDS_DIR,
  ROOT_DIR,
  SPECIAL_DIR,
  getProjectMetadata,
  listProjectDirs,
  listTopLevelEntries,
  mapBrandToArea,
  normalizePath,
  pathExists,
  readJson,
} from './lib/projects.js';

const LEGACY_FILES = [
  '.gitignore',
  'package-lock.json',
  'package.json',
  'vite.config.js',
  'vite.config.ts',
];

function ensureExperimentConfig(projectDir) {
  const configPath = path.join(projectDir, 'experiment.config.json');

  if (pathExists(configPath)) {
    return;
  }

  const metadata = getProjectMetadata(projectDir);
  const config = {
    name: metadata.name,
    entry: metadata.entry,
    brand: metadata.brand,
    match: metadata.match,
  };

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}

function removeLegacyFiles(projectDir) {
  for (const fileName of LEGACY_FILES) {
    const filePath = path.join(projectDir, fileName);

    if (pathExists(filePath)) {
      fs.rmSync(filePath, {force: true});
    }
  }
}

function resolveTopLevelArea(topLevelDirName, projectDirs) {
  const nestedProjects = projectDirs.filter((projectDir) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, projectDir));
    return relativePath === topLevelDirName || relativePath.startsWith(`${topLevelDirName}/`);
  });

  if (nestedProjects.length === 0) {
    return null;
  }

  const areas = [...new Set(nestedProjects.map((projectDir) => {
    const metadata = getProjectMetadata(projectDir);
    return mapBrandToArea(metadata.brand);
  }))];

  if (areas.length === 1) {
    return areas[0];
  }

  return 'special';
}

function moveTopLevelDir(topLevelDirName, area) {
  const sourcePath = path.join(ROOT_DIR, topLevelDirName);
  const baseDir = area === 'special' ? SPECIAL_DIR : path.join(BRANDS_DIR, area);
  const targetPath = path.join(baseDir, topLevelDirName);

  if (sourcePath === targetPath) {
    return null;
  }

  if (pathExists(targetPath)) {
    throw new Error(`Целевая папка уже существует: ${normalizePath(path.relative(ROOT_DIR, targetPath))}`);
  }

  fs.mkdirSync(baseDir, {recursive: true});
  fs.renameSync(sourcePath, targetPath);

  return {
    from: normalizePath(path.relative(ROOT_DIR, sourcePath)),
    to: normalizePath(path.relative(ROOT_DIR, targetPath)),
  };
}

function main() {
  const projectDirs = listProjectDirs({legacyOnly: true});
  const updatedProjects = [];

  for (const projectDir of projectDirs) {
    ensureExperimentConfig(projectDir);
    removeLegacyFiles(projectDir);
    updatedProjects.push(normalizePath(path.relative(ROOT_DIR, projectDir)));
  }

  const moves = [];

  for (const topLevelDirName of listTopLevelEntries()) {
    const area = resolveTopLevelArea(topLevelDirName, projectDirs);

    if (!area) {
      continue;
    }

    const moveResult = moveTopLevelDir(topLevelDirName, area);

    if (moveResult) {
      moves.push(moveResult);
    }
  }

  console.log(`Подготовлено проектов: ${updatedProjects.length}`);
  console.log(`Перемещено верхнеуровневых папок: ${moves.length}`);

  if (moves.length > 0) {
    console.log('\nПеремещения:');

    for (const move of moves) {
      console.log(`  - ${move.from} -> ${move.to}`);
    }
  }
}

main();
