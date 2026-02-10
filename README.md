# Chatbot RAG PDF

Aplicacion React + Vite para consultar documentos PDF con un chatbot RAG.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Supabase Auth
- Cloudflare Turnstile CAPTCHA
- Endpoint seguro en `/api/chat` para Vercel

## Seguridad
- El frontend no llama directo al webhook de n8n en produccion.
- `/api/chat` valida sesion, aplica rate limiting y reenvia la peticion al webhook.
- `/api/verify-captcha` valida Turnstile antes de autenticar.
- Registro publico deshabilitado (solo usuarios autorizados).
- No subas `.env` al repositorio.

## Variables de entorno
Crea `.env` local usando `.env.example`.

### Frontend (publicas)
- `VITE_CHAT_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TURNSTILE_SITE_KEY`

### Server-side (Vercel)
- `N8N_WEBHOOK_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TURNSTILE_SECRET_KEY`

## Desarrollo
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Flujo de acceso
1. Usuario entra a landing (`/`).
2. Inicia sesion en `/login`.
3. CAPTCHA se valida en backend.
4. Ruta `/chat` queda protegida por sesion.
5. Mensajes pasan por `/api/chat` antes de llegar a n8n.
