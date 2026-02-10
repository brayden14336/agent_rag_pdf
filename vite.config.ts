import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const webhook = env.VITE_N8N_WEBHOOK_URL

  const proxy =
    webhook && webhook.startsWith('http')
      ? {
          '/api/chat': {
            target: new URL(webhook).origin,
            changeOrigin: true,
            secure: true,
            rewrite: () => new URL(webhook).pathname,
          },
        }
      : undefined

  return {
    plugins: [react()],
    server: {
      proxy,
    },
  }
})
