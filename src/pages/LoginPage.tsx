import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../auth/AuthProvider'
import { supabase } from '../services/supabase'

export default function LoginPage() {
  const { session } = useAuth()
  const location = useLocation()
  const redirectTo = useMemo(() => (location.state as { from?: string } | null)?.from || '/chat', [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  if (session) return <Navigate to={redirectTo} replace />

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const action =
      mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

    const { error: authError } = await action
    if (authError) {
      setError(authError.message)
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
        <h1 className="mt-2 text-2xl font-semibold text-white">
          {mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
        </h1>

        {error && <p className="mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-100">{error}</p>}

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

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-electric-500 px-4 py-2.5 font-semibold text-white transition hover:bg-electric-400 disabled:opacity-60"
        >
          {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
        </button>

        <button
          type="button"
          onClick={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}
          className="mt-3 w-full text-sm text-slate-300 hover:text-white"
        >
          {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
        </button>

        <Link to="/" className="mt-4 block text-center text-sm text-slate-400 hover:text-slate-200">
          Volver al inicio
        </Link>
      </form>
    </div>
  )
}
