/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base` måste matcha repo-namnet när appen publiceras på GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/valeton_gp_200_song_sounds/' : '/',
  build: {
    // Låtdatan (~1 MB, ~250 kB gzip) läggs i en egen chunk så att den cachas separat från koden.
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes('/src/data/') ? 'tone-data' : undefined),
      },
    },
  },
  test: {
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
