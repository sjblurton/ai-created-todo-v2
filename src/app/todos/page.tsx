import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/features/todos/actions/signOut'
import { TodosPagePresentation } from '@/features/todos/components/TodosPagePresentation'

export default async function TodosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <TodosPagePresentation
      userEmail={user.email ?? ''}
      signOutAction={signOut}
    />
  )
}
