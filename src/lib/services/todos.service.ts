import type { Todo, TodosRepository } from '@/lib/repositories/todos.repository'

export type PaginatedTodos = {
  data: Todo[]
  page: number
  limit: number
  total: number
}

type ListTodosParams = {
  userId: string
  status?: string
  page?: number
  limit?: number
}

export class TodosService {
  constructor(private readonly repo: Pick<TodosRepository, 'findMany' | 'count'>) {}

  async listTodos({ userId, status = 'incomplete', page = 1, limit = 20 }: ListTodosParams): Promise<PaginatedTodos> {
    const params = { userId, status, page, limit }
    const [data, total] = await Promise.all([
      this.repo.findMany(params),
      this.repo.count({ userId, status }),
    ])
    return { data, page, limit, total }
  }
}
