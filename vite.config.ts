import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://n8n-prueba7.metadatos.org',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
