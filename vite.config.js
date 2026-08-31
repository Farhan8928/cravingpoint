import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * `manualChunks` is applied to the client build only.
 *
 * In an SSR build React is an external module, and Rollup refuses to put an
 * external into a manual chunk — the SSR pass fails outright with "react cannot
 * be included in manualChunks". Splitting the config on `isSsrBuild` keeps the
 * vendor chunks for the browser bundle while letting `npm run build:ssr` (which
 * feeds scripts/prerender.mjs) resolve React normally.
 *
 * GSAP and Lenis get their own chunk: neither is touched during the prerender,
 * and holding them apart from the React chunk lets the browser cache the motion
 * layer across content-only deploys.
 */
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    // The frame sequences are already emitted as optimised WebP by
    // scripts/process-frames.mjs and live in public/ — nothing here inlines them.
    assetsInlineLimit: 2048,
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            manualChunks: {
              react: ['react', 'react-dom'],
              motion: ['gsap', 'lenis'],
            },
          },
        },
  },
}));
