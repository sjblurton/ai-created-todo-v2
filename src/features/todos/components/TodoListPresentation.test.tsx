import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoListPresentation } from './TodoListPresentation'

const todo = {
  id: 'todo-1',
  userId: 'user-123',
  title: 'Buy milk',
  dueDate: null,
  status: 'incomplete',
  createdAt: new Date('2024-01-01'),
}

describe('TodoListPresentation', () => {
  it('shows loading state', () => {
    render(<TodoListPresentation todos={[]} isLoading={true} />)
    expect(screen.getByText(/loading todos/i)).toBeInTheDocument()
  })

  it('shows empty state when no todos', () => {
    render(<TodoListPresentation todos={[]} isLoading={false} />)
    expect(screen.getByText(/no incomplete todos/i)).toBeInTheDocument()
  })

  it('renders todo titles', () => {
    render(<TodoListPresentation todos={[todo]} isLoading={false} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('renders due date when present', () => {
    const withDue = { ...todo, dueDate: new Date('2024-06-01') }
    render(<TodoListPresentation todos={[withDue]} isLoading={false} />)
    // Locale-agnostic: just verify a date string containing the year appears
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('does not render due date column when null', () => {
    render(<TodoListPresentation todos={[todo]} isLoading={false} />)
    expect(screen.queryByText(/\/20/)).toBeNull()
  })
})
