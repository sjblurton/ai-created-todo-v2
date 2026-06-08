import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginPresentation } from './LoginPresentation'

describe('LoginPresentation', () => {
  it('renders a sign-in button', () => {
    render(<LoginPresentation signInAction={vi.fn()} />)

    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })

  it('calls signInAction when the button is submitted', async () => {
    const signInAction = vi.fn()
    render(<LoginPresentation signInAction={signInAction} />)

    await userEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

    expect(signInAction).toHaveBeenCalledOnce()
  })
})
