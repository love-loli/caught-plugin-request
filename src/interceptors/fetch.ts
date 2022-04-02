export function fetchInterceptor(report: (message: unknown) => void) {
  if (!window.fetch) return
  const originalFetch = window.fetch
  window.fetch = async function(...args) {
    // TODO: fetchStart
    const [url, options] = args
    const response = await originalFetch(url, options).catch((err) => {
      report(err)
      throw err
    })
    if (!response.ok || response.status !== 200)
      report(response)
    return response
  }
}
