-- CreateTable
CREATE TABLE "todos" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" DATE,
    "status" TEXT NOT NULL DEFAULT 'incomplete',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);
