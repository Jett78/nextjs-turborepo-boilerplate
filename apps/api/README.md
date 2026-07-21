# API - NestJS with PostgreSQL & Drizzle ORM

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `DATABASE_URL` in `.env` with your PostgreSQL credentials

4. Generate and run migrations:
```bash
npm run db:generate
npm run db:migrate
```

## Development

```bash
npm run dev
```

API will be available at http://localhost:4000

## Database Commands

- `npm run db:generate` - Generate migrations from schema
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio

## Endpoints

- `GET /` - Hello message
- `GET /health` - Health check
