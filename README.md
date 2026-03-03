# Bitespeed Identity Reconciliation

This project implements the Identity Reconciliation task for Bitespeed using Next.js 15, Prisma ORM, and TailwindCSS.

## Overview
It exposes a main REST endpoint `/api/identify` that expects a POST request containing an `email`, a `phoneNumber` (or both) and links identities accordingly to create consolidated cross-channel identities.

The root URL (`/`) provides a clean modern landing page that demonstrates this functionality live via an interactive UI, complete with a mouse-following ambient bubble effect.

## Tech Stack
- Frontend: Next.js 15, React, TailwindCSS, Lucide-React
- Backend: Next.js App Router API Routes
- Database: Neon Postgres
- ORM: Prisma v6

## Running Locally

1. Create a `.env` file in the root directory and add your Neon DB string:
   ```
   DATABASE_URL="postgresql://user:password@host.aws.neon.tech/neondb?sslmode=require"
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Sync the Prisma Schema:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. Run the Dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment
This project is configured and ready to be deployed to Vercel via Git.

- Ensure `DATABASE_URL` is set in Vercel.
- The default Vercel configuration for Next.js handles the build (`npm run build`).

## Test Cases 

Use the UI provided on the landing page or test via cURL:

### 1. New Identity (Creates Primary)
```bash
curl -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "lorraine@hillvalley.edu", "phoneNumber": "123456"}'
```

### 2. Matching Identity, New Info (Creates Secondary)
```bash
curl -X POST http://localhost:3000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'
```
