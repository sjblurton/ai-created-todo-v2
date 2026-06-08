import { AuthController } from '@/features/auth/api/auth.controller'
import { AuthRepository } from '@/lib/repositories/auth.repository'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const controller = new AuthController(new AuthRepository(supabase))
  return controller.handleGetMe()
}
