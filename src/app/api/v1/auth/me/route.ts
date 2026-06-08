import { AuthController } from '@/features/auth/api/auth.controller'
import { AuthService } from '@/lib/services/auth.service'
import { AuthRepository } from '@/lib/repositories/auth.repository'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const controller = new AuthController(new AuthService(new AuthRepository(supabase)))
  return controller.handleGetMe()
}
