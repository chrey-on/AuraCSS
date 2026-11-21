import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'website'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist/website'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'website/index.html'),
        notfound: resolve(__dirname, 'website/404.html'),
      },
    },
  },
});
