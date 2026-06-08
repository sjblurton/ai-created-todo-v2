import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodosPagePresentation } from './TodosPagePresentation'

describe('TodosPagePresentation', () => {
  it('renders the user email', () => {
    render(<TodosPagePresentation userEmail="test@example.com" />)

    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders a sign out button', () => {
    render(<TodosPagePresentation userEmail="test@example.com" />)

    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('sign out form posts to the REST sign-out endpoint', () => {
    render(<TodosPagePresentation userEmail="test@example.com" />)

    const form = screen.getByRole('button', { name: /sign out/i }).closest('form')
    expect(form).toHaveAttribute('action', '/api/v1/auth/signout')
    expect(form).toHaveAttribute('method', 'POST')
  })
})
