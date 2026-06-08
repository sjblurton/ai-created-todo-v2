import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TodosService } from './todos.service'
import type { TodosRepository } from '@/lib/repositories/todos.repository'

const todo = {
  id: 'todo-1',
  userId: 'user-123',
  title: 'Buy milk',
  dueDate: null,
  status: 'incomplete',
  createdAt: new Date('2024-01-01'),
}

const mockRepo = {
  findMany: vi.fn(),
  count: vi.fn(),
  create: vi.fn(),
} satisfies Pick<TodosRepository, 'findMany' | 'count' | 'create'>

describe('TodosService', () => {
  let service: TodosService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new TodosService(mockRepo)
  })

  it('returns paginated todos', async () => {
    mockRepo.findMany.mockResolvedValue([todo])
    mockRepo.count.mockResolvedValue(1)

    const result = await service.listTodos({ userId: 'user-123', status: 'incomplete', page: 1, limit: 20 })

    expect(result).toEqual({ data: [todo], page: 1, limit: 20, total: 1 })
  })

  it('calls findMany and count in parallel', async () => {
    mockRepo.findMany.mockResolvedValue([])
    mockRepo.count.mockResolvedValue(0)

    await service.listTodos({ userId: 'user-123', status: 'incomplete', page: 1, limit: 20 })

    expect(mockRepo.findMany).toHaveBeenCalledOnce()
    expect(mockRepo.count).toHaveBeenCalledOnce()
  })

  it('defaults status to incomplete, page to 1, limit to 20', async () => {
    mockRepo.findMany.mockResolvedValue([])
    mockRepo.count.mockResolvedValue(0)

    await service.listTodos({ userId: 'user-123' })

    expect(mockRepo.findMany).toHaveBeenCalledWith({
      userId: 'user-123',
      status: 'incomplete',
      page: 1,
      limit: 20,
    })
  })

  it('createTodo returns the created todo', async () => {
    mockRepo.create.mockResolvedValue(todo)

    const result = await service.createTodo({ userId: 'user-123', title: 'Buy milk', dueDate: null })

    expect(result).toEqual(todo)
    expect(mockRepo.create).toHaveBeenCalledWith({ userId: 'user-123', title: 'Buy milk', dueDate: null })
  })
})
