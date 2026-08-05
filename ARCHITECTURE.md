# Project Architecture

## Overview

Turborepo monorepo with Next.js 16 frontend and NestJS backend, using PostgreSQL (Neon) via Drizzle ORM.

```
my-turborepo/
├── apps/
│   ├── web/          # Next.js 16 frontend (port 3000)
│   └── api/          # NestJS backend (port 4000)
├── packages/
│   ├── eslint-config/
│   ├── typescript-config/
│   └── ui/
├── turbo.json
└── package.json
```

## Data Flow

```
Browser → Next.js (3000) → API Proxy Rewrite → NestJS (4000) → PostgreSQL (Neon)
```

## Frontend (`apps/web`)

### Route Structure (App Router)

```
app/
├── layout.tsx                     # Root layout (fonts, providers, GTM)
├── (root)/                        # Public pages
│   ├── page.tsx                   # Homepage
│   ├── about/
│   ├── blog/[slug]/
│   ├── contact/
│   └── services/[slug]/
├── dashboard/                     # Protected admin
│   ├── layout.tsx                 # Server component → fetches role/permissions → DashboardShell
│   ├── blogs/                     # CRUD pages (list, new, [id]/edit)
│   ├── services/
│   ├── testimonials/
│   ├── team/
│   ├── faqs/
│   ├── inquiries/
│   ├── users/
│   ├── role-permissions/          # Permission matrix UI
│   ├── seo/
│   ├── page-seo/
│   ├── redirects/
│   ├── domains/
│   ├── company-profile/
│   ├── payment-settings/
│   ├── navigation/
│   └── profile/
├── login/
├── register/
├── forgot-password/
└── reset-password/
```

### Key Directories

```
web/
├── actions/           # Server Actions (17 files) — mutations
├── components/
│   ├── dashboard/     # Dashboard components (sidebar, header, forms, tables)
│   ├── sections/      # Homepage sections (hero, navbar, footer, etc.)
│   ├── ui/            # shadcn/ui components + PrimaryButton, TipTap editor
│   └── skeletons/     # Loading skeletons
├── hooks/
│   ├── useCRUD.ts     # TanStack Query wrapper (getAll, getOne, create, update, put, remove)
│   └── useForm.ts     # Form state management
├── lib/
│   ├── api-client.ts  # Fetch wrapper with credentials + error handling
│   ├── auth-client.ts # Better Auth client (signIn, signOut, useSession)
│   └── toast-helper.ts
├── config/
│   └── api-routes.ts  # Centralized API endpoint constants
├── providers/
│   ├── query-provider.tsx
│   └── theme-provider.tsx
└── types/             # TypeScript types (19 files)
```

### Data Fetching Pattern

```tsx
// Server Actions for mutations
"use server";
export async function createBlog(data: Blog) {
  return apiClient(API_ROUTES.BLOG, { method: "POST", body: JSON.stringify(data) });
}

// useCrud for client-side queries
const { getAll, create, update, remove } = useCrud<Blog>({
  endpoint: API_ROUTES.BLOG,
  queryKey: "blogs",
});
const { data, isLoading } = getAll();
```

### Server-Side Data (Layout)

```
dashboard/layout.tsx (Server Component)
  └─ getUserData() → { role, permissions }
       └─ DashboardShell (Client Component)
            └─ Sidebar (receives props, no client-side fetch)
```

## Backend (`apps/api`)

### Module Structure

```
src/
├── main.ts               # Bootstrap (CORS, ValidationPipe, Swagger at /api)
├── app.module.ts          # Root module — imports all feature modules, registers PermissionGuard
├── db/
│   ├── schema.ts          # Drizzle schema (all tables)
│   ├── index.ts           # DB connection
│   ├── db.module.ts       # DB_CONNECTION token
│   ├── seed.ts            # Seed script (roles, permissions, defaults)
│   └── migrations/        # SQL migrations
├── modules/
│   ├── auth/              # Auth (profile, OTP, user management)
│   ├── blog/
│   ├── service/
│   ├── testimonial/
│   ├── team/
│   ├── faq/
│   ├── inquiry/
│   ├── permission/        # RBAC (permissions, role-permissions, cache)
│   ├── domain/            # Custom domains + DNS verification
│   ├── seo/
│   ├── page-seo/
│   ├── redirect/
│   ├── navigation/
│   ├── company-profile/
│   ├── payment-settings/
│   ├── khalti/            # Payment gateway
│   ├── dashboard/         # Stats
│   └── upload/            # S3 file upload
├── guards/
│   └── permission.guard.ts   # Global guard (APP_GUARD)
├── decorators/
│   └── require-permissions.decorator.ts
└── lib/
    ├── auth.ts            # Better Auth config (drizzle adapter, OAuth, OTP)
    └── password.ts
```

### Module Pattern

```
Controller → Service → Repository (or direct DB) → DTO/Entity
```

### RBAC System

- Permissions: `resource.action` (e.g., `blog.create`, `service.read`)
- `@RequirePermissions('blog.create')` decorator on endpoints
- `PermissionGuard` (global) checks session → role → permissions
- `super_admin` bypasses all checks (hardcoded)
- Permission cache: in-memory, 5-minute TTL

### Database Tables

| Table | Purpose |
|-------|---------|
| `user` | Users (Better Auth) |
| `session` | Sessions |
| `account` | OAuth + credential accounts |
| `permissions` | RBAC permissions |
| `role_permissions` | Role-permission mappings |
| `blogs` | Blog posts |
| `services` | Services/products |
| `testimonials` | Testimonials |
| `team_members` | Team members |
| `faqs` | FAQs |
| `messages` | Contact form messages |
| `seo_metas` | SEO metadata |
| `global_seo` | Site-wide SEO |
| `page_seo` | Per-page SEO |
| `company_profiles` | Company info |
| `payment_settings` | Payment config |
| `orders` | Payment orders |
| `custom_domains` | Custom domains |
| `redirects` | URL redirects |
| `navigation_items` | Navigation menus |

## Shared Packages

```
packages/
├── eslint-config/        # @repo/eslint-config (base, next, react-internal)
├── typescript-config/    # @repo/typescript-config (base, nest, nextjs, react-library)
└── ui/                   # @repo/ui (button, card, code)
```

## Key Tech

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo |
| Frontend | Next.js 16, React 19, Tailwind CSS, shadcn/ui |
| State | TanStack React Query, Server Actions |
| Forms | Custom `useForm` hook |
| Backend | NestJS 11, Drizzle ORM, PostgreSQL (Neon) |
| Auth | Better Auth (email/password + Google OAuth) |
| Payments | Khalti gateway |
| Storage | AWS S3 |
| API Docs | Swagger |
