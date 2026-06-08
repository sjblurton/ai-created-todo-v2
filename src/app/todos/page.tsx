import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthRepository } from '@/lib/repositories/auth.repository'
import { TodosPagePresentation } from '@/features/todos/components/TodosPagePresentation'
import { TodoList } from '@/features/todos/components/TodoList'

export default async function TodosPage() {
  const supabase = await createClient()
  const user = await new AuthRepository(supabase).getCurrentUser()

  if (!user) {
    redirect('/')
  }

  return (
    <TodosPagePresentation
      userEmail={user.email ?? ''}
    >
      <TodoList />
    </TodosPagePresentation>
  )
}
