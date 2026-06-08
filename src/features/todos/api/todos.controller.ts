import { NextRequest, NextResponse } from 'next/server'
import type { TodosService } from '@/lib/services/todos.service'
import { todoStatusSchema, createTodoSchema } from '@/lib/schemas/todo.schema'

export class TodosController {
  constructor(private readonly service: Pick<TodosService, 'listTodos' | 'createTodo'>) {}

  async handleList(request: NextRequest, userId: string | null): Promise<NextResponse> {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const { searchParams } = new URL(request.url)
      const page = Number(searchParams.get('page') ?? 1)
      const limit = Number(searchParams.get('limit') ?? 20)

      const statusParsed = todoStatusSchema.safeParse(searchParams.get('status') ?? 'incomplete')
      if (!statusParsed.success) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${todoStatusSchema.options.join(', ')}` },
          { status: 400 }
        )
      }

      const result = await this.service.listTodos({ userId, status: statusParsed.data, page, limit })
      return NextResponse.json(result, { status: 200 })
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async handleCreate(request: NextRequest, userId: string | null): Promise<NextResponse> {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const body = await request.json()
      const parsed = createTodoSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { fieldErrors: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }

      const dueDate = parsed.data.due_date ? new Date(parsed.data.due_date) : null
      const todo = await this.service.createTodo({ userId, title: parsed.data.title, dueDate })
      return NextResponse.json(todo, { status: 201 })
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
