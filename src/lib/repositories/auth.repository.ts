import type { User } from '@supabase/supabase-js'

interface SupabaseAuthClient {
  auth: {
    getUser(): Promise<{ data: { user: User | null } }>
    signOut(): Promise<{ error: { message: string } | null }>
  }
}

export class AuthRepository {
  constructor(private readonly client: SupabaseAuthClient) {}

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.client.auth.getUser()
    return user
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut()
    if (error) throw new Error(error.message)
  }
}
