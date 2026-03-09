import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // Enables React fast refresh and JSX transform.
    react(),
    // Configure PWA assets/service worker + web app manifest.
    VitePWA({
      // Automatically fetch and activate newer service worker versions.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.svg', 'pwa-192x192.png', 'pwa-512x512-v2.png'],
      manifest: {
        name: 'ExpertConnect',
        short_name: 'ExpertConnect',
        description: 'Connect with industry experts for professional consultation.',
        theme_color: '#121212',
        background_color: '#ffffff',
        // Opens like an installable app without browser chrome.
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512-v2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
