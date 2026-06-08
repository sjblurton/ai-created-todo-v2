import { z } from 'zod'

export const todoStatusSchema = z.enum(['complete', 'incomplete'])

export type TodoStatus = z.infer<typeof todoStatusSchema>

export const createTodoSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(1, { error: 'Title is required' }),
  due_date: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.iso.date({ error: 'Due date must be a valid date (YYYY-MM-DD)' }).optional()
  ),
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
