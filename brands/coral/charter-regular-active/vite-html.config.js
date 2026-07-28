import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  root: "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\brands\\coral\\charter-regular-active",
  plugins: [viteSingleFile()],
  build: {
    outDir: "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\html-build\\charter-regular-active",
    emptyOutDir: true,
    minify: true,
    target: 'esnext',
    modulePreload: false
  }
});