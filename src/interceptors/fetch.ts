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
        const error = await response.json()
        reporter({
          type: 'fetch',
          url: url.toString(),
          request: JSON.stringify(options),
          error,
          duration: Date.now() - startTime,
          startTime,
        })
      }
    }
    catch (error) {
      reporter({
        type: 'fetch',
        url: url.toString(),
        request: JSON.stringify(options),
        error,
        duration: Date.now() - startTime,
        startTime,
      })
      throw error
    }

    return response
  }
}
