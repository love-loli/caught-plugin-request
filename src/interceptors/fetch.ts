import type { Reporter } from '../types/index'
export function fetchInterceptor(
  window: Window & typeof globalThis,
  reporter: Reporter,
) {
  if (!window.fetch) return
  const originalFetch = window.fetch
  window.fetch = async function(...args) {
    const startTime = Date.now()
    const [url, options] = args
    let response
    try {
      response = await originalFetch(...args)
      if (!response.ok || response.status !== 200) {
        const { status, statusText } = response
        reporter({
          type: 'fetch',
          content: {
            status,
            statusText,
            response: await response.text(),
            url: url.toString(),
            method: options?.method ?? 'unknown',
          },
          duration: Date.now() - startTime,
          startTime,
        })
      }
    }
    catch (error) {
      reporter({
        type: 'fetch',
        content: {
          response: error,
          url: url.toString(),
          method: options?.method ?? 'unknown',
        },
        duration: Date.now() - startTime,
        startTime,
      })
      throw error
    }

    return response
  }
}
