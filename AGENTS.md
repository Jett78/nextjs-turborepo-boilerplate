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

## Role-Based Access Control (RBAC)

### Overview
The project uses a flexible permission-based RBAC system where permissions can be dynamically assigned to roles.

### Roles
- **super_admin** - Has ALL permissions automatically (hardcoded bypass in guard)
- **admin** - Configurable permissions (default: most content management + user management)
- **editor** - Configurable permissions (default: content creation/editing)
- **manager** - Configurable permissions (default: read-only access)
- **customer** - Default role for new users (no backend permissions)

### Backend Implementation

#### Protecting Endpoints
Use the `@RequirePermissions()` decorator instead of `@Roles()`:

```typescript
import { RequirePermissions } from '../../decorators/require-permissions.decorator';

@Post()
@RequirePermissions('blog.create')
async create(@Body() dto: CreateBlogDto) {
  // ...
}

@Put(':id')
@RequirePermissions('blog.edit')
async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
  // ...
}
```

#### Permission Format
Permissions follow the pattern: `resource.action`
- Examples: `blog.read`, `blog.create`, `blog.edit`, `blog.delete`
- Resources: blog, service, testimonial, team, faq, user, inquiry, etc.
- Actions: read, create, edit, delete, view_stats

#### Available Permissions
All permissions are seeded in the database. See `apps/api/src/db/seed.ts` for the complete list.

#### Permission Guard
- Located at `apps/api/src/guards/permission.guard.ts`
- Registered globally in `app.module.ts`
- Automatically checks user permissions before allowing access
- Bypasses check for super_admin role
- Uses in-memory cache (5 min TTL) for performance

#### Permission Service
- Located at `apps/api/src/modules/permission/`
- `getUserPermissions(userId)` - Get all permissions for a user
- `checkPermissions(userId, permissionKeys)` - Check if user has specific permissions
- `syncRolePermissions(role, permissionKeys)` - Update all permissions for a role (superadmin only)

#### Permission Management API
- `GET /permissions` - List all available permissions
- `GET /permissions/roles` - Get all roles with their permissions (for UI matrix)
- `GET /permissions/roles/:role` - Get permissions for a specific role
- `PUT /permissions/roles/:role/sync` - Replace all permissions for a role
- `GET /permissions/me` - Get current user's permissions

### Frontend Implementation

#### Permission Management UI
- Located at `apps/web/app/dashboard/role-permissions/page.tsx`
- Accessible from sidebar: "Role Permissions" (Shield icon)
- Superadmin only access
- Features:
  - Matrix view of roles × permissions
  - Search/filter by resource
  - Toggle permissions on/off
  - Bulk save changes
  - Real-time permission count

#### API Integration
- API client: `apps/web/lib/api/permissions.ts`
- Hook: `apps/web/hooks/use-permissions.ts`
- Use `useRolePermissions()` hook to fetch and update permissions

### Database Schema

#### permissions table
- `id` (uuid) - Primary key
- `resource` (varchar) - Resource name (e.g., "blog")
- `action` (varchar) - Action name (e.g., "create")
- `key` (varchar, unique) - Full permission key (e.g., "blog.create")
- `description` (text) - Human-readable description
- Timestamps

#### role_permissions table
- `id` (uuid) - Primary key
- `role` (varchar) - Role name
- `permission_id` (uuid) - Foreign key to permissions.id
- `created_at` (timestamp)
- Unique constraint on (role, permission_id)

### Adding New Permissions

1. **Add to seed file** (`apps/api/src/db/seed.ts`):
```typescript
{ resource: 'new_resource', action: 'read', key: 'new_resource.read', description: 'View new resource' },
```

2. **Run seed**: `npm run db:seed`

3. **Use in controller**:
```typescript
@RequirePermissions('new_resource.read')
@Get()
async findAll() { ... }
```

4. **Assign to roles** via the Permission Management UI at `/dashboard/role-permissions`

### Testing Permissions

1. Login as superadmin (always has all permissions)
2. Go to `/dashboard/role-permissions`
3. Modify permissions for a role (e.g., remove `blog.create` from editor)
4. Login as a user with that role
5. Try to access the restricted endpoint (should get 403 Forbidden)
6. Re-assign the permission and try again (should work)

### Migration & Deployment

Database migrations are located in `apps/api/src/db/migrations/`
- Run `npm run db:generate` to create new migration
- Run `npm run db:migrate` or use `drizzle-kit push` to apply
- Seed data with `npm run db:seed`

### Notes
- Super admin role ALWAYS has all permissions (hardcoded bypass)
- Permission cache is cleared when role permissions are updated
- Customer role has no backend permissions by default
- Frontend should also check permissions for UI elements (hide/disable buttons based on user permissions)
