import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ReactElement } from 'react';

// Add in any providers here if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => ({
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options })
});

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Add a dummy test to avoid the "must contain at least one test" error
if (process.env.NODE_ENV === 'test') {
    describe('test-utils', () => {
        it('is just a utility file, no tests needed', () => {
            expect(true).toBe(true);
        });
    });
}
