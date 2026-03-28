---
description: Build a hackathon MVP with Next.js App Router, Prisma, Auth.js v5, shadcn/ui v4, and Docker deployment. USE FOR: bootstrapping full-stack Next.js apps rapidly; gamification patterns; AI planner integration; Dokploy Docker deployment. STACK: Next.js 16, TypeScript, Tailwind v4, PostgreSQL, Prisma 5, Auth.js v5 beta, OpenAI, shadcn/ui v4.
applyTo: "**"
---

# Hackathon MVP — Next.js Full-Stack Skill

## Stack Decisions

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 App Router | Server Actions, SSR, file-based routing |
| Styles | Tailwind v4 + shadcn/ui v4 | Fast UI, consistent design tokens |
| DB | PostgreSQL + Prisma 5 | Type-safe queries, easy migrations |
| Auth | Auth.js v5 beta (Credentials) | Email/password without OAuth complexity |
| AI | OpenAI gpt-4o-mini | Low cost, fast, JSON-structured responses |
| Deploy | Dokploy + Docker | CubePath infra, multi-stage build |

## Critical Gotchas

### shadcn/ui v4 — no `asChild`
shadcn v4 uses `@base-ui/react` instead of Radix UI. The `asChild` prop does NOT exist.

**Wrong:**
```tsx
<Button asChild><Link href="/explore">Explorar</Link></Button>
```
**Right:** create a `ButtonLink` wrapper:
```tsx
// components/ui/button-link.tsx
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function ButtonLink({ href, variant, size, className, children, ...props }) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}
```

### Prisma — stay on v5
Prisma v7 changed architecture (no `url` in schema.prisma, TypeScript-only client). The Auth.js adapter only works with Prisma 5:
```bash
npm install prisma@5.22.0 @prisma/client@5.22.0
```

### Auth.js v5 — install with legacy peer deps
next-auth@beta requires Next.js ^14 or ^15, but works with v16 using:
```bash
npm install next-auth@beta --legacy-peer-deps
```

### Zod v4 — `.issues` not `.errors`
```ts
// Wrong (Zod v3):
parsed.error.errors[0].message
// Correct (Zod v4):
parsed.error.issues[0].message
```

### Windows — seed script quoting
PowerShell doesn't support single-quoted JSON. Use a tsconfig file:
```json
// tsconfig.seed.json
{ "extends": "./tsconfig.json", "compilerOptions": { "module": "CommonJS", "moduleResolution": "node" } }
```
```json
// package.json
"db:seed": "ts-node --project tsconfig.seed.json prisma/seed.ts"
```

### Local port conflict
If a local PostgreSQL is already running on 5432, Docker must use a different port:
```yaml
# docker-compose.yml
postgres:
  ports:
    - "5433:5432"
```
```env
DATABASE_URL="postgresql://user:pass@127.0.0.1:5433/dbname?schema=public"
```
**Important:** always use `127.0.0.1` instead of `localhost` on Windows to force IPv4.

### Stale shell env vars override .env
If `$env:DATABASE_URL` was set in the shell, it overrides `.env`. Fix:
```powershell
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
npm run dev
```

### `generateStaticParams` + DB = build failure
Never call the DB in `generateStaticParams` — it runs at build time without the DB:
```ts
// app/places/[slug]/page.tsx
export const dynamic = "force-dynamic";
// Remove generateStaticParams entirely
```
Add `force-dynamic` to ALL pages that query the DB.

### Next.js 16 — `proxy.ts` replaces `middleware.ts`
```bash
mv middleware.ts proxy.ts
```

### Hydration mismatch from browser extensions
Browser accessibility extensions inject `data-landmark-index` attributes. Fix:
```tsx
<header suppressHydrationWarning>
  <nav suppressHydrationWarning>
```

## Folder Structure

```
app/
  layout.tsx          # Root layout: Navbar, Toaster, session
  page.tsx            # Home: Hero + featured places
  explore/page.tsx    # Browse with category filter + search
  places/[slug]/      # Place detail + action buttons
  my-places/page.tsx  # Stats, badges, tabs (protected)
  planner/page.tsx    # AI itinerary generator (protected)
  sign-in/page.tsx    # Credentials login form
  sign-up/page.tsx    # Registration form
  api/auth/[...nextauth]/route.ts

actions/
  auth.ts             # registerUser, loginUser server actions
  places.ts           # togglePlaceStatus, getUserPlaces
  planner.ts          # generateTripPlan (OpenAI), getUserTripPlans

components/
  navbar.tsx          # Responsive nav with auth state dropdown
  place-card.tsx      # Reusable card with status badge overlay
  place-image.tsx     # Client image with gradient fallback on error
  place-action-buttons.tsx  # Client, optimistic wishlist/visited toggle
  explore-search.tsx  # Client search form with router push
  planner-form.tsx    # Client AI planner form
  ui/
    button-link.tsx   # "use client" Link + buttonVariants wrapper

lib/
  auth.ts             # NextAuth v5 config (Credentials, JWT)
  db.ts               # PrismaClient singleton (globalThis pattern)
  session.ts          # getCurrentUser, requireAuth helpers
  constants.ts        # PLACE_CATEGORIES, BADGES

prisma/
  schema.prisma       # User, Place, UserPlace, TripPlan, UserPlaceStatus enum
  seed.ts             # 18 real places with Unsplash images
  migrations/

types/index.ts        # PlaceWithStatus, UserPlaceWithPlace, UserStats
```

## Auth Flow

```ts
// lib/auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize({ email, password }) {
        const user = await db.user.findUnique({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.passwordHash)) return null;
        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) { if (user) token.sub = user.id; return token; },
    session({ session, token }) { session.user.id = token.sub; return session; }
  },
  pages: { signIn: "/sign-in" }
});
```

## Gamification Pattern

```ts
// lib/constants.ts
export const BADGES = [
  { id: "explorer", name: "Explorador", icon: "🗺️", condition: (n) => n >= 1 },
  { id: "adventurer", name: "Aventurero", icon: "⛰️", condition: (n) => n >= 5 },
  { id: "gourmet", name: "Gourmet", icon: "🍽️", condition: (n) => n >= 10 },
  { id: "elite", name: "Viajero Elite", icon: "🏆", condition: (n) => n >= 15 },
];
```

Compute in Server Component:
```ts
const visitedCount = visited.length;
const earnedBadges = BADGES.filter(b => b.condition(visitedCount));
```

## AI Planner

```ts
// actions/planner.ts
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{
    role: "system",
    content: "Eres un experto guía de viajes en Colombia. Genera itinerarios detallados en español."
  }, {
    role: "user",
    content: `Ciudad: ${city}. Días: ${days}. Presupuesto: ${budget}. Intereses: ${interests}. 
    Genera un itinerario día a día en Markdown.`
  }],
  max_tokens: 1500,
});
```

## Deployment (Dokploy / CubePath)

### Dockerfile (multi-stage)
```dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### next.config.ts
```ts
const nextConfig = {
  output: "standalone",
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] }
};
```

### Post-deploy commands
```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

## Image Fallback Pattern

For external images that may fail:
```tsx
// components/place-image.tsx
"use client";
import { useState } from "react";
import Image from "next/image";

export function PlaceImage({ src, alt, category }) {
  const [error, setError] = useState(false);
  if (error) return <GradientFallback category={category} />;
  return <Image src={src} alt={alt} fill onError={() => setError(true)} />;
}
```

## Quick Start Commands

```bash
# Start PostgreSQL (Docker on port 5433 to avoid local conflict)
docker compose up postgres -d

# First time: create tables
npx prisma migrate dev --name init

# Seed data
$env:DATABASE_URL="postgresql://user:pass@127.0.0.1:5433/db?schema=public"
npm run db:seed

# Dev server (always clear stale env first)
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
npm run dev
```
