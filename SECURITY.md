# Security Policy

## Supported Deployment Model
This project is intended to run with a protected backend proxy. Do not expose direct production webhooks to public clients.

## Secret Management
- Never commit `.env` files.
- Use `.env.example` as template only.
- Store secrets in Vercel Project Environment Variables.

## Minimum Production Controls
- Require authentication before accessing the chatbot UI.
- Route chat requests through a server-side endpoint (`/api/chat`) that injects webhook secrets.
- Enforce rate limiting per user/IP.
- Validate and sanitize user input server-side.
- Enable CORS allowlist only for your domains.

## Incident Response
If a secret is leaked:
1. Rotate webhook/API credentials immediately.
2. Remove exposed values from repository history.
3. Redeploy with new credentials.
