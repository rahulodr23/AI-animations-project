import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Copy standalone animation folders into dist so iframe previews
 * (/animations/<id>/index.html) work on Vercel and other static hosts.
 * Vite only ships the HTML entry + publicDir by default — not /animations.
 */
function copyAnimations() {
  return {
    name: 'copy-animations',
    closeBundle() {
      const from = resolve('animations');
      const to = resolve('dist/animations');
      if (!existsSync(from)) return;
      cpSync(from, to, { recursive: true });
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [copyAnimations()],
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['.'],
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
});
