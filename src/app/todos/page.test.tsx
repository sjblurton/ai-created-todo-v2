import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockGetUser = vi.fn()
const mockRedirect = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({ auth: { getUser: mockGetUser } })
  ),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    mockRedirect(url)
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
}))

// Import after mocks are set up
const { default: TodosPage } = await import('./page')

describe('TodosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the todos page for an authenticated user', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const page = await TodosPage()
    render(page)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('redirects to / when the user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    await expect(TodosPage()).rejects.toThrow('NEXT_REDIRECT:/')

    expect(mockRedirect).toHaveBeenCalledWith('/')
  })
})
