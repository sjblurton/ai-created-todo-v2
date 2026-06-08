import type { PrismaClient } from '../../../generated/prisma/client'

export type Todo = {
  id: string
  userId: string
  title: string
  dueDate: Date | null
  status: string
  createdAt: Date
}

type FindManyParams = {
  userId: string
  status: string
  page: number
  limit: number
}

type CountParams = {
  userId: string
  status: string
}

export class TodosRepository {
  constructor(private readonly db: Pick<PrismaClient, 'todo'>) {}

  async findMany({ userId, status, page, limit }: FindManyParams): Promise<Todo[]> {
    return this.db.todo.findMany({
      where: { userId, status },
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async count({ userId, status }: CountParams): Promise<number> {
    return this.db.todo.count({
      where: { userId, status },
    })
  }
}
