import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from './auth.service'
import type { AuthRepository } from '@/lib/repositories/auth.repository'
import type { User } from '@supabase/supabase-js'

const mockRepo = {
  getCurrentUser: vi.fn(),
  signOut: vi.fn(),
} satisfies Pick<AuthRepository, 'getCurrentUser' | 'signOut'>

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new AuthService(mockRepo)
  })

  describe('getCurrentUser', () => {
    it('returns the user from the repository', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as User
      mockRepo.getCurrentUser.mockResolvedValue(user)

      const result = await service.getCurrentUser()

      expect(result).toEqual(user)
    })

    it('returns null when repository returns null', async () => {
      mockRepo.getCurrentUser.mockResolvedValue(null)

      const result = await service.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('signOut', () => {
    it('delegates to the repository', async () => {
      mockRepo.signOut.mockResolvedValue(undefined)

      await service.signOut()

      expect(mockRepo.signOut).toHaveBeenCalledOnce()
    })

    it('propagates errors from the repository', async () => {
      mockRepo.signOut.mockRejectedValue(new Error('Sign out failed'))

      await expect(service.signOut()).rejects.toThrow('Sign out failed')
    })
  })
})
