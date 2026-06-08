import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TodosPagePresentation } from '@/features/todos/components/TodosPagePresentation'
import { TodoList } from '@/features/todos/components/TodoList'

export default async function TodosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
