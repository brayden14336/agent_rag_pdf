import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Turnstile } from '@marsidev/react-turnstile'

import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../services/supabase'

export default function LoginPage() {
  const { session } = useAuth()
  const location = useLocation()
  const redirectTo = useMemo(
    () => (location.state as { from?: string } | null)?.from || '/chat',
    [location.state]
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined
  const resolvedTurnstileSiteKey =
    turnstileSiteKey || (import.meta.env.DEV ? '1x00000000000000000000AA' : undefined)

  if (session) return <Navigate to={redirectTo} replace />

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!captchaToken) {
        setError('Completa el captcha antes de iniciar sesion.')
        setLoading(false)
        return
      }

      await axios.post('/api/verify-captcha', { token: captchaToken })

      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError(authError.message)
      }
    } catch {
      setError('No se pudo validar el captcha. Intenta de nuevo.')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-electric-400">Acceso Seguro</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Iniciar sesion</h1>

        <p className="mt-2 text-sm text-slate-400">
          El registro publico esta desactivado. Solicita credenciales a un administrador.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-100">{error}</p>
        )}

        <label className="mt-5 block text-sm text-slate-300">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-100 outline-none focus:border-electric-400/70"
        />

        <label className="mt-4 block text-sm text-slate-300">Contrasena</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-100 outline-none focus:border-electric-400/70"
        />

        <div className="mt-5">
          {resolvedTurnstileSiteKey ? (
            <Turnstile
              siteKey={resolvedTurnstileSiteKey}
              options={{ theme: 'dark' }}
              onSuccess={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              onError={(code) => {
                setCaptchaToken(null)
                setError(`Captcha error: ${code}. Verifica dominio autorizado y claves.`)
              }}
            />
          ) : (
            <p className="rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-100">
              Falta configurar VITE_TURNSTILE_SITE_KEY.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !resolvedTurnstileSiteKey}
          className="mt-6 w-full rounded-xl bg-electric-500 px-4 py-2.5 font-semibold text-white transition hover:bg-electric-400 disabled:opacity-60"
        >
          {loading ? 'Procesando...' : 'Entrar'}
        </button>

        <Link to="/" className="mt-4 block text-center text-sm text-slate-400 hover:text-slate-200">
          Volver al inicio
        </Link>
      </form>
    </div>
  )
}
