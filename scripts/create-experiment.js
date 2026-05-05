#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const {stdin: input, stdout: output} = require('node:process');

const {ROOT_DIR, buildProjectDir} = require('./lib/projects.js');
const TEMPLATE_DIR = path.join(ROOT_DIR, 'templates', 'monkey-experiment');

const MATCH_PRESETS = {
  coral: 'https://www.coral.ru/*',
  sunmar: 'https://www.sunmar.ru/*',
  both: 'https://www.coral.ru/*,https://www.sunmar.ru/*',
  custom: '',
};

function parseArgs(argv) {
  const result = {
    name: '',
    brand: '',
    match: '',
    entry: '',
    style: '',
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--brand') {
      result.brand = argv[++i] || '';
      continue;
    }

    if (arg === '--match') {
      result.match = argv[++i] || '';
      continue;
    }

    if (arg === '--entry') {
      result.entry = argv[++i] || '';
      continue;
    }

    if (arg === '--style') {
      result.style = argv[++i] || '';
      continue;
    }

    if (!result.name) {
      result.name = arg;
    }
  }

  return result;
}

function toKebabCase(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function assertValidProjectName(name) {
  if (!name) {
    throw new Error('Имя проекта не может быть пустым.');
  }

  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(name)) {
    throw new Error('Имя проекта должно быть в kebab-case: только латиница, цифры и дефисы.');
  }
}

function resolveTemplateFileName(fileName, replacements) {
  return fileName
    .replaceAll('__ENTRY_FILE__', replacements.ENTRY_FILE)
    .replaceAll('__STYLE_FILE__', replacements.STYLE_FILE);
}

function copyTemplate(sourceDir, targetDir, replacements) {
  for (const entry of fs.readdirSync(sourceDir, {withFileTypes: true})) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, resolveTemplateFileName(entry.name, replacements));

    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, {recursive: true});
      copyTemplate(sourcePath, targetPath, replacements);
      continue;
    }

    let content = fs.readFileSync(sourcePath, 'utf8');

    for (const [token, value] of Object.entries(replacements)) {
      content = content.replaceAll(`__${token}__`, value);
    }

    fs.writeFileSync(targetPath, content);
  }
}

function formatJsonArray(value) {
  return JSON.stringify(
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    null,
    2,
  )
    .split('\n')
    .map((line, index) => index === 0 ? line : `  ${line}`)
    .join('\n');
}

async function resolveOption(rl, currentValue, question, allowedValues, fallbackValue) {
  const rawValue = currentValue || await rl.question(question);
  const value = rawValue.trim().toLowerCase() || fallbackValue;

  if (!allowedValues.includes(value)) {
    throw new Error(`Допустимые значения: ${allowedValues.join(', ')}.`);
  }

  return value;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rl = readline.createInterface({input, output});

  try {
    const rawName = args.name || await rl.question('Имя эксперимента в kebab-case: ');
    const projectName = toKebabCase(rawName);
    assertValidProjectName(projectName);

    const rawBrand = args.brand || await rl.question('Площадка [coral/sunmar/both/custom]: ');
    const brand = rawBrand.trim().toLowerCase() || 'coral';

    if (!Object.hasOwn(MATCH_PRESETS, brand)) {
      throw new Error('Площадка должна быть одной из: coral, sunmar, both, custom.');
    }

    let match = args.match || MATCH_PRESETS[brand];

    if (brand === 'custom' && !match) {
      match = await rl.question('match URL, можно несколько через запятую: ');
    }

    if (!match.trim()) {
      throw new Error('match URL не может быть пустым.');
    }

    const projectDir = buildProjectDir(projectName, brand);

    if (fs.existsSync(projectDir)) {
      throw new Error(`Папка ${path.relative(ROOT_DIR, projectDir)} уже существует.`);
    }

    const entry = await resolveOption(
      rl,
      args.entry,
      'Entry file [main/home]: ',
      ['main', 'home'],
      'main',
    );
    const style = await resolveOption(
      rl,
      args.style,
      'Style format [css/scss]: ',
      ['css', 'scss'],
      'css',
    );

    fs.mkdirSync(projectDir, {recursive: true});
    const projectPath = path.relative(ROOT_DIR, projectDir).split(path.sep).join('/');
    copyTemplate(TEMPLATE_DIR, projectDir, {
      PROJECT_NAME: projectName,
      PROJECT_PATH: projectPath,
      ENTRY_NAME: entry,
      ENTRY_FILE: `${entry}.js`,
      STYLE_FILE: `style.${style}`,
      BRAND: brand,
      MATCH: match,
      MATCH_JSON: formatJsonArray(match),
    });

    console.log(`\nСоздан эксперимент: ${projectName}`);
    console.log(`Папка: ${projectDir}`);
    console.log(`Entry: src/${entry}.js`);
    console.log(`Style: src/style.${style}`);
    console.log('\nСледующие команды:');
    console.log(`  npm run dev:experiment -- ${projectPath}`);
    console.log(`  npm run build:experiment -- ${projectPath}`);
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(`\nОшибка: ${error.message}`);
  process.exitCode = 1;
});
