# Deployment Notes (Vercel)

## Build
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Required Environment Variables
Set in Vercel Project Settings:

### Frontend
- `VITE_CHAT_API_URL=/api/chat`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Server-side
- `N8N_WEBHOOK_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Security Baseline
- Protect `/chat` with Supabase session.
- Use `/api/chat` proxy for all chatbot traffic.
- Keep `N8N_WEBHOOK_URL` private.
- Apply rate limiting and input trimming in server endpoint.

## Local Development
For local-only testing against n8n webhook, you can set:
- `VITE_N8N_WEBHOOK_URL=https://...`

Vite dev proxy will map `/api/chat` to that URL.
