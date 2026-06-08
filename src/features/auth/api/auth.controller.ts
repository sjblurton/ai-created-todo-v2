import { NextResponse } from 'next/server'
import type { AuthRepository } from '@/lib/repositories/auth.repository'

export class AuthController {
  constructor(private readonly repo: Pick<AuthRepository, 'getCurrentUser' | 'signOut'>) {}

  async handleGetMe(): Promise<NextResponse> {
    try {
      const user = await this.repo.getCurrentUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.json({ user }, { status: 200 })
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async handleSignOut(redirectTo: string): Promise<NextResponse> {
    try {
      await this.repo.signOut()
      return NextResponse.redirect(redirectTo)
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
