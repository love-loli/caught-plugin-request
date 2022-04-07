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
  startTime: number | undefined
  duration: number | undefined
  request: {
    method: string
    url: string
    status: number
    statusText: string
    response: any
  }
  error: unknown
}
type MessageInit = Message
export type Reporter = (message: MessageInit) => void
