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
- PostgreSQL database (Neon, Supabase, or local)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/my-turborepo.git
cd my-turborepo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

**Backend** (`apps/api/.env`):
```bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require

# Server
PORT=4000

# Better Auth
BETTER_AUTH_URL=http://localhost:4000
BETTER_AUTH_SECRET=your-random-secret-key
FRONTEND_URL=http://localhost:3000

# Email (SMTP)
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_FROM="Your App <no-reply@domain.com>"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket-name
AWS_CLOUDFRONT_URL=your-bucket-name.s3.region.amazonaws.com
```

**Frontend** (`apps/web/.env`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Set up database

```bash
cd apps/api

# Push schema to database (creates tables)
npm run db:push

# Seed default data (admin user, permissions, navigation)
npm run db:seed
```

Default admin login after seeding:
- **Email:** admin@gmail.com
- **Password:** Admin@123

### 5. Start development servers

```bash
# From root - runs both frontend and backend
npm run dev
```

Or run individually:
```bash
cd apps/web && npm run dev    # Frontend: http://localhost:3000
cd apps/api && npm run dev    # Backend:  http://localhost:4000
```

## Database Commands

```bash
cd apps/api

npm run db:generate    # Generate migration files from schema
npm run db:push        # Push schema changes to database
npm run db:seed        # Seed default data
npm run db:reset       # Truncate all tables (no seed)
npm run db:studio      # Open Drizzle Studio (database GUI)
```

### Reset and re-seed

```bash
npm run db:reset && npm run db:seed
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
| navigation | Navigation menu management |
| page-seo | Per-page SEO settings |
| redirect | URL redirects with status codes (301, 302, 307, 308, 410) |
| role-permissions | Role-based access control |
| seo | Global SEO settings |
| service | Service catalog |
| store | E-commerce store |
| team | Team member management |
| testimonial | Testimonial management |
| upload | S3 file uploads |

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
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed default data |
| `npm run db:reset` | Truncate all tables |
| `npm run db:studio` | Open Drizzle Studio |

### Frontend (`apps/web`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## License

MIT
