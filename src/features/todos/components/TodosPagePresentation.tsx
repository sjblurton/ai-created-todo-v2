import type { PaginatedTodos } from '@/lib/services/todos.service'

export type TodosPagePresentationProps = {
  userEmail: string
  signOutAction: () => Promise<void>
  children?: React.ReactNode
}

export function TodosPagePresentation({ userEmail, signOutAction, children }: TodosPagePresentationProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">My Todos</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{userEmail}</span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-8">
        {children}
      </main>
    </div>
  )
}
