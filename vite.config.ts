/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// `base` måste matcha repo-namnet när appen publiceras på GitHub Pages.
export default defineConfig({
  plugins: [
    react(),
    // Offline-läge: allt (kod, låtdata, bilder) cachas av en service worker vid första besöket.
    // Appen kan sedan installeras på hemskärmen och används utan nät. Ny version hämtas
    // automatiskt nästa gång appen öppnas med nät.
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GP-200 Tone Generator',
        short_name: 'GP-200 Tones',
        description: 'Inställningar för Valeton GP-200 för låtar och ljudtyper – regelbaserat, fungerar offline.',
        lang: 'sv',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpeg,jpg,svg,ico,webmanifest}'],
        // Låtdatan är en chunk på ~1,4 MB – höj gränsen så att den också cachas.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
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
