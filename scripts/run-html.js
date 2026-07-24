#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

import {ROOT_DIR, getProjectMetadata, pathExists, resolveProjectDir} from './lib/projects.js';

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
}

function generateIndexHtml(config) {
    const htmlPath = path.join(config.projectDir, 'index.html');
    const webEntryPath = config.entry.replaceAll('\\', '/');

    const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.name}</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./${webEntryPath}"></script>
</body>
</html>`;

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
}

function createHtmlViteConfig(config) {
    const configPath = path.join(config.projectDir, 'vite-html.config.js');
    const outDir = path.join(ROOT_DIR, 'html-build', config.name);

    const configContent = `import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  root: ${JSON.stringify(config.projectDir)},
  plugins: [viteSingleFile()],
  build: {
    outDir: ${JSON.stringify(outDir)},
    emptyOutDir: true,
    minify: true,
    target: 'esnext',
  }
});`;

    fs.writeFileSync(configPath, configContent, 'utf8');
    return configPath;
}

function getViteBin() {
    const viteBin = path.join(ROOT_DIR, 'node_modules', '.bin', 'vite');

    if (!pathExists(viteBin)) {
        throw new Error('Vite не найден в корневом node_modules.');
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
        shell: true
    });

    if (result.error) {
        console.error(`\nКритическая ошибка при запуске Vite: ${result.error.message}`);
        process.exitCode = 1;
        return false;
    }

    if (result.status !== 0) {
        process.exitCode = result.status || 1;
    }

    return result.status === 0;
}

function main() {
    const {command, projectPath} = parseArgs(process.argv.slice(2));

    if (!['dev', 'build'].includes(command)) {
        throw new Error('Команда должна быть dev или build.');
    }

    if (!projectPath) {
        throw new Error(`Укажи проект: npm run ${command}:html -- project-name`);
    }

    const config = resolveProjectConfig(projectPath);
    assertConfig(config);

    generateIndexHtml(config);
    const configPath = createHtmlViteConfig(config);

    console.log(`Building HTML for: ${config.name}`);
    console.log(`Entry: ${path.relative(ROOT_DIR, path.join(config.projectDir, config.entry))}`);

    runVite(command, configPath);
}

try {
    main();
} catch (error) {
    console.error(`\nОшибка: ${error.message}`);
    process.exitCode = 1;
}