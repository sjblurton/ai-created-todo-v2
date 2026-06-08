import { z } from 'zod'

export const todoStatusSchema = z.enum(['complete', 'incomplete'])

export type TodoStatus = z.infer<typeof todoStatusSchema>
