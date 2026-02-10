# Chatbot RAG PDF

Aplicacion React + Vite para consultar documentos PDF con un chatbot RAG.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Supabase Auth
- Endpoint seguro en `/api/chat` para Vercel

## Seguridad
- El frontend no debe llamar directo al webhook de n8n en produccion.
- `/api/chat` valida sesion, aplica rate limiting y reenvia la peticion al webhook.
- No subas `.env` al repositorio.

## Variables de entorno
Crea `.env` local usando `.env.example`.

### Frontend (publicas)
- `VITE_CHAT_API_URL` (recomendado `/api/chat`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Server-side (Vercel)
- `N8N_WEBHOOK_URL` (secreta)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

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
3. Ruta `/chat` queda protegida por sesion.
4. Mensajes pasan por `/api/chat` antes de llegar a n8n.

## Despliegue en Vercel
1. Importa el repositorio.
2. Configura variables de entorno.
3. Build command: `npm run build`.
4. Output directory: `dist`.
