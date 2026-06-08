---
name: react-component-architecture
description: Use when creating or refactoring React components. Enforces container/presentation boundaries, composition-first design, and test/storybook-friendly state orchestration.
metadata:
  author: local
  version: "0.1.0"
---

# React Component Architecture

Use this skill whenever adding or refactoring UI components.

## Goals

- Keep components focused and composable.
- Prefer container/presentation split when components combine data hooks and UI.
- Avoid deep prop drilling by introducing local composition boundaries.
- Keep storybook and tests easy by rendering presentational components with explicit props.

## Component Roles

- Presentation component:
  - Pure UI and local visual state only.
  - Receives data and callbacks via props.
  - No API/mutation/query hooks by default.
- Container component:
  - Calls hooks and composes view-model props.
  - Passes props to presentation components.
  - Minimal JSX, mostly orchestration.
- Composition hook:
  - Optional, for route or feature-level orchestration.
  - Can aggregate multiple hooks into one presentation props object.

## Placement Guidelines

- Presentation: `src/features/<feature>/components/*Presentation.tsx`
- Feature container: `src/features/<feature>/components/<Name>.tsx`
- Route composition hooks: `src/app/<route>/hooks/use<Name>Composition.ts`
- Feature-local composition hooks: `src/features/<feature>/hooks/use<Name>PresentationProps.ts`

## Prop Drilling Guardrails

- Prefer passing props one level from container to presentation.
- If props are drilled through 2+ unrelated layers, introduce a closer container/composition hook.
- Do not immediately introduce global context/store for one branch.
- Use context only for truly cross-cutting state consumed in many distant branches.

## Testing and Storybook Rules

- Unit-test presentation components with explicit props.
- Integration-test containers/composition hooks with real hooks plus mocks/MSW as needed.
- For storybook, render presentation components directly.
- Avoid optional "fallback-to-hook" props in presentation components.
  - Prefer separate container and presentation exports over dual-mode components.

## Anti-Patterns

- A single component that fetches data, mutates state, and renders a large layout.
- Passing hook state through many intermediary components that do not use it.
- Components that behave differently in tests vs runtime by conditionally running hooks from optional props.

## Refactor Checklist

- Is there a clear container/presentation boundary?
- Does presentation avoid data hooks and side effects?
- Is composition logic in a hook when multiple hooks are combined?
- Are props passed only where needed, without excessive drilling?
- Are presentation and container tests both covered?
- Does `npm run check` pass?
