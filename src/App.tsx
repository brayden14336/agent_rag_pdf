import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import ChatInput from './components/ChatInput'
import ChatLayout from './components/ChatLayout'
import ChatMessage from './components/ChatMessage'
import IndexingLoader from './components/IndexingLoader'
import SkeletonLoader from './components/SkeletonLoader'
import useChat from './hooks/useChat'
import type { ChatMessageItem } from './types/chat'

const starterMessages: ChatMessageItem[] = [
  {
    id: 'welcome',
    role: 'bot',
    content:
      'Hola, soy tu asistente RAG. Comparte un PDF y responde a preguntas con contexto.\n\n- Resumenes\n- Preguntas directas\n- Tablas y listas\n',
  },
  {
    id: 'example',
    role: 'bot',
    content:
      'Ejemplo de tabla:\n\n| Seccion | Descripcion |\n| --- | --- |\n| Metodo | RAG con embeddings |\n| Salida | Respuesta citada |\n',
  },
]

function App() {
  const [message, setMessage] = useState('')
  const initialMessages = useMemo(() => starterMessages, [])
  const endRef = useRef<HTMLDivElement | null>(null)
  const {
    messages,
    isLoading,
    isProcessing,
    processingProgress,
    error,
    currentPdfUrl,
    setCurrentPdfUrl,
    sendMessage,
    clearError,
  } = useChat({ initialMessages })

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isLoading])

  const handleSend = async () => {
    const sent = await sendMessage(message, currentPdfUrl)
    if (sent) {
      setMessage('')
    }
  }

  return (
    <ChatLayout>
      <div className="flex flex-1 flex-col gap-6">
        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
            <button
              type="button"
              onClick={clearError}
              className="ml-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-200/80"
            >
              Cerrar
            </button>
          </div>
        )}

        <AnimatePresence>
          {isProcessing && (
            <IndexingLoader key="indexing" progress={processingProgress} />
          )}
        </AnimatePresence>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {messages.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25 }}
              >
                <ChatMessage role={item.role} content={item.content} />
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <SkeletonLoader />
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        <ChatInput
          pdfUrl={currentPdfUrl}
          message={message}
          onPdfUrlChange={setCurrentPdfUrl}
          onMessageChange={setMessage}
          onSend={handleSend}
          disabled={isLoading || isProcessing}
        />
      </div>
    </ChatLayout>
  )
}

export default App
