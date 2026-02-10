export type ChatRole = 'user' | 'bot'

export interface ChatMessageItem {
  id: string
  role: ChatRole
  content: string
}
