# Project Planning Document

## Project Overview

There are 3 parts to this project.

Firstly we will demonstrate an custom email/password authentication flow using no auth library, using cookies and server side session.

Then we will use NextAuth.js to implement a more robust authentication flow in parallel to use magic link authentication, and we will use NextAuth.js to implement social authentication flows for Google and Github.

Finally we will setup Clerk for authentication and compare it to the other authentication flows.

### Tech Stack

This project is built with Next.js 15, React 19, Tailwind CSS, and TypeScript, following modern best practices and patterns for web development.

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS V4 (Pay attention to new syntax)
- **Language**: TypeScript
- **State Management**: useState for local state, Zustand for global state, React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **API Communication**: React Query (TanStack Query) for data fetching and caching
- **Authentication**: Custom Implementation and NextAuth.js
- **Database**:
- **ORM**: Drizzle ORM
- **Caching**: Redis from upstash
- **Testing**: Jest and React Testing Library
- **Linting/Formatting**: ESLint, Prettier
- **Build/Dev Tools**: pnpm
- **Deployment**: Vercel
- **CI/CD**: Configure GitHub Actions for CI/CD
- **Source Code Repository**: GitHub
- **Pre-commit Checks**: Husky
