---
name: page-container-presentation
description: Use when creating or refactoring Next.js App Router page.tsx files. Keeps page.tsx minimal by delegating UI to presentation components and data orchestration to one or two hooks.
metadata:
  author: local
  version: "0.1.1"
---

# Page Container + Presentation

Use this skill for App Router `page.tsx` files in `src/app/**/page.tsx`.

## Goals

- Keep `page.tsx` as a thin route container.
- Move UI markup into feature presentation components.
- Keep page orchestration to one or two hooks at most.
- Prefer spreading a single view-model object into presentation props.

## Required Structure

- Route container: `src/app/**/page.tsx`
- Presentation component: `src/features/<feature>/components/*Presentation.tsx`
- Page composition hook: `src/app/<route>/hooks/use<Page>NameComposition.ts`

## Rules

- `page.tsx` should primarily:
  - apply route-level wrappers (for example auth redirects)
  - call one or two hooks
  - render a presentation component
- `page.tsx` must not contain substantial JSX layout blocks.
- For page-level composition, use route-level composition hooks under `src/app/<route>/hooks/`.
- Do not place cross-feature composition hooks inside a feature folder.
- Prefer this pattern:
  - `const presentationProps = useXxxComposition(...)`
  - `<XxxPresentation {...presentationProps} />`

## Example Pattern

```tsx
function DashboardPage({ session }: AuthGuardInjectedProps) {
  const presentationProps = useDashboardPageComposition(session?.email ?? null);

  return <DashboardPresentation {...presentationProps} />;
}
```

## Presentation Component Rules

- Presentation components receive serialisable render props and callbacks.
- They should avoid data-fetching hooks unless truly local/UI-only.
- Export the props type to keep hook and component contracts aligned.

## Review Checklist

- `page.tsx` has minimal JSX.
- Presentation component exists in feature layer.
- One route-level composition hook returns most or all props for presentation.
- No cross-feature imports inside feature hooks solely for page composition.
- No business logic embedded in route container markup.
- `npm run check` passes after refactor.
