import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TodosPagePresentation } from './TodosPagePresentation'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('TodosPagePresentation', () => {
  it('renders the user email', () => {
    render(<TodosPagePresentation userEmail="test@example.com" />, { wrapper })

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders a sign out button', () => {
    render(<TodosPagePresentation userEmail="test@example.com" />, { wrapper })

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('sign out form posts to the REST sign-out endpoint', () => {
    render(<TodosPagePresentation userEmail="test@example.com" />, { wrapper })

    const form = screen.getByRole('button', { name: /sign out/i }).closest('form')
    expect(form).toHaveAttribute('action', '/api/v1/auth/signout')
    expect(form).toHaveAttribute('method', 'POST')
  })
})
