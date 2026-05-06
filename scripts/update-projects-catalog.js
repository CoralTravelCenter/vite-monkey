#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

import {
  ROOT_DIR,
  getProjectArea,
  getProjectMetadata,
  listProjectDirs,
  normalizePath,
  pathExists,
  readJson,
} from './lib/projects.js';
const CATALOG_PATH = path.join(ROOT_DIR, 'docs', 'projects-catalog.md');
const STATUSES = new Set(['active', 'experiment', 'archive', 'needs-review']);

function hasSpaces(projectPath) {
  return projectPath.split(path.sep).some((part) => part.includes(' '));
}

function appendNote(notes, note) {
  if (!note || notes.includes(note)) {
    return notes;
  }

  return notes ? `${notes}; ${note}` : note;
}

function stripCell(value) {
  return value.trim().replace(/^`|`$/g, '');
}

function parseExistingCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    return new Map();
  }

  const rows = new Map();
  const lines = fs.readFileSync(CATALOG_PATH, 'utf8').split('\n');

  for (const line of lines) {
    if (!line.startsWith('| `')) {
      continue;
    }

    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());

    if (cells.length < 7) {
      continue;
    }

    const projectPath = stripCell(cells[0]);
    const status = cells[3];
    const notes = cells[6];

    rows.set(projectPath, {
      status: STATUSES.has(status) ? status : 'needs-review',
      notes,
    });
  }

  return rows;
}

function collectDuplicateProjectNames(projects) {
  const counts = new Map();

  for (const project of projects) {
    if (!project.packageName) {
      continue;
    }

    counts.set(project.packageName, (counts.get(project.packageName) || 0) + 1);
  }

  return counts;
}

function collectProjects() {
  return listProjectDirs()
    .map((projectDir) => {
      const metadata = getProjectMetadata(projectDir);
      const experimentConfigPath = path.join(projectDir, 'experiment.config.json');
      const experimentConfig = pathExists(experimentConfigPath)
        ? readJson(experimentConfigPath)
        : null;

      return {
        path: metadata.relativePath,
        packageName: metadata.name,
        brandArea: getProjectArea(projectDir),
        entry: metadata.entry,
        match: metadata.match,
        hasExperimentConfig: Boolean(experimentConfig),
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path));
}

function buildCatalog(projects, existingRows) {
  const duplicateNames = collectDuplicateProjectNames(projects);
  const lines = [
    '# Каталог проектов',
    '',
    'Этот файл фиксирует текущие mini-experiments в репозитории. Статус `needs-review` означает, что проект найден автоматически, но его реальное состояние нужно подтвердить вручную.',
    '',
    '## Статусы',
    '',
    '- `active` - используется сейчас.',
    '- `experiment` - гипотеза или временный тест.',
    '- `archive` - больше не используется, но оставлен для истории.',
    '- `needs-review` - статус пока неизвестен.',
    '',
    '## Как обновлять',
    '',
    'При разборе проекта меняем `Status` и дополняем `Notes`: где используется, кто владелец, можно ли архивировать, есть ли связанные задачи.',
    '',
    'Автоматическое обновление списка проектов:',
    '',
    '```bash',
    'npm run update:catalog',
    '```',
    '',
    'Скрипт сохраняет ручные значения `Status` и `Notes` для уже известных путей.',
    '',
    '## Проекты',
    '',
    '| Path | Name | Area | Status | Entry | Match | Notes |',
    '|---|---|---|---|---|---|---|',
  ];

  for (const project of projects) {
    const existing = existingRows.get(project.path);
    const status = existing?.status || 'needs-review';
    let notes = existing?.notes || '';

    if (hasSpaces(project.path)) {
      notes = appendNote(notes, 'path has spaces');
    }

    if (project.packageName && duplicateNames.get(project.packageName) > 1) {
      notes = appendNote(notes, `project name duplicates \`${project.packageName}\``);
    }

    if (project.packageName && !project.path.endsWith(project.packageName)) {
      notes = appendNote(notes, 'project name does not match folder');
    }

    if (project.hasExperimentConfig) {
      notes = appendNote(notes, 'has experiment.config.json');
    }

    const row = [
      `\`${project.path}\``,
      `\`${project.packageName}\``,
      project.brandArea,
      status,
      `\`${project.entry}\``,
      `\`${project.match.join(', ')}\``,
      notes,
    ];

    lines.push(`| ${row.join(' | ')} |`);
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  const existingRows = parseExistingCatalog();
  const projects = collectProjects();
  const catalog = buildCatalog(projects, existingRows);

  fs.writeFileSync(CATALOG_PATH, catalog);
  console.log(`Каталог обновлен: ${path.relative(ROOT_DIR, CATALOG_PATH)}`);
  console.log(`Проектов: ${projects.length}`);
}

main();
