import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignOutButton } from './SignOutButton'

describe('SignOutButton', () => {
  it('renders a sign out button targeting the REST sign-out endpoint', () => {
    render(<SignOutButton />)

    const button = screen.getByRole('button', { name: /sign out/i })
    expect(button).toBeInTheDocument()

    const form = button.closest('form')
    expect(form).toHaveAttribute('action', '/api/v1/auth/signout')
    expect(form).toHaveAttribute('method', 'POST')
  })

  it('disables the button after it is clicked', async () => {
    render(<SignOutButton />)

    await userEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(screen.getByRole('button', { name: /sign out/i })).toBeDisabled()
  })

  it('is disabled when isLoading prop is true (controlled)', () => {
    render(<SignOutButton isLoading={true} onLoadingChange={() => {}} />)

    expect(screen.getByRole('button', { name: /sign out/i })).toBeDisabled()
  })

  it('is not disabled when isLoading prop is false (controlled)', () => {
    render(<SignOutButton isLoading={false} onLoadingChange={() => {}} />)

    expect(screen.getByRole('button', { name: /sign out/i })).not.toBeDisabled()
  })
})
