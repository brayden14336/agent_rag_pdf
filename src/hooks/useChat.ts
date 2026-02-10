import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { nanoid } from 'nanoid'

import type { ChatMessageItem } from '../types/chat'

type UseChatOptions = {
  initialMessages?: ChatMessageItem[]
}

type UseChatResult = {
  messages: ChatMessageItem[]
  isLoading: boolean
  isProcessing: boolean
  processingProgress: number
  error: string | null
  currentPdfUrl: string
  setCurrentPdfUrl: (value: string) => void
  sendMessage: (message: string, pdfUrl?: string) => Promise<boolean>
  clearError: () => void
}

const PROCESSING_DURATION_MS = 15000

const extractBotMessage = (data: unknown): string => {
  if (typeof data === 'string') return data
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const candidates = [
      record.message,
      record.response,
      record.output,
      record.text,
      record.answer,
      record.data,
    ]

    for (const value of candidates) {
      if (typeof value === 'string' && value.trim()) return value
    }
  }

  return 'No pude interpretar la respuesta del servidor.'
}

const shouldTriggerProcessing = (text: string) =>
  text.includes('⏳') || /indexaci[oó]n/i.test(text)

export default function useChat(options: UseChatOptions = {}): UseChatResult {
  const { initialMessages = [] } = options
  const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPdfUrl, setCurrentPdfUrlState] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const sessionIdRef = useRef(crypto.randomUUID())
  const currentPdfUrlRef = useRef('')
  const processingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const webhookUrl = useMemo(
    () => import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined,
    []
  )

  const setCurrentPdfUrl = useCallback((value: string) => {
    currentPdfUrlRef.current = value
    setCurrentPdfUrlState(value)
  }, [])

  useEffect(() => {
    currentPdfUrlRef.current = currentPdfUrl
  }, [currentPdfUrl])

  const clearProcessingTimer = useCallback(() => {
    if (processingTimerRef.current) {
      clearInterval(processingTimerRef.current)
      processingTimerRef.current = null
    }
  }, [])

  const startProcessing = useCallback(() => {
    clearProcessingTimer()
    setIsProcessing(true)
    setProcessingProgress(0)
    const startedAt = Date.now()

    processingTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const progress = Math.min(100, Math.round((elapsed / PROCESSING_DURATION_MS) * 100))
      setProcessingProgress(progress)

      if (progress >= 100) {
        clearProcessingTimer()
        setIsProcessing(false)
      }
    }, 300)
  }, [clearProcessingTimer])

  useEffect(() => {
    return () => {
      clearProcessingTimer()
    }
  }, [clearProcessingTimer])

  const clearError = useCallback(() => setError(null), [])

  const sendMessage = useCallback(
    async (message: string, pdfUrl?: string) => {
      const trimmedMessage = message.trim()
      if (!trimmedMessage || !webhookUrl) return false

      const resolvedPdfUrl = (pdfUrl ?? currentPdfUrlRef.current).trim()

      clearError()
      setIsLoading(true)

      const userMessage: ChatMessageItem = {
        id: nanoid(),
        role: 'user',
        content: trimmedMessage,
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        const response = await axios.post(webhookUrl, {
          chatInput: trimmedMessage,
          pdf_url: resolvedPdfUrl,
          sessionId: sessionIdRef.current,
        })

        const botText = extractBotMessage(response.data)

        setMessages((prev) => [
          ...prev,
          {
            id: nanoid(),
            role: 'bot',
            content: botText,
          },
        ])

        if (shouldTriggerProcessing(botText)) {
          startProcessing()
        }
        return true
      } catch {
        setError('No se pudo conectar con el webhook. Revisa la URL o tu red.')
        setMessages((prev) => [
          ...prev,
          {
            id: nanoid(),
            role: 'bot',
            content: 'Hubo un problema al consultar el webhook. Intenta nuevamente.',
          },
        ])
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, startProcessing, webhookUrl]
  )

  return {
    messages,
    isLoading,
    isProcessing,
    processingProgress,
    error,
    currentPdfUrl,
    setCurrentPdfUrl,
    sendMessage,
    clearError,
  }
}
