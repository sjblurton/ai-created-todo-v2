import type { PaginatedTodos } from '@/lib/services/todos.service'

export type TodoListPresentationProps = {
  todos: PaginatedTodos['data']
  isLoading: boolean
}

export function TodoListPresentation({ todos, isLoading }: TodoListPresentationProps) {
  if (isLoading) {
    return <p className="text-zinc-400 dark:text-zinc-500">Loading todos…</p>
  }

  if (todos.length === 0) {
    return <p className="text-zinc-400 dark:text-zinc-500">No incomplete todos. Nice work!</p>
  }

  return (
    <ul className="w-full max-w-xl divide-y divide-zinc-100 dark:divide-zinc-800">
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
  )
}
