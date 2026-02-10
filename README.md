# DocMind AI - Intelligent Multi-PDF RAG System

DocMind AI is a professional-grade RAG (Retrieval-Augmented Generation) ecosystem that turns any PDF URL into a conversational knowledge base in seconds.

**Live Demo:** `https://ai-agent-rag-pdf.vercel.app/`

## Key Features
- Dynamic ingestion: paste a PDF URL and the system downloads, chunks, and vectorizes content automatically.
- Context isolation: metadata filtering ensures responses are grounded on the selected document.
- Conversational memory: MongoDB-backed memory keeps conversation continuity.
- Clean architecture: decoupled backend (n8n on Ubuntu/Docker) and frontend (React on Vercel).
- Resilient workflows: hardened JS node logic to prevent malformed-input failures.

## Technical Stack
- Workflows: n8n
- Frontend: React + TypeScript + Vite + Tailwind + Framer Motion
- Auth & protection: Supabase Auth + Cloudflare Turnstile
- AI models: GPT-4o-mini / Claude Sonnet via OpenRouter
- Vector DB: Qdrant
- Embeddings: `text-embedding-3-small`
- Memory DB: MongoDB Atlas
- Runtime: Ubuntu 24.04 + Docker

## Architecture
1. Ingestion loop: fetch PDF binary, extract text/metadata, normalize and split into chunks.
2. Vectorization: embed chunks and store vectors with `source_url` metadata in Qdrant.
3. Retrieval: AI agent queries Qdrant with strict metadata filters.
4. Response: structured Markdown output with source-aware context.

## Frontend Security Model
- Protected route for chatbot usage (`/chat`).
- CAPTCHA verification before login (`/api/verify-captcha`).
- Server-side chat proxy (`/api/chat`) with auth validation and rate limiting.
- No secret exposure in client bundle.

## Run Locally
```bash
npm install
npm run dev
```

## Environment Variables
Use `.env.example` as template.

### Frontend
- `VITE_CHAT_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_TURNSTILE_SITE_KEY`

### Server-side (Vercel)
- `N8N_WEBHOOK_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `TURNSTILE_SECRET_KEY`

## Deployment
- Platform: Vercel
- Build command: `npm run build`
- Output: `dist`

## Testing Status
- Multi-URL support
- Metadata extraction
- Source-grounded responses
- Automatic document indexing
- Protected login flow and anti-bot checks

## Project Context
Developed for the Metabiblioteca Alfresco technical challenge.
