import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodosPagePresentation } from './TodosPagePresentation'

describe('TodosPagePresentation', () => {
  it('renders the user email', () => {
    render(
      <TodosPagePresentation
        userEmail="test@example.com"
        signOutAction={vi.fn()}
      />
    )

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders a sign out button', () => {
    render(
      <TodosPagePresentation
        userEmail="test@example.com"
        signOutAction={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('calls signOutAction when sign out is submitted', async () => {
    const signOutAction = vi.fn()
    render(
      <TodosPagePresentation
        userEmail="test@example.com"
        signOutAction={signOutAction}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /sign out/i }))

    expect(signOutAction).toHaveBeenCalledOnce()
  })
})
