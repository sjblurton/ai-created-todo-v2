'use client'

import { useTodoListPresentationProps } from '@/features/todos/hooks/useTodoListPresentationProps'
import { TodoListPresentation } from './TodoListPresentation'

export function TodoList() {
  const props = useTodoListPresentationProps()
  return <TodoListPresentation {...props} />
}
