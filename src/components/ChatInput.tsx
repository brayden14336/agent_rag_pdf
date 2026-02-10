import { Send } from 'lucide-react'

type ChatInputProps = {
  pdfUrl: string
  message: string
  onPdfUrlChange: (value: string) => void
  onMessageChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export default function ChatInput({
  pdfUrl,
  message,
  onPdfUrlChange,
  onMessageChange,
  onSend,
  disabled = false,
}: ChatInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-electric-400/70 focus-within:shadow-glow">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
          URL del PDF
        </label>
        <input
          value={pdfUrl}
          onChange={(event) => onPdfUrlChange(event.target.value)}
          placeholder="https://example.com/documento.pdf"
          className="mt-2 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          type="url"
          disabled={disabled}
        />
      </div>

      <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-electric-400/70 focus-within:shadow-glow">
        <textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Escribe tu pregunta..."
          rows={3}
          className="min-h-[72px] flex-1 resize-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-full bg-electric-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-electric-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-400/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Enviar
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
