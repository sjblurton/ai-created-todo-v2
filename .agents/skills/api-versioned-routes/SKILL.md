---
name: api-versioned-routes
description: Use when creating or refactoring Next.js App Router API handlers under src/app/api. Enforces versioned route folders such as api/v1 and thin route.ts adapters that delegate to feature controllers.
metadata:
  author: local
  version: "0.3.0"
---

# API Versioned Routes

Use this skill whenever you add or refactor API handlers in this repository.

## Goals

- Keep API routes explicitly versioned under src/app/api, for example v1, v2.
- Keep route.ts files thin and free of business logic.
- Delegate request handling to feature controllers.
- Make future API version upgrades additive instead of breaking.
- Keep controller, service, and repository layers unit tested.

## Required Structure

- Versioned routes live under src/app/api/<version>/...
- Valid examples:
  - src/app/api/v1/todos/route.ts
  - src/app/api/v1/todos/[id]/route.ts
- Future versions must be added as sibling folders, for example src/app/api/v2/.
- Never replace v1 in-place when introducing v2.
- Controller location: src/features/<feature>/api/<feature>.controller.ts
- Shared service location: src/lib/services/<domain>.service.ts
- Shared repository location: src/lib/repositories/<domain>.repository.ts

## Route Handler Rules

- route.ts is an HTTP adapter only.
- route.ts should:
  - import a controller (or controller factory)
  - pass through request and params
  - return the controller response
- route.ts must not contain domain logic, validation business rules, or data access.
- Controller orchestration belongs in src/features/<feature>/api/.
- Reusable domain logic belongs in shared services under src/lib/services/.
- Reusable data-access adapters belong in shared repositories under src/lib/repositories/.

## Controller Delegation Pattern

Prefer this shape for collection routes:

```ts
import { createTodosController } from "@/features/todos/api/todos.controller";

const controller = createTodosController();

export async function GET() {
  return controller.list();
}

export async function POST(request: Request) {
  return controller.create(request);
}
```

Prefer this shape for item routes:

```ts
import { createTodosController } from "@/features/todos/api/todos.controller";

const controller = createTodosController();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return controller.update(request, id);
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  return controller.delete(id);
}
```

## Versioning Policy

- Current stable routes live in v1.
- New, breaking contract changes must go into v2.
- v1 remains supported until migration is complete.
- Shared internal service/repository code can be reused by v1 and v2 controllers, but external route contracts remain isolated by version.

## Review Checklist

When reviewing any API route change, verify:

- Route file path includes explicit version segment.
- route.ts contains only adapter logic.
- Controller exists in feature API module.
- No service/repository business logic implemented directly in controller.
- Service logic is in src/lib/services/ when it may be shared.
- Repository logic is in src/lib/repositories/ when it may be shared.
- No direct database access in route.ts.
- New breaking changes were added under a new version folder, not patched into an existing version.
- Controller has or updates a controller unit test file.
- Service has or updates a service unit test file.
- Repository has or updates a repository unit test file.

## Refactor Guidance

For existing handlers that contain logic:

1. Create or update a feature controller in src/features/<feature>/api/.
2. Move business logic from route.ts to a shared service in src/lib/services/.
3. Move data-access logic to a shared repository in src/lib/repositories/.
4. Keep controller focused on orchestration and HTTP response mapping.
5. Keep route.ts as a thin pass-through.
6. Preserve route contract for the current version.
7. Add or update unit tests for controller, service, and repository layers.
8. Keep route tests minimal; prioritise business coverage in lower layers.
