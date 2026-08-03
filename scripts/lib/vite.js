import fs from "node:fs";
import path from "node:path";

import { ROOT_DIR } from "./projects.js";

export const TEMP_DIR = path.join(ROOT_DIR, ".vite-monkey-runner");

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
