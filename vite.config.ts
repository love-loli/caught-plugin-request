import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom' // 或 'jsdom', 'node'
  }
})