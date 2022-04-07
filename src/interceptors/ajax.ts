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
    request: {
      method: '',
      url: '',
      status: -1,
      statusText: '',
      response: null,
    },
    startTime: undefined,
    duration: undefined,
    error: undefined,
  }
  xhr.open = function(...args) {
    const [method, url] = args
    reportContent.request.method = method
    reportContent.request.url = url.toString()
    return open.apply(this, args as any)
  }
  xhr.send = function(...args) {
    this.addEventListener('loadstart', () => {
      reportContent.startTime = Date.now()
    })
    this.addEventListener('readystatechange', (event: Event) => {
      const instance = event.currentTarget as XMLHttpRequest
      if (instance.readyState === XMLHttpRequest.DONE) {
        if (instance.status !== 200) {
          reportContent.request.status = instance.status
          reportContent.request.response = instance.response
          reportContent.request.statusText = instance.statusText
          if (reportContent.startTime)
            reportContent.duration = Date.now() - reportContent.startTime
          reporter(reportContent)
        }
      }
    })
    return send.apply(this, args)
  }
}
