# Zielabs Technical Stack & Architecture

## 1. Core Stack
- **Framework:** Next.js (App Router) v14+.
- **Language:** TypeScript (Strict mode enabled).
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives).
- **Database:** MySQL (Hosted on Aiven).
- **ORM:** Prisma (v7+ pattern: using `mpostgresql` adapter and `prisma.config.ts`).

## 2. Libraries
- **Animation:** `framer-motion` (Page transitions, scroll reveals).
- **3D Graphics:** `three`, `@react-three/fiber`, `@react-three/drei`.
- **Icons:** `lucide-react`.

## 3. Architectural Rules
- **Unified Full-Stack:** We do NOT use external backend APIs. Everything is handled within Next.js.
- **Data Fetching:** - Use **React Server Components (RSC)** for all read operations (e.g., `await prisma.product.findMany()`).
  - DO NOT use `useEffect` or `SWR`/`React Query` for basic data fetching unless absolutely necessary for client-side polling.
- **Mutations:** Use **Next.js Server Actions** for form submissions, creating, updating, and deleting records. DO NOT create `/api` routes for basic CRUD.
- **Security:** Prisma Client must only be imported and used in Server Components or Server Actions. Never leak database logic to the client.

## 4. Database Schema Context
- **Models:** `Product`, `Category`, `Testimonial`, `Service`.
- Prisma is configured with the `@prisma/adapter-mysql` and `mysql2` pool connection.