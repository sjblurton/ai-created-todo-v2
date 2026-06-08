# AI Todo App

A single-user todo app built with Next.js and Supabase. Users log in via OAuth and manage their own todos.

## Language

**Todo**:
A user-owned task with a title, optional due date, and a status of either Complete or Incomplete. Todos can be created, edited, and permanently deleted.
_Avoid_: Task, item, note

**User**:
An authenticated person who owns todos. Identified by their OAuth identity.
_Avoid_: Account, member, player

**Complete**:
The status of a Todo that has been finished. The opposite of Incomplete.
_Avoid_: Done, checked, resolved

**Incomplete**:
The default status of a newly created Todo. The opposite of Complete.
_Avoid_: Not done, unchecked, pending, active

## Architecture

**Route Handler**:
A thin HTTP adapter in `src/app/api/v1/**​/route.ts`. Contains no domain logic — delegates entirely to a Controller.
_Avoid_: API handler, endpoint file

**Controller**:
Orchestrates a request within a feature. Lives in `src/features/<feature>/api/<feature>.controller.ts`. Maps HTTP input to service calls and maps results to HTTP responses.
_Avoid_: Handler, resolver

**Service**:
Contains reusable domain logic shared across controllers. Lives in `src/lib/services/<domain>.service.ts`.
_Avoid_: Helper, util, manager

**Repository**:
Contains all data-access logic for a domain. Lives in `src/lib/repositories/<domain>.repository.ts`. The only layer that talks to Supabase.
_Avoid_: Data layer, store, DAO

**Presentation Component**:
A pure UI component that receives all data and callbacks via props. No API or mutation hooks. Lives in `src/features/<feature>/components/*Presentation.tsx`.
_Avoid_: Dumb component, pure component, view

**Container Component**:
Calls hooks and composes view-model props to pass into a Presentation Component. Minimal JSX. Lives in `src/features/<feature>/components/<Name>.tsx`.
_Avoid_: Smart component, connected component

**Composition Hook**:
Aggregates multiple hooks into a single props object for a Presentation Component. Route-level hooks live in `src/app/<route>/hooks/use<Name>Composition.ts`; feature-level hooks in `src/features/<feature>/hooks/use<Name>PresentationProps.ts`.
_Avoid_: View model hook, page hook

**Page**:
A thin route container in `src/app/**/page.tsx`. Applies auth redirects, calls one or two Composition Hooks, and renders a Presentation Component. Contains no substantial JSX layout.
_Avoid_: Route component, screen

