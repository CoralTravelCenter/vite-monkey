#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT_DIR, 'docs', 'projects-catalog.md');
const STATUSES = new Set(['active', 'experiment', 'archive', 'needs-review']);

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath);

    if (relativePath === 'templates') {
      continue;
    }

    if (entry.isDirectory()) {
      walk(fullPath, result);
      continue;
    }

    if (entry.name === 'package.json' && relativePath !== 'package.json') {
      result.push(fullPath);
    }
  }

  return result;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function inferBrandArea(projectPath) {
  if (projectPath.includes('magic-promo-sunmar') || projectPath.includes('sunmar')) {
    return 'sunmar';
  }

  if (projectPath.includes('coral')) {
    return 'coral';
  }

  if (projectPath.includes('kalendar-vigod')) {
    return 'campaign';
  }

  return 'unknown';
}

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

function collectDuplicatePackageNames(projects) {
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
  return walk(ROOT_DIR)
    .sort()
    .map((packagePath) => {
      const packageJson = readJson(packagePath);
      const projectDir = path.dirname(packagePath);
      const projectPath = path
        .relative(ROOT_DIR, projectDir)
        .split(path.sep)
        .join('/');
      const experimentConfigPath = path.join(projectDir, 'experiment.config.json');
      const experimentConfig = fs.existsSync(experimentConfigPath)
        ? readJson(experimentConfigPath)
        : null;
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      return {
        path: projectPath,
        packageName: packageJson.name || '',
        brandArea: experimentConfig?.brand || inferBrandArea(projectPath),
        vite: dependencies.vite || '',
        monkey: dependencies['vite-plugin-monkey'] || '',
        hasExperimentConfig: Boolean(experimentConfig),
      };
    });
}

function buildCatalog(projects, existingRows) {
  const duplicateNames = collectDuplicatePackageNames(projects);
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
    '| Path | Package name | Brand/area | Status | Vite | Monkey | Notes |',
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
      notes = appendNote(notes, `package name duplicates \`${project.packageName}\``);
    }

    if (project.packageName && !project.path.endsWith(project.packageName)) {
      notes = appendNote(notes, 'package name does not match folder');
    }

    if (project.hasExperimentConfig) {
      notes = appendNote(notes, 'has experiment.config.json');
    }

    const row = [
      `\`${project.path}\``,
      `\`${project.packageName}\``,
      project.brandArea,
      status,
      `\`${project.vite}\``,
      `\`${project.monkey}\``,
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
