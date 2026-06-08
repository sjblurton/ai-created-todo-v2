import type { PaginatedTodos } from '@/lib/services/todos.service'

export type TodoListPresentationProps = {
  todos: PaginatedTodos['data']
  isLoading: boolean
  isCreating: boolean
  page: number
  totalPages: number
  onNextPage: () => void
  onPrevPage: () => void
}

export function TodoListPresentation({
  todos,
  isLoading,
  isCreating,
  page,
  totalPages,
  onNextPage,
  onPrevPage,
}: TodoListPresentationProps) {
  if (isLoading) {
    return <p className="text-zinc-400 dark:text-zinc-500">Loading todos…</p>
  }

  if (todos.length === 0 && !isCreating) {
    return <p className="text-zinc-400 dark:text-zinc-500">No incomplete todos. Nice work!</p>
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {isCreating && (
          <li className="flex animate-pulse items-start justify-between gap-4 py-3">
            <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
          </li>
        )}
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-start justify-between gap-4 py-3">
            <span className="text-sm text-zinc-900 dark:text-zinc-100">{todo.title}</span>
            {todo.dueDate && (
              <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevPage}
            disabled={page <= 1}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={page >= totalPages}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
