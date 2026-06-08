import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TodoList } from './TodoList'

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('TodoList', () => {
  it('shows loading state initially', () => {
    render(<TodoList />, { wrapper })
    expect(screen.getByText(/loading todos/i)).toBeInTheDocument()
  })

  it('renders todo titles from the API', async () => {
    render(<TodoList />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument()
    })
  })
})
