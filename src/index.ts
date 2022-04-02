// import type { Register } from 'caught-core'
import { ajaxInterceptor } from './interceptors/ajax'
import { fetchInterceptor } from './interceptors/fetch'

const reporter = (message: unknown) => {
  console.log(message)
}
export function initInterceptors() {
  ajaxInterceptor(reporter)
  fetchInterceptor(reporter)
}
interface Plugin {
  apply(register: any): void
}
export class Request implements Plugin {
  constructor() {
    initInterceptors()
  }

  apply(register: any) {
    // register.schedulable('request',()=>{})
  }
}
