import type { VercelRequest, VercelResponse } from '@vercel/node'

type VerifyBody = {
  token?: unknown
}

function json(res: VercelResponse, status: number, payload: unknown) {
  res.status(status).json(payload)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return json(res, 500, { error: 'Missing TURNSTILE_SECRET_KEY' })
  }

  const body = (req.body ?? {}) as VerifyBody
  const token = typeof body.token === 'string' ? body.token.trim() : ''

  if (!token) {
    return json(res, 400, { error: 'Captcha token required' })
  }

  const ipHeader = req.headers['x-forwarded-for']
  const remoteip =
    typeof ipHeader === 'string' ? ipHeader.split(',')[0].trim() : req.socket.remoteAddress

  try {
    const payload = new URLSearchParams()
    payload.set('secret', secret)
    payload.set('response', token)
    if (remoteip) payload.set('remoteip', remoteip)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    })

    const result = (await response.json()) as { success?: boolean }

    if (!result.success) {
      return json(res, 400, { error: 'Captcha verification failed' })
    }

    return json(res, 200, { ok: true })
  } catch {
    return json(res, 502, { error: 'Captcha verification upstream error' })
  }
}
