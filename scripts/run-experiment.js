#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEMP_DIR = path.join(ROOT_DIR, '.vite-monkey-runner');
const MATCH_PRESETS = {
  coral: ['https://www.coral.ru/*'],
  sunmar: ['https://www.sunmar.ru/*'],
  both: ['https://www.coral.ru/*', 'https://www.sunmar.ru/*'],
};

function parseArgs(argv) {
  const [command, projectPath] = argv;

  return {
    command,
    projectPath,
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function inferBrand(projectPath) {
  if (projectPath.includes('sunmar')) {
    return 'sunmar';
  }

  if (projectPath.includes('coral')) {
    return 'coral';
  }

  return 'both';
}

function resolveProjectConfig(projectPath) {
  const projectDir = path.resolve(ROOT_DIR, projectPath);
  const configPath = path.join(projectDir, 'experiment.config.json');

  if (!fs.existsSync(projectDir)) {
    throw new Error(`Папка проекта не найдена: ${projectPath}`);
  }

  if (fs.existsSync(configPath)) {
    const config = readJson(configPath);

    return {
      name: config.name || path.basename(projectDir),
      entry: config.entry || 'src/main.js',
      brand: config.brand || inferBrand(projectPath),
      match: config.match || MATCH_PRESETS[config.brand] || MATCH_PRESETS.both,
      projectDir,
    };
  }

  const mainEntry = path.join(projectDir, 'src', 'main.js');
  const homeEntry = path.join(projectDir, 'src', 'home.js');
  const entry = fs.existsSync(mainEntry)
    ? 'src/main.js'
    : fs.existsSync(homeEntry)
      ? 'src/home.js'
      : 'src/main.js';
  const brand = inferBrand(projectPath);

  return {
    name: path.basename(projectDir),
    entry,
    brand,
    match: MATCH_PRESETS[brand],
    projectDir,
  };
}

function assertConfig(config) {
  const entryPath = path.join(config.projectDir, config.entry);

  if (!fs.existsSync(entryPath)) {
    throw new Error(`Entry file не найден: ${path.relative(ROOT_DIR, entryPath)}`);
  }

  if (!Array.isArray(config.match) || config.match.length === 0) {
    throw new Error('В experiment.config.json поле match должно быть непустым массивом.');
  }
}

function createViteConfig(config) {
  fs.mkdirSync(TEMP_DIR, {recursive: true});

  const configPath = path.join(TEMP_DIR, `${config.name}.vite.config.mjs`);
  const entryPath = path.join(config.projectDir, config.entry);
  const content = `import {defineConfig} from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  root: ${JSON.stringify(config.projectDir)},
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    monkey({
      entry: ${JSON.stringify(entryPath)},
      userscript: {
        name: ${JSON.stringify(config.name)},
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'mindbox/vite-monkey',
        match: ${JSON.stringify(config.match, null, 8)},
      },
      build: {
        fileName: ${JSON.stringify(`${config.name}.user.js`)},
      },
    }),
  ],
});
`;

  fs.writeFileSync(configPath, content);

  return configPath;
}

function getViteBin() {
  const viteBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'vite');

  if (!fs.existsSync(viteBin)) {
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
  const configPath = createViteConfig(config);

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
