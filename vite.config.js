import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    watch: {
      // The backend runs its own separate dev server (node --watch) and writes
      // its own data files (backend/data/*.json). Vite must not watch that
      // folder, or every write there (e.g. the page-view logger) would trigger
      // a frontend reload, which would log another page view, causing a loop.
      ignored: ['**/backend/**'],
    },
  },
})
