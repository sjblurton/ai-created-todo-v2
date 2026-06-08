import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthRepository } from './auth.repository'
import type { User } from '@supabase/supabase-js'

const mockClient = {
  auth: {
    getUser: vi.fn(),
    signOut: vi.fn(),
  },
}

describe('AuthRepository', () => {
  let repo: AuthRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repo = new AuthRepository(mockClient)
  })

  describe('getCurrentUser', () => {
    it('returns the user when authenticated', async () => {
      const user = { id: 'user-123', email: 'test@example.com' } as User
      mockClient.auth.getUser.mockResolvedValue({ data: { user } })

      const result = await repo.getCurrentUser()

      expect(result).toEqual(user)
    })

    it('returns null when not authenticated', async () => {
      mockClient.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await repo.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('signOut', () => {
    it('calls client signOut', async () => {
      mockClient.auth.signOut.mockResolvedValue({ error: null })

      await repo.signOut()

      expect(mockClient.auth.signOut).toHaveBeenCalledOnce()
    })

    it('throws when signOut fails', async () => {
      mockClient.auth.signOut.mockResolvedValue({ error: { message: 'Sign out failed' } })

      await expect(repo.signOut()).rejects.toThrow('Sign out failed')
    })
  })
})
