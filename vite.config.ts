import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Menopause Compass',
        short_name: 'Compass',
        description: 'Menopause education for patients and independent MSCP study for clinicians.',
        theme_color: '#173D40',
        background_color: '#F5F1EA',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'Patient Guide', url: '/learn' },
          { name: 'MSCP Academy', url: '/academy' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}', '**/inter-latin-*.woff2'],
        navigateFallback: '/index.html'
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] }
      }
    }
  }
});
