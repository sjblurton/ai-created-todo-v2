'use client'

import { useQuery } from '@tanstack/react-query'
import { todoQueries } from '@/lib/queries/todos.queries'
import type { TodoListPresentationProps } from '@/features/todos/components/TodoListPresentation'

export function useTodoListPresentationProps(): TodoListPresentationProps {
  const { data, isPending } = useQuery(todoQueries.list())

  return {
    todos: data?.data ?? [],
    isLoading: isPending,
  }
}
