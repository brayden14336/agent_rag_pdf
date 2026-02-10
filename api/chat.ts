import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

type ChatPayload = {
  chatInput?: unknown
  pdf_url?: unknown
  sessionId?: unknown
}

type RateState = {
  count: number
  resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 20
const rateMap = new Map<string, RateState>()

function json(res: VercelResponse, status: number, payload: unknown) {
  res.status(status).json(payload)
}

function getClientIp(req: VercelRequest) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress ?? 'unknown'
}

function getRateKey(req: VercelRequest, userId: string) {
  return `${userId}:${getClientIp(req)}`
}

function isRateLimited(key: string) {
  const now = Date.now()
  const state = rateMap.get(key)

  if (!state || now > state.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  state.count += 1
  rateMap.set(key, state)
  return state.count > RATE_LIMIT_MAX
}

function toSafeString(value: unknown, maxLen: number) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLen)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY

  if (!n8nWebhookUrl) {
    return json(res, 500, { error: 'Missing N8N_WEBHOOK_URL' })
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return json(res, 500, { error: 'Missing SUPABASE_URL/SUPABASE_ANON_KEY' })
  }

  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token) {
    return json(res, 401, { error: 'Unauthorized' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return json(res, 401, { error: 'Invalid session' })
  }

  const rateKey = getRateKey(req, data.user.id)
  if (isRateLimited(rateKey)) {
    return json(res, 429, { error: 'Rate limit exceeded. Try again in 1 minute.' })
  }

  const body = (req.body ?? {}) as ChatPayload

  const chatInput = toSafeString(body.chatInput, 4000)
  const pdf_url = toSafeString(body.pdf_url, 2000)
  const sessionId = toSafeString(body.sessionId, 120)

  if (!chatInput) {
    return json(res, 400, { error: 'chatInput is required' })
  }

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatInput, pdf_url, sessionId }),
    })

    const text = await response.text()
    const contentType = response.headers.get('content-type') ?? ''

    if (!response.ok) {
      return json(res, response.status, {
        error: 'n8n webhook failed',
        detail: text.slice(0, 500),
      })
    }

    if (contentType.includes('application/json')) {
      return res.status(200).send(text)
    }

    return json(res, 200, { response: text })
  } catch {
    return json(res, 502, { error: 'Upstream connection error' })
  }
}
