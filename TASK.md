# Project Tasks

## Initial Setup

- [x] Initialize Next.js 15 project with TypeScript, Tailwind CSS
- [x] Set up project directory structure
- [x] Update README.md with project information

## Core Dependencies

- [x] Install and configure Zustand for global state management
- [x] Install and configure React Hook Form with Zod
- [x] Install and configure React Query
- [x] Set up Drizzle ORM
- [x] Set up Redis for caching
- [x] Configure ESLint and Prettier

## Authentication Implementation

- [ ] Remove Vercel tab and Clerk tab
- [ ] Implement Redis session management

## Testing

- [ ] Set up testing environment
- [ ] Write unit tests for auth logic
- [ ] Test authentication flows

## Discovered During Work

<!-- New tasks discovered during development will be added here -->

- [ ] Go back to update remember me to control how long the authentication/session cookie/token is valid (e.g., session cookie vs. long-lived cookie).
- [ ] UserUpdateProfile and UserResetPassword should read the session id, not the user id.
