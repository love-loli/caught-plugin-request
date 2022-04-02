import type { Reporter } from '../types/index'
export function ajaxInterceptor(
  window: Window & typeof globalThis,
  reporter: Reporter,
) {
  const xhr = window.XMLHttpRequest.prototype
  if (!xhr) return
  const send = xhr.send
  xhr.send = function(...args) {
    let startTime: number
    this.addEventListener('loadstart', () => {
      startTime = Date.now()
    })
    this.addEventListener('error', (err) => {
      reporter({
        type: 'ajax',
        url: this.responseURL,
        request: args.toString(),
        startTime,
        duration: Date.now() - startTime,
        error: err,
      })
    })
    this.addEventListener('onreadystatechange', (event: Event) => {
      if (this.readyState === 4) {
        const instance = event.target as XMLHttpRequest
        if (instance.status !== 200) {
          reporter({
            type: 'ajax',
            url: instance.responseURL,
            request: args.toString(),
            startTime,
            duration: Date.now() - startTime,
            error: instance.response,
          })
        }
      }
    })
    return send.apply(this, args)
  }
}
