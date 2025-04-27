# Guidelines Document

## Coding Standards

- Never create a file longer than 500 lines of code, else refactor it into modules or helper files
- Write reusable modules or helpers, generalise similar features, refactor and reuse them
- Use clear, consistent imports, and relative imports within packages
- Write functional components with hooks
- Write compact one liners, but comment them if they are not easy to understand
- Arrow functions is preferred over regular functions
- Use meanful function and variable names
- Follow the Single Responsibility Principle
- Always prefer composition over inheritance
- Separate UI from business logic
- Organize UI components into clearly separated folders by feature or responsibility
- Organize logic, helpers, types, models, enums, constants, etc. into clearly separated folders by feature or responsibility
- Organize sensitive API links, keys, tokens, etc. always put them into .env file.

## Performance Considerations

- Use React Suspense and streaming for improved loading states
- Implement code splitting with dynamic imports
- Images should be already optimised and NO NEED to use Next.js Image component
- Cache API responses with server states
- Use Server Components where possible to reduce client JS
- Implement virtualization for long lists

## Documentation

- Document components with JSDoc comments
- Document API endpoints with examples

## Error Handling

- Implement error boundaries for client components
- Use consistent error UI patterns
- Log errors to monitoring service
- Provide user-friendly error messages
- Try catch blocks should be used for any logic that could throw an error

## State Management Guidelines

- Leverage 3rd party library for global state like theming, auth, and other app-wide concerns, e.g. Zustand
- Leverage 3rd party library for server state, e.g. React Query
- Prefer component-local state with useState for UI state
- Refactor complex component states logic into hooks

## Next.jsServer vs Client Components

- Default to Server Components
- Add "use client" directive only when:
    - Using hooks (useState, useEffect, etc.)
    - Using browser-only APIs
    - Attaching event handlers
    - Using client-side routing features

## File Naming Conventions

- Use PascalCase for component files: `Button.tsx`
- Use camelCase for utility files: `formatDate.ts`
- Use index.ts files for barrel exports

## Accessibility Standards

- Use semantic HTML elements
- Include proper ARIA attributes where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Support screen readers
- Test with accessibility tools (Lighthouse, axe)
-

## TypeScript Configuration

- Use strict mode for maximum type safety
- Configure paths for absolute imports
- Set up proper module resolution
- Define global types in a dedicated file

Example `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "paths": {
            "@/*": ["./*"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}
```

## TypeScript Usage

- Use explicit typing rather than inference when appropriate
- Create types for props and data structures
- Use utility types (Pick, Omit, Partial) for type modifications
- Avoid using `any` or `unknown` types where possible
- Leverage TypeScript's strict mode for enhanced type safety
- Use generics for reusable components and functions
- Define proper return types for functions and components
- Use enums for related constants
- Create type guards for runtime type checking
- Implement mapped types for dynamic structures

```tsx
// Example type definitions
type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

type UserFormData = Omit<User, 'id' | 'createdAt'>

type UserProfileProps = {
  userId: string
  showDetails?: boolean
}

// Using generics for reusable components
type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

const List<T> = ({ items, renderItem }: ListProps<T>) => {
  return <ul>{items.map((item, index) => <li key={index}>{renderItem(item)}</li>)}</ul>
}

// Type guard example
const isAdminUser = (user: User): user is User & { role: 'admin' } => {
  return user.role === 'admin'
}

// Enum example
enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
```

## Tailwind CSS Practices

- Use consistent spacing and sizing scales
- Create component classes for repeated patterns
- Use @apply in CSS modules for complex components
- Utilize Tailwind plugins for extended functionality

```tsx
// Example Tailwind usage
<div className="flex items-center space-x-4 p-4 rounded-lg bg-white shadow">
    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
    <div>
        <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
    </div>
</div>
```

## Testing & Reliability

- DO NOT Use storybook for UI component documentation
- Build mock UI component documentation under pages/nostorybook/components/ and index them in pages/nostorybook
- After updating any UI components, check whether existing mock components and index page documentation need to be updated
- Create unit tests for new features (functions, classes, routes, etc)
- After updating any feattures, check whether existing unit tests need to be updated
- Unit tests should live in a `/__tests__` folder mirroring the main app's module structure.
    - Include at least:
        - 1 test for expected use
        - 1 edge case
        - 1 failure case
    - Types of tests:
        - Unit test components with React Testing Library
        - Use Jest for utility functions
        - Test accessibility with jest-axe
        - Integration tests for key user flows
        - E2E tests with Playwright for critical paths

```tsx
// Example test
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
    it('renders user information correctly', () => {
        render(<UserProfile user={mockUser} />);

        expect(screen.getByText(mockUser.name)).toBeInTheDocument();
        expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });

    it('switches to edit mode when edit button is clicked', async () => {
        render(<UserProfile user={mockUser} />);

        await userEvent.click(screen.getByRole('button', { name: /edit/i }));

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
});
```

## API Strategy

- Use React Query for data fetching
- Implement optimistic updates for better UX
- Handle loading, error, and success states consistently
- Structure API routes by resource

## API Type Safety

- Create a single source of truth for API types
- Use Zod for runtime validation of API responses
- Generate TypeScript types from Zod schemas
- Implement type-safe API hooks

```typescript
// Example API type safety
import { z } from 'zod';

// Define schema with Zod
const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['admin', 'user']),
    createdAt: z.string().datetime()
});

// Generate TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// Type-safe API function
async function fetchUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    // Runtime validation
    return UserSchema.parse(data);
}
```

## Security Considerations

- HTTPS enforcement
- XSS protection
- CSRF protection
- SQL injection prevention
- Regular security audits
- Hashed & Salted credentials e.g. scrypt

## Deployment Guidelines

- Run tests, linting, and type checking locally via pre-commit hooks, e.g. Husky
- Run tests, linting, and type checking in CI, e.g. GitHub Actions
- Implement preview deployments for PRs e.g. via Vercel
- ***

This document serves as a guide for development and should be updated as the project evolves.
