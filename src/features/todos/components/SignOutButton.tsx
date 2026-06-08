'use client'

import { useControllableState } from '../../../lib/hooks/useControllableState'
import { Button } from '../../../components/Button'

type SignOutButtonProps = {
  isLoading?: boolean
  onLoadingChange?: (loading: boolean) => void
}

export function SignOutButton({ isLoading: controlledLoading, onLoadingChange }: SignOutButtonProps = {}) {
  const [isLoading, setIsLoading] = useControllableState(false, controlledLoading, onLoadingChange)

  return (
    <form
      action="/api/v1/auth/signout"
      method="POST"
      onSubmit={() => setIsLoading(true)}
    >
      <Button type="submit" disabled={isLoading} className="px-4 py-2">Sign out</Button>
    </form>
  )
}
