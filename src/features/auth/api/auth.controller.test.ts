import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthController } from './auth.controller'
import type { AuthRepository } from '@/lib/repositories/auth.repository'
import type { User } from '@supabase/supabase-js'

const mockRepo = {
  getCurrentUser: vi.fn(),
  signOut: vi.fn(),
} satisfies Pick<AuthRepository, 'getCurrentUser' | 'signOut'>

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new AuthController(mockRepo)
  })

  describe('handleGetMe', () => {
    it('returns 200 with user when authenticated', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as User
      mockRepo.getCurrentUser.mockResolvedValue(user)

      const response = await controller.handleGetMe()

      expect(response.status).toBe(200)
      const body = await response.json()
      expect(body).toEqual({ user })
    })

    it('returns 401 when not authenticated', async () => {
      mockRepo.getCurrentUser.mockResolvedValue(null)

      const response = await controller.handleGetMe()

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body).toEqual({ error: 'Unauthorized' })
    })

    it('returns 500 on unexpected error', async () => {
      mockRepo.getCurrentUser.mockRejectedValue(new Error('Unexpected'))

      const response = await controller.handleGetMe()

      expect(response.status).toBe(500)
    })
  })

  describe('handleSignOut', () => {
    it('redirects to sign-in after successful sign out', async () => {
      mockRepo.signOut.mockResolvedValue(undefined)

      const response = await controller.handleSignOut('http://localhost:3000/')

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('returns 500 when sign out fails', async () => {
      mockRepo.signOut.mockRejectedValue(new Error('Failed'))

      const response = await controller.handleSignOut('http://localhost:3000/')

      expect(response.status).toBe(500)
    })
  })
})
