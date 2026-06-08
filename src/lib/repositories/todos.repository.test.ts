import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TodosRepository } from './todos.repository'

const mockFindMany = vi.fn()
const mockCount = vi.fn()

const mockPrisma = {
  todo: {
    findMany: mockFindMany,
    count: mockCount,
  },
}

const todo = {
  id: 'todo-1',
  userId: 'user-123',
  title: 'Buy milk',
  dueDate: null,
  status: 'incomplete',
  createdAt: new Date('2024-01-01'),
}

describe('TodosRepository', () => {
  let repo: TodosRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repo = new TodosRepository(mockPrisma as never)
  })

  describe('findMany', () => {
    it('returns todos filtered by userId and status', async () => {
      mockFindMany.mockResolvedValue([todo])

      const result = await repo.findMany({ userId: 'user-123', status: 'incomplete', page: 1, limit: 20 })

      expect(result).toEqual([todo])
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId: 'user-123', status: 'incomplete' },
        orderBy: { createdAt: 'asc' },
        skip: 0,
        take: 20,
      })
    })

    it('calculates skip correctly for page 2', async () => {
      mockFindMany.mockResolvedValue([])

      await repo.findMany({ userId: 'user-123', status: 'incomplete', page: 2, limit: 20 })

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 20 })
      )
    })
  })

  describe('count', () => {
    it('returns the count filtered by userId and status', async () => {
      mockCount.mockResolvedValue(5)

      const result = await repo.count({ userId: 'user-123', status: 'incomplete' })

      expect(result).toBe(5)
      expect(mockCount).toHaveBeenCalledWith({
        where: { userId: 'user-123', status: 'incomplete' },
      })
    })
  })
})
