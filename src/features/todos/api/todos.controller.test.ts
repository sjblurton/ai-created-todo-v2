import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { TodosController } from './todos.controller'
import type { TodosService } from '@/lib/services/todos.service'

const mockService = {
  listTodos: vi.fn(),
} satisfies Pick<TodosService, 'listTodos'>

const paginatedResult = {
  data: [{ id: 'todo-1', userId: 'user-123', title: 'Buy milk', dueDate: null, status: 'incomplete', createdAt: new Date() }],
  page: 1,
  limit: 20,
  total: 1,
}

function makeRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/v1/todos')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url)
}

describe('TodosController', () => {
  let controller: TodosController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new TodosController(mockService)
  })

  describe('handleList', () => {
    it('returns 401 when userId is null', async () => {
      const response = await controller.handleList(makeRequest(), null)
      expect(response.status).toBe(401)
    })

    it('returns paginated todos for authenticated user', async () => {
      mockService.listTodos.mockResolvedValue(paginatedResult)

      const response = await controller.handleList(makeRequest(), 'user-123')

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toMatchObject({ page: 1, limit: 20, total: 1 })
    })

    it('passes page and limit from query params', async () => {
      mockService.listTodos.mockResolvedValue(paginatedResult)

      await controller.handleList(makeRequest({ page: '2', limit: '10' }), 'user-123')

      expect(mockService.listTodos).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 10 })
      )
    })

    it('defaults to status=incomplete when not specified', async () => {
      mockService.listTodos.mockResolvedValue(paginatedResult)

      await controller.handleList(makeRequest(), 'user-123')

      expect(mockService.listTodos).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'incomplete' })
      )
    })

    it('returns 500 on unexpected error', async () => {
      mockService.listTodos.mockRejectedValue(new Error('DB error'))

      const response = await controller.handleList(makeRequest(), 'user-123')

      expect(response.status).toBe(500)
    })
  })
})
