import { resolve } from 'node:path';
import { transformAsync } from '@babel/core';
import presetEnv from '@babel/preset-env';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const preserveLegacySyntax = () => ({
  name: 'preserve-legacy-syntax',
  apply: 'build',
  async renderChunk(code) {
    const result = await transformAsync(code, {
      babelrc: false,
      comments: true,
      configFile: false,
      presets: [[presetEnv, { bugfixes: true, modules: false, targets: { ie: '11' } }]],
      sourceMaps: false,
      sourceType: 'unambiguous',
    });

    return result?.code ?? code;
  },
});

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' }), preserveLegacySyntax(), cssInjectedByJsPlugin()],
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.js'),
      formats: ['cjs', 'es'],
      fileName: (format) => (format === 'cjs' ? 'index.js' : 'index.es.js'),
    },
    minify: false,
    rolldownOptions: {
      external: ['react', 'react-dom'],
      output: {
        exports: 'named',
      },
    },
    target: 'es2015',
  },
  test: {
    clearMocks: true,
    environment: 'jsdom',
    globals: true,
  },
});
