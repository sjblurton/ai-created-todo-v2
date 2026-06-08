import { AuthController } from '@/features/auth/api/auth.controller'
import { AuthRepository } from '@/lib/repositories/auth.repository'
import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const controller = new AuthController(new AuthRepository(supabase))
  const origin = new URL(request.url).origin
  return controller.handleSignOut(`${origin}/`)
}
