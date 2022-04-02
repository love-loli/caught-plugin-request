export function ajaxInterceptor(
  reporter: (message: unknown) => void,
) {
  const xhr = XMLHttpRequest.prototype
  if (!xhr) return
  const send = xhr.send
  xhr.send = function(...args: [body?: Document | XMLHttpRequestBodyInit | null | undefined]) {
    this.addEventListener('loadstart', () => {
      // TODO: ajaxStart
    })
    this.addEventListener('loadend', () => {
      // TODO: ajaxEnd
    })
    this.addEventListener('error', (err) => {
      reporter(err.target)
    })
    this.addEventListener('onreadystatechange', (event: Event) => {
      if (this.readyState === 4) {
        const instance = event.target as XMLHttpRequest
        if (instance.status !== 200) reporter(instance)
      }
    })
    return send.apply(this, args)
  }
}
