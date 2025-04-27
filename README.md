# Next.js Authentication Project

This project demonstrates multiple authentication strategies in a Next.js application:

1. Custom email/password authentication with cookies and server-side sessions
2. NextAuth.js implementation with magic links
3. Social authentication via NextAuth.js (Google and GitHub)

## Tech Stack

This project is built with:

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: useState for local state, Zustand for global state, React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **API Communication**: React Query (TanStack Query)
- **Authentication**: Custom Implementation and NextAuth.js
- **ORM**: Drizzle ORM
- **Caching**: Redis from Upstash
- **Build/Dev Tools**: pnpm

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/`: Application routes and pages
- `src/app/components/`: Reusable UI components
- `src/lib/`: Utility functions and helpers
- `src/app/api/`: API routes
- `src/app/contexts/`: React context providers
- `src/app/hooks/`: Custom React hooks
- `src/app/styles/`: Global styles and Tailwind configuration

## Features

- Custom email/password authentication
- Magic link authentication
- Social login (Google, GitHub)
- Protected routes
- User profile management
- Session management

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
