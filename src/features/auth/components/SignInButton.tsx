'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '../../../components/Button'

export function SignInButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-3 px-5 py-3">
      {children}
    </Button>
  )
}
