import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthController } from './auth.controller'
import type { AuthService } from '@/lib/services/auth.service'
import type { User } from '@supabase/supabase-js'

const mockService = {
  getCurrentUser: vi.fn(),
  signOut: vi.fn(),
} satisfies Pick<AuthService, 'getCurrentUser' | 'signOut'>

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new AuthController(mockService)
  })

  describe('handleGetMe', () => {
    it('returns 200 with user when authenticated', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as User
      mockService.getCurrentUser.mockResolvedValue(user)

      const response = await controller.handleGetMe()

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toEqual({ user })
    })

    it('returns 401 when not authenticated', async () => {
      mockService.getCurrentUser.mockResolvedValue(null)

      const response = await controller.handleGetMe()

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body).toEqual({ error: 'Unauthorized' })
    })

    it('returns 500 on unexpected error', async () => {
      mockService.getCurrentUser.mockRejectedValue(new Error('Unexpected'))

      const response = await controller.handleGetMe()

      expect(response.status).toBe(500)
    })
  })

  describe('handleSignOut', () => {
    it('returns 200 after successful sign out', async () => {
      mockService.signOut.mockResolvedValue(undefined)

      const response = await controller.handleSignOut()

      expect(response.status).toBe(200)
    })

    it('returns 500 when sign out fails', async () => {
      mockService.signOut.mockRejectedValue(new Error('Failed'))

      const response = await controller.handleSignOut()

      expect(response.status).toBe(500)
    })
  })
})
