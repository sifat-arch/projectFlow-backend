# ProjectFlow Backend

**Backend API:** `https://projectflow-backend-brown.vercel.app`



ProjectFlow is a project submission and review platform that connects learners with mentors. This repository provides the REST API for authentication and project submission workflows.

## Technology Stack

- Node.js and TypeScript (ES modules)
- Express 5
- PostgreSQL
- Prisma ORM with the PostgreSQL driver adapter
- Zod request validation
- JWT authentication and bcrypt password hashing
- Vercel serverless functions for deployment
- tsup for bundling the local production server

## Architecture

The Express application is assembled in `src/app.ts`. Feature modules under `src/app/modules` separate authentication and submission routes, controllers, services, validation schemas, and interfaces. Shared middleware handles authentication, request validation, not-found responses, and errors. Prisma access is centralized in `src/app/lib/prisma.ts`; the database schema and migrations live under `prisma/`.

`src/server.ts` starts the standalone development/production server. `api/index.ts` exposes the Express app as a Vercel serverless function and initializes the database and mentor seed on first invocation. `vercel.json` routes incoming paths to that function.

## Environment Variables

Create a `.env` file in the backend project root:

```env
PORT=5000
APP_URL=http://localhost:3000
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

MENTOR_NAME=ProjectFlow Mentor
MENTOR_EMAIL=mentor@example.com
MENTOR_PASSWORD=replace_with_a_secure_password
```

Use your hosted PostgreSQL connection string for production. Configure these values in the Vercel project's Environment Variables as well. Set `APP_URL` to the frontend's deployed origin. Never commit `.env` or production secrets.

## Installation and Development

Requirements: Node.js 20 or newer and npm. Bun is also supported by the project.

```bash
git clone https://github.com/sifat-arch/projectFlow-backend.git
cd projectFlow-backend
npm install
```

Create `.env`, then generate the Prisma client and start the development server:

```bash
npm run build
npm run dev
```

The API is available at `http://localhost:5000`. The health/welcome endpoint is `/`.

## Build and Run

```bash
npm run build
npm run start
```

The Vercel deployment build runs `prisma generate`; configure the backend repository as a Vercel project and add all required environment variables before deploying.

## API Routes

- `/api/v1/auth` — authentication endpoints
- `/api/v1/submissions` — project submission endpoints

An importable Postman collection is included as `ProjectFlow.postman_collection.json`.

## Related Repository

- Frontend: `https://github.com/sifat-arch/projectFlow-frontend`

