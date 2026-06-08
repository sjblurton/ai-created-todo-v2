'use client'

import { useState } from 'react'
import { Button } from '../../../components/Button'

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form
      action="/api/v1/auth/signout"
      method="POST"
      onSubmit={() => setIsLoading(true)}
    >
      <Button type="submit" disabled={isLoading}>Sign out</Button>
    </form>
  )
}
