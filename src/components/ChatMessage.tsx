import type { ReactNode } from 'react'
import { AlertTriangle, BadgeCheck, Lightbulb } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import type { ChatRole } from '../types/chat'

type ChatMessageProps = {
  role: ChatRole
  content: string
}

const roleStyles: Record<ChatRole, { container: string; bubble: string }> = {
  user: {
    container: 'justify-end',
    bubble: 'bg-indigoGlow-600 text-white',
  },
  bot: {
    container: 'justify-start',
    bubble: 'bg-zinc-800 text-slate-200',
  },
}

type CalloutType = 'important' | 'didYouKnow' | 'ok' | null

const detectCallout = (text: string): CalloutType => {
  const normalized = text.toUpperCase()
  if (normalized.includes('IMPORTANTE') || normalized.includes('⚠')) return 'important'
  if (normalized.includes('SABIAS QUE') || normalized.includes('💡')) return 'didYouKnow'
  if (normalized.includes('✅')) return 'ok'
  return null
}

const calloutStyles: Record<
  Exclude<CalloutType, null>,
  { label: string; className: string; icon: ReactNode }
> = {
  important: {
    label: 'IMPORTANTE',
    className: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  didYouKnow: {
    label: 'SABIAS QUE',
    className: 'border-sky-300/30 bg-sky-300/10 text-sky-100',
    icon: <Lightbulb className="h-4 w-4" />,
  },
  ok: {
    label: 'VALIDADO',
    className: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100',
    icon: <BadgeCheck className="h-4 w-4" />,
  },
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const styles = roleStyles[role]
  const calloutType = role === 'bot' ? detectCallout(content) : null

  return (
    <div className={`flex w-full ${styles.container}`}>
      <div
        className={`w-full max-w-[42rem] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${styles.bubble}`}
      >
        {calloutType && (
          <div
            className={`mb-3 inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold tracking-[0.12em] ${calloutStyles[calloutType].className}`}
          >
            {calloutStyles[calloutType].icon}
            <span>{calloutStyles[calloutType].label}</span>
          </div>
        )}

        <div className="prose prose-invert prose-sm max-w-none text-slate-100 prose-headings:mb-2 prose-headings:mt-4 prose-headings:text-white prose-p:my-2 prose-strong:font-bold prose-strong:text-electric-400 prose-li:my-1 prose-ul:my-2 prose-ol:my-2 prose-code:rounded prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-electric-300 prose-pre:my-3 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/40 prose-pre:p-3 prose-table:my-3 prose-table:w-full prose-th:border-b prose-th:border-white/10 prose-th:bg-white/5 prose-th:px-3 prose-th:py-2 prose-td:border-b prose-td:border-white/10 prose-td:px-3 prose-td:py-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ul: ({ children }) => (
                <ul className="ml-5 list-disc space-y-1 pl-1 marker:text-slate-400">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="ml-5 list-decimal space-y-1 pl-1 marker:text-slate-400">{children}</ol>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full border-collapse text-left text-xs">{children}</table>
                </div>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
