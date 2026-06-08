import type { NextRequest } from 'next/server'
import { TodosController } from '@/features/todos/api/todos.controller'
import { TodosService } from '@/lib/services/todos.service'
import { TodosRepository } from '@/lib/repositories/todos.repository'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const controller = new TodosController(new TodosService(new TodosRepository(prisma)))

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return controller.handleList(request, user?.id ?? null)
}
