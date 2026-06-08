import { NextResponse } from 'next/server'
import type { AuthService } from '@/lib/services/auth.service'

export class AuthController {
  constructor(private readonly service: Pick<AuthService, 'getCurrentUser' | 'signOut'>) {}

  async handleGetMe(): Promise<NextResponse> {
    try {
      const user = await this.service.getCurrentUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.json({ user }, { status: 200 })
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async handleSignOut(): Promise<NextResponse> {
    try {
      await this.service.signOut()
      return NextResponse.json({ success: true }, { status: 200 })
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
