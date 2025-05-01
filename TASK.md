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

- [x] Remove Vercel tab and Clerk tab
- [x] Implement Redis session management
- [x] Create sliding session mechanism
- [x] Centralize cookie management in sessionManager.ts
- [x] Implement middleware for route protection
- [x] Add "remember me" functionality

## Documentation

- [x] Document Redis session implementation
- [x] Add clear comments to session management code
- [x] Improve README.md with emoji headers
- [x] Document prerequisites and setup steps

## Testing

- [ ] Set up testing environment
- [ ] Write unit tests for auth logic
- [ ] Test authentication flows

## Discovered During Work

<!-- New tasks discovered during development will be added here -->

- [x] Go back to update remember me to control how long the authentication/session cookie/token is valid (e.g., session cookie vs. long-lived cookie).
- [x] Fix UserUpdateProfile and UserResetPassword to use the session system properly
- [ ] Consider adding metadata to sessions (e.g., IP address, user agent)
- [ ] Implement absolute maximum session lifetime for security
- [ ] Add more robust error handling for Redis connection issues
- [ ] Create admin interface for active sessions management
