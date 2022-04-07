import type { Message, Reporter } from '../types/index'

export function ajaxInterceptor(
  window: Window & typeof globalThis,
  reporter: Reporter,
) {
  const xhr = window.XMLHttpRequest.prototype
  if (!xhr) return

  const send = xhr.send
  const open = xhr.open
  const reportContent: Message = {
    type: 'ajax',
    request: undefined,
    startTime: undefined,
    duration: undefined,
    error: undefined,
  }
  xhr.open = function(...args) {
    const [method, url] = args
    reportContent.request = { method, url }
    return open.apply(this, args as any)
  }
  xhr.send = function(...args) {
    this.addEventListener('loadstart', () => {
      reportContent.startTime = Date.now()
    })
    this.addEventListener('error', (e) => {
      // reportContent.error =
    })
    this.addEventListener('readystatechange', (event: Event) => {
      const instance = event.target as XMLHttpRequest
      if (instance.readyState === XMLHttpRequest.DONE) {
        if (instance.status !== 200)
          reportContent.error = instance.response
      }
    })
    this.addEventListener('loadend', () => {
      if (reportContent.startTime)
        reportContent.duration = Date.now() - reportContent.startTime
    })
    return send.apply(this, args)
  }
}
