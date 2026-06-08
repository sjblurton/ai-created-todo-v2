import type { PrismaClient } from '../../../generated/prisma/client'
import { todoStatusSchema, type TodoStatus } from '@/lib/schemas/todo.schema'

export type Todo = {
  id: string
  userId: string
  title: string
  dueDate: Date | null
  status: TodoStatus
  createdAt: Date
}

type FindManyParams = {
  userId: string
  status: TodoStatus
  page: number
  limit: number
}

type CountParams = {
  userId: string
  status: TodoStatus
}

export class TodosRepository {
  constructor(private readonly db: Pick<PrismaClient, 'todo'>) {}

  async findMany({ userId, status, page, limit }: FindManyParams): Promise<Todo[]> {
    const rows = await this.db.todo.findMany({
      where: { userId, status },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return rows.map((row) => ({ ...row, status: todoStatusSchema.parse(row.status) }))
  }

  async count({ userId, status }: CountParams): Promise<number> {
    return this.db.todo.count({
      where: { userId, status },
    })
  }
}
