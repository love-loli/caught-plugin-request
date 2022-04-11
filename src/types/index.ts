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
  content: Partial<{
    method: string
    url: string
    status: number
    statusText: string
    response: any
  }>
}
type MessageInit = Message
export type Reporter = (message: MessageInit) => void
