'use client'

import { useState } from 'react'
import { useIsMutating, useQuery } from '@tanstack/react-query'
import { todoMutationKeys, todoQueries } from '@/lib/queries/todos.queries'
import type { TodoListPresentationProps } from '@/features/todos/components/TodoListPresentation'

const LIMIT = 20

export function useTodoListPresentationProps(): TodoListPresentationProps {
  const [page, setPage] = useState(1)
  const { data, isPending } = useQuery(todoQueries.list({ page, limit: LIMIT }))
  const isCreating = useIsMutating({ mutationKey: todoMutationKeys.create }) > 0

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1

  return {
    todos: data?.data ?? [],
    isLoading: isPending,
    isCreating,
    page,
    totalPages,
    onNextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    onPrevPage: () => setPage((p) => Math.max(p - 1, 1)),
  }
}
