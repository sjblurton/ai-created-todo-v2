import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent immediate refetch on client after SSR hydration
        staleTime: 60 * 1000,
      },
    },
  })
}
