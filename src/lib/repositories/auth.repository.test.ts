import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthRepository } from './auth.repository'

const mockGetUser = vi.fn()
const mockSignOut = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    })
  ),
}))

describe('AuthRepository', () => {
  let repo: AuthRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repo = new AuthRepository()
  })

  describe('getCurrentUser', () => {
    it('returns the user when authenticated', async () => {
      const user = { id: 'user-123', email: 'test@example.com' }
      mockGetUser.mockResolvedValue({ data: { user }, error: null })

      const result = await repo.getCurrentUser()

      expect(result).toEqual(user)
    })

    it('returns null when not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

      const result = await repo.getCurrentUser()

      expect(result).toBeNull()
    })

    it('returns null on error', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth error'),
      })

      const result = await repo.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('signOut', () => {
    it('calls supabase signOut', async () => {
      mockSignOut.mockResolvedValue({ error: null })

      await repo.signOut()

      expect(mockSignOut).toHaveBeenCalledOnce()
    })

    it('throws when signOut fails', async () => {
      mockSignOut.mockResolvedValue({ error: new Error('Sign out failed') })

      await expect(repo.signOut()).rejects.toThrow('Sign out failed')
    })
  })
})
