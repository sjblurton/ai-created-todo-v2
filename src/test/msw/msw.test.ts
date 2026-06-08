import { describe, it, expect } from 'vitest'

describe('MSW smoke test', () => {
  it('intercepts GET /api/v1/todos and returns a mocked response', async () => {
    const response = await fetch('http://localhost/api/v1/todos')
    const body = await response.json()

    expect(response.ok).toBe(true)
    expect(body).toEqual({
      data: [],
      page: 1,
      limit: 20,
      total: 0,
    })
  })
})
