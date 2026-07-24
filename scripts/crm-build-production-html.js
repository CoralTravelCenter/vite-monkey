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
  <div id="widget-${config.name}"></div>
  <script type="module" src="./${webEntryPath}"></script>
</body>
</html>`;

    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
}

function createHtmlViteConfig(config, outDir) {
    const configPath = path.join(config.projectDir, 'vite-html.config.js');

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

function postProcessForCrm(config, outDir) {
    const builtHtmlPath = path.join(outDir, 'index.html');

    if (!fs.existsSync(builtHtmlPath)) {
        console.error('\nОшибка: index.html не найден после сборки.');
        return;
    }

    const html = fs.readFileSync(builtHtmlPath, 'utf8')
        .replace(/\r/g, '')
        .replace(/\\r/g, '');

    const styles = (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join('\n');
    const scripts = (html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).join('\n');

    let bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || `<div id="widget-${config.name}"></div>`;
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim();

    bodyContent = bodyContent.replace(/<h([1-6])([^>]*)>/gi, (match, level, attrs) => {
        const defaultClass = level === '1' ? 'title-1 mb-16' : 'title-2 mb-16';
        if (attrs.includes('class="')) {
            return `<h${level}${attrs.replace('class="', `class="${defaultClass} `)}>`;
        }
        return `<h${level} class="${defaultClass}"${attrs}>`;
    });

    const crmWidgetContent = `<div data-widget-type="1">
${styles}
<section class="coral">
    <article>
        <div class="wrapper">
            ${bodyContent}
        </div>
    </article>
</section>
${scripts}
</div>`;

    const crmOutPath = path.join(outDir, 'crm-widget.html');
    fs.writeFileSync(crmOutPath, crmWidgetContent, 'utf8');

    console.log(`\nУспешно! Файл для вставки в CRM сохранен: ${path.relative(ROOT_DIR, crmOutPath)}`);
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

    const outDir = path.join(ROOT_DIR, 'html-build', config.name);
    generateIndexHtml(config);
    const configPath = createHtmlViteConfig(config, outDir);

    console.log(`Building HTML for: ${config.name}`);
    console.log(`Entry: ${path.relative(ROOT_DIR, path.join(config.projectDir, config.entry))}`);

    const isSuccess = runVite(command, configPath);

    if (isSuccess && command === 'build') {
        postProcessForCrm(config, outDir);
    }
}

try {
    main();
} catch (error) {
    console.error(`\nОшибка: ${error.message}`);
    process.exitCode = 1;
}