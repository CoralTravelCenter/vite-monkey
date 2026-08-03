#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

import {
  ROOT_DIR,
  getProjectMetadata,
  pathExists,
  resolveProjectDir,
} from "./lib/projects.js";
import { runVite } from "./lib/vite.js";

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
}

function generateIndexHtml(config) {
  const htmlPath = path.join(config.projectDir, "index.html");
  const webEntryPath = config.entry.replaceAll("\\", "/");

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

  fs.writeFileSync(htmlPath, htmlContent, "utf8");
}

function createHtmlViteConfig(config, outDir) {
  const configPath = path.join(config.projectDir, "vite-html.config.js");

  const configContent = `import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  root: ${JSON.stringify(config.projectDir)},
  resolve: {
    alias: {
      '@utils': ${JSON.stringify(path.join(ROOT_DIR, "utils"))},
    },
  },
  plugins: [viteSingleFile()],
  build: {
    outDir: ${JSON.stringify(outDir)},
    emptyOutDir: true,
    minify: true,
    target: 'esnext',
    modulePreload: false
  }
});`;

  fs.writeFileSync(configPath, configContent, "utf8");
  return configPath;
}

function postProcessBuilds(config, outDir) {
  const builtHtmlPath = path.join(outDir, "index.html");

  if (!fs.existsSync(builtHtmlPath)) {
    console.error("\nОшибка: index.html не найден после сборки.");
    return;
  }

  const html = fs
    .readFileSync(builtHtmlPath, "utf8")
    .replace(/\r/g, "")
    .replace(/\\r/g, "");

  const stylesTag = (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join(
    "\n",
  );
  const scriptsTag = (
    html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []
  ).join("\n");

  let rawStyles = "";
  for (const match of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
    rawStyles += match[1] + "\n";
  }
  rawStyles = rawStyles.trim();

  let rawScripts = "";
  for (const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
    rawScripts += match[1] + "\n";
  }
  rawScripts = rawScripts.trim();

  let bodyContent =
    html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ||
    `<div id="widget-${config.name}"></div>`;
  bodyContent = bodyContent
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .trim();

  bodyContent = bodyContent.replace(
    /<h([1-6])([^>]*)>/gi,
    (match, level, attrs) => {
      const defaultClass = level === "1" ? "title-1 mb-16" : "title-2 mb-16";
      if (/class=(["'])/.test(attrs)) {
        return match.replace(/class=["']/, `$&${defaultClass} `);
      }
      return `<h${level} class="${defaultClass}"${attrs}>`;
    },
  );

  const crmWidgetContent = `<div data-widget-type="1">
${stylesTag}
<section class="coral">
    <article>
        <div class="wrapper">
            ${bodyContent}
        </div>
    </article>
</section>
${scriptsTag}
</div>`;

  const crmOutPath = path.join(outDir, "crm-widget.html");
  fs.writeFileSync(crmOutPath, crmWidgetContent, "utf8");

  let mindboxContent = `<script>\n(() => {\n`;

  if (rawStyles) {
    const escapedStyles = rawStyles
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$")
      .replace(/<\/script>/gi, "<\\/script>");

    mindboxContent += `  function ensureStyles() {
    if (document.getElementById('${config.name}-styles')) return;
    const style = document.createElement('style');
    style.id = '${config.name}-styles';
    style.textContent = \`${escapedStyles}\`;
    document.head.appendChild(style);
  }
  ensureStyles();\n\n`;
  }

  if (rawScripts) {
    mindboxContent += `  ${rawScripts}\n`;
  }

  mindboxContent += `})();\n</script>`;

  const mindboxOutPath = path.join(outDir, "mindbox-widget.html");
  fs.writeFileSync(mindboxOutPath, mindboxContent, "utf8");

  console.log(`\nУспешно! Сгенерированы файлы:`);
  console.log(`- Для CRM:     ${path.relative(ROOT_DIR, crmOutPath)}`);
  console.log(`- Для Mindbox: ${path.relative(ROOT_DIR, mindboxOutPath)}`);
}

function main() {
  const { command, projectPath } = parseArgs(process.argv.slice(2));

  if (!["dev", "build"].includes(command)) {
    throw new Error("Команда должна быть dev или build.");
  }

  if (!projectPath) {
    throw new Error(`Укажи проект: npm run ${command}:html -- project-name`);
  }

  const config = resolveProjectConfig(projectPath);
  assertConfig(config);

  const outDir = path.join(ROOT_DIR, "html-build", config.name);
  generateIndexHtml(config);
  const configPath = createHtmlViteConfig(config, outDir);

  console.log(`Building HTML for: ${config.name}`);
  console.log(
    `Entry: ${path.relative(ROOT_DIR, path.join(config.projectDir, config.entry))}`,
  );

  const isSuccess = runVite(command, configPath);

  if (isSuccess && command === "build") {
    postProcessBuilds(config, outDir);
  }
}

try {
  main();
} catch (error) {
  console.error(`\nОшибка: ${error.message}`);
  process.exitCode = 1;
}
