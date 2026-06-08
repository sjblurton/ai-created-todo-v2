import type { User } from '@supabase/supabase-js'
import type { AuthRepository } from '@/lib/repositories/auth.repository'

export class AuthService {
  constructor(private readonly repo: Pick<AuthRepository, 'getCurrentUser' | 'signOut'>) {}

  async getCurrentUser(): Promise<User | null> {
    return this.repo.getCurrentUser()
  }

  async signOut(): Promise<void> {
    return this.repo.signOut()
  }
}
