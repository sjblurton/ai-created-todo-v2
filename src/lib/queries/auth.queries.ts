import { queryOptions } from '@tanstack/react-query'
import type { User } from '@supabase/supabase-js'

async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch('/api/v1/auth/me')
  if (res.status === 401) return null
  if (!res.ok) throw new Error('Failed to fetch current user')
  const { user } = await res.json()
  return user
}

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: authKeys.me(),
      queryFn: fetchCurrentUser,
      // Auth state is stable — only changes on sign-in/sign-out
      staleTime: 5 * 60 * 1000,
    }),
}
