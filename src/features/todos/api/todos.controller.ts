import { NextRequest, NextResponse } from 'next/server'
import type { TodosService } from '@/lib/services/todos.service'

export class TodosController {
  constructor(private readonly service: Pick<TodosService, 'listTodos'>) {}

  async handleList(request: NextRequest, userId: string | null): Promise<NextResponse> {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const { searchParams } = new URL(request.url)
      const page = Number(searchParams.get('page') ?? 1)
      const limit = Number(searchParams.get('limit') ?? 20)
      const status = searchParams.get('status') ?? 'incomplete'

      const result = await this.service.listTodos({ userId, status, page, limit })
      return NextResponse.json(result, { status: 200 })
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
