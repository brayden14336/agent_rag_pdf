# Deployment Notes (Vercel)

## Build
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Environment Variables
Set in Vercel Project Settings:
- `VITE_N8N_WEBHOOK_URL`

## Recommended Architecture for Public Deployments
- Do not call n8n webhook directly from browser in production.
- Add a server-side API route and enforce auth + rate limits there.

## Quick Commands
```bash
npm ci
npm run build
```
