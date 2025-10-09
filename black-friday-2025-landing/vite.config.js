import {defineConfig} from 'vite';
import monkey from 'vite-plugin-monkey';
import pugPlugin from "vite-plugin-pug";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    pugPlugin(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.coral.ru/monkey/'],
      },
    }),
  ],
});
