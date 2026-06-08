import type { Todo, TodosRepository } from '@/lib/repositories/todos.repository'
import type { TodoStatus } from '@/lib/schemas/todo.schema'

export type PaginatedTodos = {
  data: Todo[]
  page: number
  limit: number
  total: number
}

type ListTodosParams = {
  userId: string
  status?: TodoStatus
  page?: number
  limit?: number
}

type CreateTodoParams = {
  userId: string
  title: string
  dueDate: Date | null
}

export class TodosService {
  constructor(private readonly repo: Pick<TodosRepository, 'findMany' | 'count' | 'create'>) {}

  async listTodos({ userId, status = 'incomplete', page = 1, limit = 20 }: ListTodosParams): Promise<PaginatedTodos> {
    const params = { userId, status, page, limit }
    const [data, total] = await Promise.all([
      this.repo.findMany(params),
      this.repo.count({ userId, status }),
    ])
    return { data, page, limit, total }
  }

  async createTodo({ userId, title, dueDate }: CreateTodoParams): Promise<Todo> {
    return this.repo.create({ userId, title, dueDate })
  }
}
