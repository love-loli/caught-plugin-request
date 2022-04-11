import type { Register } from './index.d'
import type { Config, Message, Plugin, Reporter } from './types/index'
import { ajaxInterceptor } from './interceptors/ajax'
import { fetchInterceptor } from './interceptors/fetch'

const reporter: Reporter = (message: Message) => {
  console.log(message)
}
export function initInterceptors(config: Config) {
  if (!config) {
    ajaxInterceptor(window, reporter)
    fetchInterceptor(window, reporter)
  }
}

export class Request implements Plugin {
  constructor(config: Config) {
    initInterceptors(config)
  }

  apply(register: Register) {
    register.schedulable('request', () => {})
  }
}
