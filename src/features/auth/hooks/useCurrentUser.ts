'use client'

import { useQuery } from '@tanstack/react-query'
import { authQueries } from '@/lib/queries/auth.queries'

export function useCurrentUser() {
  return useQuery(authQueries.me())
}
