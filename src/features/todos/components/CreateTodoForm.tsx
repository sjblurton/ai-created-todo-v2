"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTodoSchema,
  type CreateTodoInput,
} from "@/lib/schemas/todo.schema";
import { todoKeys, todoMutationKeys } from "@/lib/queries/todos.queries";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";

export function CreateTodoForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: todoMutationKeys.create,
    mutationFn: (data: CreateTodoInput) =>
      fetch("/api/v1/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
      router.refresh();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { title: "", due_date: "" },
  });

  async function onSubmit(data: CreateTodoInput) {
    await mutateAsync(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-xl mb-6">
      <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Field
            id="title"
            label="Title"
            type="text"
            placeholder="What needs doing?"
            error={errors.title?.message}
            className="w-full"
            {...register("title")}
          />
        </div>

          <Field
            id="due_date"
            label="Due date"
            type="date"
            error={errors.due_date?.message}
            className="text-zinc-500 dark:text-zinc-400"
            {...register("due_date")}
          />

        <Button type="submit" disabled={isPending} className="shrink-0 px-4 py-2">
          {isPending ? 'Adding…' : 'Add todo'}
        </Button>
      </div>
    </form>
  );
}
