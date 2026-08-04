# Project Instructions

## Tech Stack
- Monorepo: Turborepo
- Frontend: Next.js 16 (apps/web)
- Backend: NestJS (apps/api)
- ORM: Drizzle with PostgreSQL (Neon)
- Auth: Better Auth (@thallesp/nestjs-better-auth)
- Styling: Tailwind CSS
- State: TanStack React Query
- Forms: Custom hooks (useForm, useCrud)

## Project Structure
- `apps/web` - Next.js frontend
- `apps/api` - NestJS backend
- `packages/` - Shared packages (UI components, configs)

## Conventions
- Use Server Actions for mutations
- Use `useCrud` hook for API calls
- Use `useForm` hook for form state
- Components go in `apps/web/components/`
- Use `@/` path alias for imports
- Use `showSuccess` / `showError` from `@/lib/toast-helper` for notifications
