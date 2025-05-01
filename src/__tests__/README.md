# Testing Documentation

This project uses Jest and React Testing Library for testing. This README provides an overview of the testing structure and guidelines.

## Test Structure

```
src/__tests__/
├── components/    # Tests for React components
├── hooks/         # Tests for custom hooks
├── lib/           # Tests for library code/utilities
├── pages/         # Tests for page components
├── utils/         # Test utilities
└── README.md      # This file
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Generate test coverage report
pnpm test:coverage
```

## Writing Tests

### Test File Naming

Test files should be named after the module they test with a `.test.tsx` or `.test.ts` extension.

### Test Utilities

The `src/__tests__/utils/test-utils.tsx` file provides common testing utilities, including a custom `render` function that includes necessary providers.

### Mocking

- For mocking external libraries, use Jest's `jest.mock()` function.
- For mocking API calls, use `jest-fetch-mock`.
- For mocking Zustand stores, use the approach demonstrated in the component tests.

### Examples

See existing tests for examples of how to:

- Test components with user interactions
- Mock Zustand stores
- Test authenticated and unauthenticated states
- Test asynchronous functionality

## Best Practices

1. Focus on user behavior, not implementation details
2. Use screen queries that resemble how users would interact with the app
3. Prefer `getBy*` for elements that should be in the document
4. Use `queryBy*` for elements that might not exist
5. Use `findBy*` for elements that appear asynchronously
6. Test both success and error states
7. Keep tests simple and focused on a single behavior
8. Use data-testid sparingly, prefer semantic queries
