import { queryOptions } from '@tanstack/react-query'
import type { PaginatedTodos } from '@/lib/services/todos.service'
import type { TodoStatus } from '@/lib/schemas/todo.schema'

type ListTodosParams = {
  status?: TodoStatus
  page?: number
  limit?: number
}

async function fetchTodos(params: ListTodosParams = {}): Promise<PaginatedTodos> {
  const { status = 'incomplete', page = 1, limit = 20 } = params
  const url = new URL('/api/v1/todos', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
  url.searchParams.set('status', status)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))

  const res = await fetch(url.toString())
  if (res.status === 401) throw new Error('Unauthorized')
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params: ListTodosParams) => [...todoKeys.lists(), params] as const,
}

export const todoMutationKeys = {
  create: ['todos', 'create'] as const,
}

export const todoQueries = {
  list: (params: ListTodosParams = {}) =>
    queryOptions({
      queryKey: todoKeys.list(params),
      queryFn: () => fetchTodos(params),
    }),
}
