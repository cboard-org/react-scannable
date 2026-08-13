import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [react()],
  root: 'demo',
  build: {
    emptyOutDir: true,
    outDir: '../styleguide',
  },
});
