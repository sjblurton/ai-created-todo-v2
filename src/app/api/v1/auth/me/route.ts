import { AuthController } from '@/features/auth/api/auth.controller'
import { AuthService } from '@/lib/services/auth.service'
import { AuthRepository } from '@/lib/repositories/auth.repository'

const controller = new AuthController(new AuthService(new AuthRepository()))

export function GET() {
  return controller.handleGetMe()
}
