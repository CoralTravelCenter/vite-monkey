import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  root: "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\brands\\sunmar\\metric-rb-sunmar-2027",
  plugins: [viteSingleFile()],
  build: {
    outDir: "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\html-build\\metric-rb-sunmar-2027",
    emptyOutDir: true,
    minify: true,
    target: 'esnext',
    modulePreload: false
  }
});