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
  startTime?: number
  duration?: number
  request?: object
  error: unknown
}
type MessageInit = Message
export type Reporter = (message: MessageInit) => void
