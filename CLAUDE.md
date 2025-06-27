# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: MovieNight

A collaborative movie discovery app where users create shared "Spaces" to build watchlists and favorites together.

📋 **Product Requirements Document**: See `/docs/movie_discovery_prd.md` for detailed features and specifications.

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
- **Tailwind CSS v4** (PostCSS plugin approach) + **shadcn/ui** components
- **Clerk** for authentication
- **tRPC** for type-safe APIs
- **Prisma** ORM with PostgreSQL (Neon)
- **React 19**

## MovieNight-Specific Context

### Key Terminology

- **Spaces** (NOT "Profiles" or "Groups") - Collaborative movie collections
- **Watchlist** - Movies to watch later
- **Favorites** - Movies already watched and loved
- **Members** - Users who belong to a space

### Business Rules

- Default space "My Movies" created on user signup
- Only space creators can delete spaces
- All space members have equal add/remove permissions
- Movies can be in watchlist, favorites, both, or neither
- Content rating filters hide movies above threshold per space
- No voting or approval systems - immediate add/remove

### Core Data Model

```prisma
User (Clerk synced) → SpaceMember → Space → WatchlistItem/FavoriteItem
```

## Key Patterns

### 1. Authentication Flow

Clerk middleware (`src/middleware.ts`) protects routes at the edge. The ClerkProvider wraps the entire app in the root layout.

```tsx
// Server component auth
import { auth } from '@clerk/nextjs';
const { userId } = auth();

// Client component auth
import { useUser } from '@clerk/nextjs';
const { user } = useUser();
```

### 2. tRPC API Patterns

```tsx
// Server-side (in server/api/routers/)
export const spacesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});

// Client-side usage
const createSpace = api.spaces.create.useMutation();
const { data: spaces } = api.spaces.getUserSpaces.useQuery();
```

### 3. Component Structure

```tsx
// Use shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Follow this prop pattern
interface ComponentProps {
  title: string;
  isActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Use cn() for conditional classes
className={cn("base-class", isActive && "active-class", className)}
```

### 4. File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Protected app pages
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui base components
│   ├── spaces/           # Space-related components
│   ├── movie/            # Movie-related components
│   └── layout/           # Layout components
├── server/               # tRPC server code
│   └── api/routers/      # API route handlers
├── lib/                  # Utilities & config
├── types/                # TypeScript definitions
└── hooks/                # Custom React hooks
```

### 5. Error Handling & Loading States

```tsx
// Always handle loading and error states
const { data, isLoading, error } = api.spaces.getSpace.useQuery({ id });

if (isLoading) return <SpaceCardSkeleton />;
if (error) return <ErrorMessage message="Failed to load space" />;

// Show loading states in mutations
<Button disabled={mutation.isLoading}>
  {mutation.isLoading ? 'Saving...' : 'Save Space'}
</Button>;
```

### 6. TMDB Movie Integration

Movies are cached locally but source from TMDB API:

```tsx
// Store essential movie data locally
interface MovieData {
  id: number; // TMDB ID
  title: string;
  posterPath?: string;
  releaseDate?: string;
  overview?: string;
}
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL` - PostgreSQL connection (Neon)
- `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` - Clerk auth keys
- `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_APP_NAME` - App configuration
- `TMDB_API_KEY` - The Movie Database API key

## Common Patterns to Follow

### ✅ DO:

- Use `"use client"` only when necessary (prefer server components)
- Handle loading/error states for all async operations
- Use tRPC for all API calls
- Follow shadcn/ui component patterns
- Use semantic HTML (buttons, forms, etc.)
- Cache movie data locally to reduce TMDB API calls

### ❌ DON'T:

- Use "profiles" terminology (use "spaces")
- Create voting/approval systems
- Track who added/removed movies
- Allow non-creators to delete spaces
- Use inline styles (use Tailwind)
- Expose internal user IDs (use Clerk IDs)

## Deployment

- **Database**: Neon DB (PostgreSQL) with dev branch for development
- **Hosting**: Vercel (automatic deployments from git)
- **Environment**: Ensure all env vars are set in Vercel dashboard

## Current State

Fresh Next.js setup with authentication (Clerk) and database (Prisma with Neon PostgreSQL) configured. tRPC setup in progress. Ready for MovieNight-specific features: spaces, movie lists, and collaboration.
