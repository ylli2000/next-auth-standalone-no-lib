import { validateSession } from '@/lib/session/sessionManager';
import { middleware } from '@/middleware';
import '@testing-library/jest-dom';
import { NextRequest, NextResponse } from 'next/server';

// Mock the session manager
jest.mock('@/lib/session/sessionManager', () => ({
    validateSession: jest.fn()
}));

// Mock NextResponse
jest.mock('next/server', () => {
    const originalModule = jest.requireActual('next/server');
    return {
        ...originalModule,
        NextResponse: {
            next: jest.fn().mockReturnValue({ type: 'next' }),
            redirect: jest.fn().mockImplementation((url) => ({
                type: 'redirect',
                url: url.toString()
            }))
        }
    };
});

describe('Middleware', () => {
    let mockRequest: NextRequest;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create a new mock request for each test
        mockRequest = {
            nextUrl: {
                pathname: '/',
                searchParams: new URLSearchParams()
            },
            url: 'http://localhost:3000'
        } as unknown as NextRequest;
    });

    it('allows authenticated users to access protected routes', async () => {
        // Mock authenticated user
        (validateSession as jest.Mock).mockResolvedValue('user-123');

        // Set pathname to a protected route
        mockRequest.nextUrl.pathname = '/me';

        const response = await middleware(mockRequest);

        expect(validateSession).toHaveBeenCalled();
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('redirects unauthenticated users away from protected routes to login', async () => {
        // Mock unauthenticated user
        (validateSession as jest.Mock).mockResolvedValue(null);

        // Set pathname to a protected route
        mockRequest.nextUrl.pathname = '/me';

        const response = await middleware(mockRequest);

        expect(validateSession).toHaveBeenCalled();
        expect(NextResponse.next).not.toHaveBeenCalled();
        expect(NextResponse.redirect).toHaveBeenCalled();
        expect(response.url).toContain('/auth/login');
        expect(response.url).toContain('callbackUrl=%2Fme');
    });

    it('redirects authenticated users away from auth routes', async () => {
        // Mock authenticated user
        (validateSession as jest.Mock).mockResolvedValue('user-123');

        // Set pathname to an auth route
        mockRequest.nextUrl.pathname = '/auth';

        const response = await middleware(mockRequest);

        expect(validateSession).toHaveBeenCalled();
        expect(NextResponse.next).not.toHaveBeenCalled();
        expect(NextResponse.redirect).toHaveBeenCalled();
        expect(response.url).toContain('http://localhost:3000/');
    });

    it('allows unauthenticated users to access auth routes', async () => {
        // Mock unauthenticated user
        (validateSession as jest.Mock).mockResolvedValue(null);

        // Set pathname to an auth route
        mockRequest.nextUrl.pathname = '/auth';

        const response = await middleware(mockRequest);

        expect(validateSession).toHaveBeenCalled();
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('allows authenticated users to access non-protected routes', async () => {
        // Mock authenticated user
        (validateSession as jest.Mock).mockResolvedValue('user-123');

        // Set pathname to a non-protected route
        mockRequest.nextUrl.pathname = '/about';

        const response = await middleware(mockRequest);

        expect(validateSession).toHaveBeenCalled();
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });

    it('allows unauthenticated users to access non-protected routes', async () => {
        // Mock unauthenticated user
        (validateSession as jest.Mock).mockResolvedValue(null);

        // Set pathname to a non-protected route
        mockRequest.nextUrl.pathname = '/about';

        const response = await middleware(mockRequest);

        expect(validateSession).toHaveBeenCalled();
        expect(NextResponse.next).toHaveBeenCalled();
        expect(NextResponse.redirect).not.toHaveBeenCalled();
    });
});
