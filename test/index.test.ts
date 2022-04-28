import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { Window } from 'happy-dom'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { fetchInterceptor } from '../src/interceptors/fetch'

const baseURL = 'https://res-endpoint-test'
const restHandler = [
  rest.get(`${baseURL}/200`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({
      success: true,
      code: '02000100',
      data: null,
    }))
  }),
  rest.post(`${baseURL}/200`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({
      success: true,
      code: '02000100',
      data: req,
    }))
  }),
  rest.get(`${baseURL}/401`, (_, res, ctx) => {
    return res(ctx.status(401), ctx.json({
      success: false,
      code: '02000401',
      data: null,
    }))
  }),
  rest.get(`${baseURL}/500`, (_, res, ctx) => {
    return res(ctx.status(500))
  }),
]
const server = setupServer(...restHandler)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('fetch', () => {
  let result: any
  const window = new Window()
  beforeAll(() => {
    fetchInterceptor(window as any, (content) => {
      result = content
    })
  })
  it('200', async() => {
    await window.fetch(`${baseURL}/200`)
    expect(result).toBe(undefined)
  })

  it('401', async() => {
    await window.fetch(`${baseURL}/401`, { method: 'get' })
    expect(result).toMatchObject({
      type: 'fetch',
      content: {
        status: 401,
        statusText: 'Unauthorized',
        response: '{"success":false,"code":"02000401","data":null}',
        url: 'https://res-endpoint-test/401',
        method: 'get',
      },
    })
    expect(result.duration).toBeTypeOf('number')
    expect(result.startTime).toBeTypeOf('number')
  })

  it('500', async() => {
    await window.fetch(`${baseURL}/500`, {
      method: 'get',
    })
    expect(result).toMatchObject({
      type: 'fetch',
      content: {
        status: 500,
        statusText: 'Internal Server Error',
        response: '',
        url: 'https://res-endpoint-test/500',
        method: 'get',
      },
    })
    expect(result.duration).toBeTypeOf('number')
    expect(result.startTime).toBeTypeOf('number')
  })
})
