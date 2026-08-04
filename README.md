# Next.js + NestJS Turborepo

A full-stack monorepo with Next.js 16 frontend, NestJS backend, Drizzle ORM, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo |
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Auth | Better Auth |
| State | TanStack React Query |
| Storage | AWS S3 |

## Project Structure

```
my-turborepo/
├── apps/
│   ├── web/                  # Next.js frontend (port 3000)
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── actions/          # Server actions
│   │   ├── types/            # TypeScript types
│   │   ├── config/           # API routes config
│   │   └── proxy.ts          # Request interceptor (auth + redirects)
│   │
│   ├── api/                  # NestJS backend (port 4000)
│   │   └── src/
│   │       ├── modules/      # Feature modules
│   │       ├── db/           # Schema + migrations
│   │       ├── common/       # Shared utilities
│   │       └── lib/          # Helper libraries
│   │
│   └── docs/                 # Documentation site (port 3001)
│
├── packages/
│   ├── ui/                   # Shared React components
│   ├── eslint-config/        # Shared ESLint config
│   └── typescript-config/    # Shared TS configs
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm 11+

### Install Dependencies

```bash
npm install
```

### Environment Variables

**Backend** (`apps/api/.env`):
```bash
DATABASE_URL=postgresql://...
PORT=4000
BETTER_AUTH_URL=http://localhost:4000
BETTER_AUTH_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`apps/web/.env`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
```

### Database Setup

```bash
cd apps/api
npm run db:generate    # Generate migrations from schema
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio (optional)
```

### Start Development

```bash
# Run all apps
npm run dev

# Or run individually
cd apps/web && npm run dev    # Frontend: http://localhost:3000
cd apps/api && npm run dev    # Backend:  http://localhost:4000
```

## Backend Features

### API Modules

| Module | Description |
|--------|-------------|
| auth | Better Auth with email, Google, GitHub OAuth |
| blog | Blog CRUD with SEO |
| company-profile | Company information management |
| faq | FAQ management |
| inquiry | Contact form submissions |
| media | Media/file uploads |
| page-seo | Per-page SEO settings |
| redirect | URL redirects with status codes (301, 302, 307, 308, 410) |
| role-permissions | Role-based access control |
| seo | Global SEO settings |
| service | Service catalog |
| store | E-commerce store |
| team | Team member management |
| testimonial | Testimonial management |
| upload | S3 file uploads |

### Database Commands

```bash
npm run db:generate    # Generate migration files
npm run db:migrate     # Apply migrations
npm run db:studio      # Open database GUI
npm run db:seed        # Seed database
```

## Frontend Features

### Pages

- **Public**: Home, Services, Blog, Contact
- **Auth**: Login, Register, Forgot Password, Email Verify
- **Dashboard**: Admin panel with CMS
- **Profile**: User profile management
- **Payment**: Khalti payment integration

### Key Libraries

- `@tanstack/react-query` - Server state management
- `better-auth` - Authentication
- `framer-motion` - Animations
- `tiptap` - Rich text editor
- `shadcn/ui` - UI components
- `lucide-react` - Icons

## Available Scripts

### Root

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all apps |
| `npm run check-types` | Type check all apps |
| `npm run format` | Format code with Prettier |

### Backend (`apps/api`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start NestJS server |
| `npm run dev:watch` | Start with file watching |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |

### Frontend (`apps/web`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## License

MIT
