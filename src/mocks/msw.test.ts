import { describe, it, expect } from 'vitest'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

describe('MSW smoke test', () => {
  it('intercepts GET /api/v1/todos and returns a mocked response', async () => {
    const response = await fetch(`${BASE_URL}/api/v1/todos`)
    const body = await response.json()

    expect(response.ok).toBe(true)
    expect(body.page).toBe(1)
    expect(body.limit).toBe(20)
    expect(Array.isArray(body.data)).toBe(true)
  })
})
