# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database (Prisma with Neon)

```bash
npm run db:generate      # Generate Prisma Client after schema changes
npm run db:migrate       # Create and apply migrations (uses Neon dev branch)
npm run db:push          # Push schema changes without migrations (useful for dev)
npm run db:studio        # Open Prisma Studio GUI for database management
npm run db:pull          # Pull database schema from Neon to update Prisma schema
```

## Architecture

This is a Next.js 15 application using App Router with the following stack:

- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** (PostCSS plugin approach)
- **Clerk** for authentication
- **Prisma** ORM with PostgreSQL
- **React 19**

### Key Patterns

1. **Authentication Flow**: Clerk middleware (`src/middleware.ts`) protects routes at the edge. The ClerkProvider wraps the entire app in the root layout.

2. **Database Models**: Define all models in `prisma/schema.prisma`. After schema changes, run `npx prisma generate` and `npx prisma migrate dev`.

3. **File Organization**:
   - Pages and layouts in `src/app/`
   - Reusable components in `src/components/`
   - Use `@/*` import alias for `src/*`

4. **Environment Variables**: Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` - PostgreSQL connection
   - `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` - Clerk auth keys
   - `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_APP_NAME` - App configuration

### Deployment

- **Database**: Neon DB (PostgreSQL) with dev branch for development
- **Hosting**: Vercel (automatic deployments from git)
- **Environment**: Ensure all env vars are set in Vercel dashboard

### Current State

Fresh Next.js setup with authentication (Clerk) and database (Prisma with Neon PostgreSQL) configured. No business logic implemented yet - ready for movie discovery features.
