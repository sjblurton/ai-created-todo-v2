import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mockHandleList = vi.fn()
const mockHandleCreate = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@/features/todos/api/todos.controller', () => ({
  TodosController: vi.fn(function () {
    return { handleList: mockHandleList, handleCreate: mockHandleCreate }
  }),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({ auth: { getUser: mockGetUser } })
  ),
}))

const { GET, POST } = await import('./route')

describe('GET /api/v1/todos', () => {
  it('passes userId to controller when authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    mockHandleList.mockResolvedValue(new Response('{}', { status: 200 }))

    const req = new NextRequest('http://localhost:3000/api/v1/todos')
    await GET(req)

    expect(mockHandleList).toHaveBeenCalledWith(req, 'user-123')
  })

  it('passes null to controller when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockHandleList.mockResolvedValue(new Response('{}', { status: 401 }))

    const req = new NextRequest('http://localhost:3000/api/v1/todos')
    await GET(req)

    expect(mockHandleList).toHaveBeenCalledWith(req, null)
  })
})

describe('POST /api/v1/todos', () => {
  it('passes userId to controller when authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    mockHandleCreate.mockResolvedValue(new Response('{}', { status: 201 }))

    const req = new NextRequest('http://localhost:3000/api/v1/todos', {
      method: 'POST',
      body: JSON.stringify({ title: 'Buy milk' }),
      headers: { 'Content-Type': 'application/json' },
    })
    await POST(req)

    expect(mockHandleCreate).toHaveBeenCalledWith(req, 'user-123')
  })
})
