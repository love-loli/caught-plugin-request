import type { Register } from '../index.d'
export interface Plugin {
  apply(register: Register): void
}
export interface Config {
  fetch?: boolean
  ajax?: boolean
}
export interface Message{
  type: 'ajax' | 'fetch'
  startTime: number
  duration: number
  url: string
  request: string | null
  /* 二选一 */
  error: string
}
type MessageInit = Message
export type Reporter = (message: MessageInit) => void
