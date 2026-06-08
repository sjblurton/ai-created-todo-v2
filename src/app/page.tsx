import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signInWithGoogle } from '@/features/auth/actions/signIn'
import { LoginPresentation } from '@/features/auth/components/LoginPresentation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/todos')
  }

  return <LoginPresentation signInAction={signInWithGoogle} />
}
