import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCurrentUser } from './useCurrentUser'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useCurrentUser', () => {
  it('fetches and returns the authenticated user via MSW', async () => {
    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toMatchObject({
      id: 'user-123',
      email: 'test@example.com',
    })
  })

  it('is initially in loading state', () => {
    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
  })
})
