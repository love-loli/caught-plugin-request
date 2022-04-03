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
  xhr.open = function(method, url, async, user, password) {
    reportContent.request = { method, url, async, user, password }
    return open.apply(this, [method, url, async, user, password])
  }
  xhr.send = function(...args) {
    this.addEventListener('loadstart', () => {
      reportContent.startTime = Date.now()
    })
    this.addEventListener('error', (e) => {
      reportContent.error = e.target
    })
    this.addEventListener('onreadystatechange', (event: Event) => {
      const instance = event.target as XMLHttpRequest
      if (instance.readyState === 4 && instance.status !== 200)
        reportContent.error = instance.response
    })
    this.addEventListener('loadend', () => {
      if (reportContent.startTime)
        reportContent.duration = Date.now() - reportContent.startTime
      reporter(reportContent)
    })
    return send.apply(this, args)
  }
}
