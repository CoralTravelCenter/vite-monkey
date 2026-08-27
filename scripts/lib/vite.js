import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { ROOT_DIR } from "./projects.js";

export const TEMP_DIR = path.join(ROOT_DIR, ".vite-monkey-runner");

export function runVite(command, configPath) {
  const viteCliPath = path.join(
    ROOT_DIR,
    "node_modules",
    "vite",
    "bin",
    "vite.js",
  );

  if (!fs.existsSync(viteCliPath)) {
    throw new Error(
      "Vite не найден в корневом node_modules. Выполни npm install в корне репозитория.",
    );
  }

  const args = [
    viteCliPath,
    ...(command === "build" ? ["build"] : []),
    "--config",
    configPath,
  ];
  const result = spawnSync(process.execPath, args, {
    cwd: ROOT_DIR,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(
      `\nКритическая ошибка при запуске Vite: ${result.error.message}`,
    );
    process.exitCode = 1;
    return false;
  }

  if (result.status !== 0) {
    process.exitCode = result.status || 1;
  }

  return result.status === 0;
}

export function createRunnerViteConfig(config) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const configPath = path.join(TEMP_DIR, `${config.name}.vite.config.mjs`);
  const entryPath = path.join(config.projectDir, config.entry);
  const content = `import fs from 'node:fs';

import Typograf from 'typograf';
import {defineConfig} from 'vite';
import monkey from 'vite-plugin-monkey';

const typograf = new Typograf({
  locale: ['ru', 'en-US'],
  htmlEntity: {type: 'name'},
});

const htmlTypograf = {
  name: 'html-typograf',
  enforce: 'pre',
  load(id) {
    const [filePath, query = ''] = id.split('?');

    if (!filePath.endsWith('.html') || !query.split('&').includes('raw')) {
      return null;
    }

    const source = fs.readFileSync(filePath, 'utf8');
    return 'export default ' + JSON.stringify(typograf.execute(source)) + ';';
  },
};

export default defineConfig({
  root: ${JSON.stringify(config.projectDir)},
  publicDir: false,

  server: {
    open: '/__vite-plugin-monkey.install.user.js',
  },

  resolve: {
    alias: {
      '@utils': ${JSON.stringify(path.join(ROOT_DIR, "utils"))},
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'oxc',
    cssMinify: true,
  },

  plugins: [
    htmlTypograf,

    monkey({
      entry: ${JSON.stringify(entryPath)},

      userscript: {
        name: ${JSON.stringify(config.name)},
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'mindbox/vite-monkey',
        match: ${JSON.stringify(config.match, null, 8)},
      },

      server: {
        open: false,
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
