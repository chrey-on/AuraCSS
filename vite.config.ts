import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'AuraCSS',
      fileName: () => 'auracss.bundle.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    minify: 'esbuild',
    sourcemap: true,
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'happy-dom',
  },
});
