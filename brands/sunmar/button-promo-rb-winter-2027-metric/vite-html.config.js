import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  root: "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\brands\\sunmar\\button-promo-rb-winter-2027-metric",
  resolve: {
    alias: {
      '@utils': "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\utils",
    },
  },
  plugins: [viteSingleFile()],
  build: {
    outDir: "C:\\Users\\ruslan1\\Documents\\01ruslan\\work\\vite-monkey\\html-build\\button-promo-rb-winter-2027-metric",
    emptyOutDir: true,
    minify: true,
    target: 'esnext',
    modulePreload: false
  }
});