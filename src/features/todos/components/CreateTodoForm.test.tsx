import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateTodoForm } from './CreateTodoForm'

vi.mock('next/navigation', () => ({}))

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('CreateTodoForm', () => {
  it('renders a title input and submit button', () => {
    render(<CreateTodoForm />, { wrapper })

    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument()
  })

  it('shows a validation error when submitted without a title', async () => {
    render(<CreateTodoForm />, { wrapper })

    await userEvent.click(screen.getByRole('button', { name: /add todo/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Title is required')
  })

  it('calls POST /api/v1/todos with the title on valid submit', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: '1', title: 'Buy milk' }), { status: 201 })
    )

    render(<CreateTodoForm />, { wrapper })
    await userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'Buy milk')
    await userEvent.click(screen.getByRole('button', { name: /add todo/i }))

    expect(fetchSpy).toHaveBeenCalledWith('/api/v1/todos', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('Buy milk'),
    }))

    fetchSpy.mockRestore()
  })
})
