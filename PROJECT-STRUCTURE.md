# My Turborepo - Project Structure

## Folder Structure

```
my-turborepo/
├── apps/
│   ├── web/              # Next.js frontend (port 3000)
│   ├── docs/             # Next.js docs site (port 3001)
│   └── api/              # NestJS backend (port 4000) ✨ NEW
│       ├── src/
│       │   ├── db/
│       │   │   ├── db.module.ts      # Database module
│       │   │   ├── schema.ts         # Drizzle schema (users table example)
│       │   │   └── migrations/       # Auto-generated migrations
│       │   ├── app.module.ts         # Root module
│       │   ├── app.controller.ts     # API routes
│       │   ├── app.service.ts        # Business logic
│       │   └── main.ts               # Entry point
│       ├── drizzle.config.ts         # Drizzle ORM config
│       ├── nest-cli.json             # NestJS CLI config
│       └── package.json
│
├── packages/
│   ├── ui/                           # Shared React components
│   ├── eslint-config/                # Shared ESLint config
│   └── typescript-config/            # Shared TypeScript configs
│       └── nest.json                 # NestJS TypeScript config ✨ NEW
│
└── turbo.json                        # Turborepo configuration

```

## Backend Stack

- **Framework**: NestJS 10.3
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Language**: TypeScript

## Getting Started

### 1. Setup Database

Update `apps/api/.env` with your PostgreSQL credentials:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
PORT=4000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate & Run Migrations

```bash
cd apps/api
npm run db:generate
npm run db:migrate
```

### 4. Start Development

Run all apps:
```bash
npm run dev
```

Or run specific apps:
```bash
cd apps/api && npm run dev    # Backend on http://localhost:4000
cd apps/web && npm run dev    # Frontend on http://localhost:3000
cd apps/docs && npm run dev   # Docs on http://localhost:3001
```

## API Endpoints

- `GET http://localhost:4000/` - Hello message
- `GET http://localhost:4000/health` - Health check

## Database Management

```bash
cd apps/api
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Project Commands

- `npm run dev` - Start all apps in development
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run check-types` - Type check all apps
