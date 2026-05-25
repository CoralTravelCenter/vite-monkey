import fs from 'node:fs';
import path from 'node:path';

import {ROOT_DIR} from './projects.js';

export const TEMP_DIR = path.join(ROOT_DIR, '.vite-monkey-runner');

export function createRunnerViteConfig(config) {
  fs.mkdirSync(TEMP_DIR, {recursive: true});

  const configPath = path.join(TEMP_DIR, `${config.name}.vite.config.mjs`);
  const entryPath = path.join(config.projectDir, config.entry);
  const content = `import {defineConfig} from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  root: ${JSON.stringify(config.projectDir)},
  publicDir: false,
  resolve: {
    alias: {
      '@utils': ${JSON.stringify(path.join(ROOT_DIR, 'utils'))},
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        compact: true,
      },
    },
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
