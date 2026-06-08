import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export class AuthRepository {
  async getCurrentUser(): Promise<User | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  async signOut(): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }
}
