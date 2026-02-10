import type { ReactElement } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: '$0',
    detail: 'Ideal para pruebas internas',
    features: ['Hasta 50 consultas por dia', '1 documento activo', 'Soporte comunitario'],
  },
  {
    name: 'Pro',
    price: '$19',
    detail: 'Equipos pequenos y consultoria',
    features: ['Consultas ampliadas', 'Multiples documentos', 'Soporte prioritario'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    detail: 'Control total y seguridad avanzada',
    features: ['SSO y auditoria', 'SLA dedicado', 'Escalado administrado'],
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-900 px-4 py-10 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-10">
          <nav className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-electric-400">
              <Bot className="h-4 w-4" />
              DOCMIND AI
            </div>
            <Link
              to="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-electric-400/60 hover:text-white"
            >
              Iniciar sesion
            </Link>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-5xl"
          >
            Chatbot RAG privado para consultar PDFs tecnicos con velocidad y control.
          </motion.h1>

          <p className="mt-6 max-w-2xl text-slate-300">
            Diseñado para equipos que necesitan respuestas confiables desde documentos reales,
            con acceso protegido, trazabilidad y experiencia moderna.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-electric-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-electric-400"
            >
              Probar plataforma
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#planes"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30"
            >
              Ver planes
            </a>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Acceso protegido"
            text="Solo usuarios autorizados acceden al chat y consumo de tokens."
          />
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Respuestas claras"
            text="Markdown estructurado, tablas y bloques tecnicos faciles de escanear."
          />
          <FeatureCard
            icon={<Lock className="h-5 w-5" />}
            title="Arquitectura segura"
            text="Proxy server-side y controles anti abuso para produccion."
          />
        </section>

        <section id="planes" className="mt-10 grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-electric-400">{plan.price}</p>
              <p className="mt-1 text-sm text-slate-400">{plan.detail}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, text }: { icon: ReactElement; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 inline-flex rounded-lg bg-electric-400/15 p-2 text-electric-300">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{text}</p>
    </article>
  )
}
