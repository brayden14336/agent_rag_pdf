import type { PropsWithChildren } from 'react'

type ChatLayoutProps = PropsWithChildren<{
  title?: string
  subtitle?: string
}>

export default function ChatLayout({
  title = 'RAG Chat',
  subtitle = 'Consulta PDFs con contexto y respuestas precisas',
  children,
}: ChatLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-electric-500/20 blur-[120px]" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-indigoGlow-500/15 blur-[140px]" />
      </div>
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.32em] text-electric-400">
            Research Assistant
          </span>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">{subtitle}</p>
        </header>
        <section className="flex flex-1 flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur-xl sm:p-8">
          {children}
        </section>
      </div>
    </div>
  )
}
