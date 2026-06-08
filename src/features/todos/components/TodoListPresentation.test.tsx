import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoListPresentation } from './TodoListPresentation'

const todo = {
  id: 'todo-1',
  userId: 'user-123',
  title: 'Buy milk',
  dueDate: null,
  status: 'incomplete',
  createdAt: new Date('2024-01-01'),
}

const defaultProps = {
  todos: [] as typeof todo[],
  isLoading: false,
  page: 1,
  totalPages: 1,
  onNextPage: vi.fn(),
  onPrevPage: vi.fn(),
}

describe('TodoListPresentation', () => {
  it('shows loading state', () => {
    render(<TodoListPresentation {...defaultProps} isLoading={true} />)
    expect(screen.getByText(/loading todos/i)).toBeInTheDocument()
  })

  it('shows empty state when no todos', () => {
    render(<TodoListPresentation {...defaultProps} />)
    expect(screen.getByText(/no incomplete todos/i)).toBeInTheDocument()
  })

  it('renders todo titles', () => {
    render(<TodoListPresentation {...defaultProps} todos={[todo]} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('renders due date when present', () => {
    const withDue = { ...todo, dueDate: new Date('2024-06-01') }
    render(<TodoListPresentation {...defaultProps} todos={[withDue]} />)
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('does not render due date column when null', () => {
    render(<TodoListPresentation {...defaultProps} todos={[todo]} />)
    expect(screen.queryByText(/\/20/)).toBeNull()
  })

  it('hides pagination when totalPages is 1', () => {
    render(<TodoListPresentation {...defaultProps} todos={[todo]} totalPages={1} />)
    expect(screen.queryByRole('button', { name: /previous/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull()
  })

  it('shows pagination when totalPages > 1', () => {
    render(<TodoListPresentation {...defaultProps} todos={[todo]} page={1} totalPages={3} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(<TodoListPresentation {...defaultProps} todos={[todo]} page={1} totalPages={3} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<TodoListPresentation {...defaultProps} todos={[todo]} page={3} totalPages={3} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('calls onNextPage when next is clicked', async () => {
    const onNextPage = vi.fn()
    render(<TodoListPresentation {...defaultProps} todos={[todo]} page={1} totalPages={3} onNextPage={onNextPage} />)
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onNextPage).toHaveBeenCalledOnce()
  })

  it('calls onPrevPage when previous is clicked', async () => {
    const onPrevPage = vi.fn()
    render(<TodoListPresentation {...defaultProps} todos={[todo]} page={2} totalPages={3} onPrevPage={onPrevPage} />)
    await userEvent.click(screen.getByRole('button', { name: /previous/i }))
    expect(onPrevPage).toHaveBeenCalledOnce()
  })
})
