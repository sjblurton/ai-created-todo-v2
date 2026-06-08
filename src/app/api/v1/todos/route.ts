import type { NextRequest } from 'next/server'
import { TodosController } from '@/features/todos/api/todos.controller'
import { TodosService } from '@/lib/services/todos.service'
import { TodosRepository } from '@/lib/repositories/todos.repository'
import { AuthRepository } from '@/lib/repositories/auth.repository'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const controller = new TodosController(new TodosService(new TodosRepository(prisma)))

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const user = await new AuthRepository(supabase).getCurrentUser()
  return controller.handleList(request, user?.id ?? null)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const user = await new AuthRepository(supabase).getCurrentUser()
  return controller.handleCreate(request, user?.id ?? null)
}
