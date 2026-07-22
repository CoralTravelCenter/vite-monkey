import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  root: "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\brands\\sunmar\\swap-button",
  plugins: [viteSingleFile()],
  build: {
    outDir: 'dist-html',
    emptyOutDir: true,
    minify: true,
    target: 'esnext',
  }
});