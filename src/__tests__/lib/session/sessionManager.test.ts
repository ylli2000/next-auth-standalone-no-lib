import { redisClient } from '@/lib/redis/client';
import * as sessionManager from '@/lib/session/sessionManager';
import '@testing-library/jest-dom';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

// Mock nanoid
jest.mock('nanoid', () => ({
    nanoid: () => 'test-nanoid-id'
}));

// Mock redis client
jest.mock('@/lib/redis/client', () => ({
    redisClient: {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
        expire: jest.fn()
    }
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
    cookies: jest.fn()
}));

// Mock env
jest.mock('@/lib/env/envSchema', () => ({
    env: {
        NODE_ENV: 'testing'
    }
}));

describe('Session Manager', () => {
    const mockSessionId = 'test-session-id';
    const mockUserId = 'test-user-id';
    const mockCookieStore = {
        get: jest.fn(),
        set: jest.fn()
    };
    const mockResponseCookies = {
        set: jest.fn()
    } as unknown as ResponseCookies;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default cookie mock
        (cookies as jest.Mock).mockReturnValue(mockCookieStore);
        mockCookieStore.get.mockReturnValue({ value: mockSessionId });
    });

    describe('createSession', () => {
        it('creates a new session with default duration', async () => {
            // Setup mock to return a consistent session ID for testing
            jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);

            // Mock redis set
            (redisClient.set as jest.Mock).mockResolvedValue('OK');

            const result = await sessionManager.createSession(mockUserId);

            expect(redisClient.set).toHaveBeenCalledWith(expect.stringContaining('session:'), mockUserId, {
                ex: sessionManager.SESSION_DURATION
            });

            expect(result).toBeTruthy(); // Should return a session ID
        });

        it('creates a new session with remember me duration', async () => {
            // Mock redis set
            (redisClient.set as jest.Mock).mockResolvedValue('OK');

            await sessionManager.createSession(mockUserId, true);

            expect(redisClient.set).toHaveBeenCalledWith(expect.stringContaining('session:'), mockUserId, {
                ex: sessionManager.REMEMBER_ME_DURATION
            });
        });
    });

    describe('getUserId', () => {
        it('returns user ID when session exists', async () => {
            // Mock redis get to return a user ID
            (redisClient.get as jest.Mock).mockResolvedValue(mockUserId);

            const result = await sessionManager.getUserId(mockSessionId);

            expect(redisClient.get).toHaveBeenCalledWith(`session:${mockSessionId}`);
            expect(result).toBe(mockUserId);
        });

        it('returns null when session does not exist', async () => {
            // Mock redis get to return null (no session)
            (redisClient.get as jest.Mock).mockResolvedValue(null);

            const result = await sessionManager.getUserId(mockSessionId);

            expect(redisClient.get).toHaveBeenCalledWith(`session:${mockSessionId}`);
            expect(result).toBeNull();
        });

        it('handles errors and returns null', async () => {
            // Save original console.error
            const originalConsoleError = console.error;

            // Temporarily mock console.error to silence the output during this test
            console.error = jest.fn();

            try {
                // Mock redis get to throw an error
                (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

                const result = await sessionManager.getUserId(mockSessionId);

                expect(redisClient.get).toHaveBeenCalledWith(`session:${mockSessionId}`);
                expect(result).toBeNull();

                // Verify error was logged (without actually displaying it)
                expect(console.error).toHaveBeenCalled();
            } finally {
                // Restore original console.error
                console.error = originalConsoleError;
            }
        });
    });

    describe('refreshSession', () => {
        it('refreshes session expiration when session exists', async () => {
            // Mock getUserId to return a valid user
            (redisClient.get as jest.Mock).mockResolvedValue(mockUserId);
            // Mock expire to succeed
            (redisClient.expire as jest.Mock).mockResolvedValue(1);

            const result = await sessionManager.refreshSession(mockSessionId);

            expect(redisClient.expire).toHaveBeenCalledWith(
                `session:${mockSessionId}`,
                sessionManager.SESSION_DURATION
            );
            expect(result).toBe(true);
        });

        it('returns false when session does not exist', async () => {
            // Mock getUserId to return null (no session)
            (redisClient.get as jest.Mock).mockResolvedValue(null);

            const result = await sessionManager.refreshSession(mockSessionId);

            expect(redisClient.expire).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('getSessionId', () => {
        it('returns session ID from cookie', async () => {
            const result = await sessionManager.getSessionId();

            expect(mockCookieStore.get).toHaveBeenCalledWith('sessionId');
            expect(result).toBe(mockSessionId);
        });

        it('returns undefined when cookie is not found', async () => {
            // Mock cookie.get to return undefined
            mockCookieStore.get.mockReturnValueOnce(undefined);

            const result = await sessionManager.getSessionId();

            expect(result).toBeUndefined();
        });
    });

    describe('validateSession', () => {
        it('returns user ID for valid session and refreshes it', async () => {
            // Mock getSessionId
            mockCookieStore.get.mockReturnValueOnce({ value: mockSessionId });

            // Mock getUserId to return a valid user
            (redisClient.get as jest.Mock).mockResolvedValueOnce(mockUserId);

            // Mock refreshSession with expire
            (redisClient.expire as jest.Mock).mockResolvedValueOnce(1);

            // Set up the mocks for refresh session properly - mock get again for the refresh check
            (redisClient.get as jest.Mock).mockResolvedValueOnce(mockUserId);

            const result = await sessionManager.validateSession();

            expect(result).toBe(mockUserId);
            expect(redisClient.expire).toHaveBeenCalledWith(`session:${mockSessionId}`, expect.any(Number));
        });

        it('returns null when session does not exist', async () => {
            // Mock getSessionId to return undefined
            mockCookieStore.get.mockReturnValueOnce(undefined);

            const result = await sessionManager.validateSession();

            expect(result).toBeNull();
            expect(redisClient.expire).not.toHaveBeenCalled();
        });

        it('returns null when user ID is not found', async () => {
            // Mock getSessionId
            mockCookieStore.get.mockReturnValueOnce({ value: mockSessionId });

            // Mock getUserId to return null
            (redisClient.get as jest.Mock).mockResolvedValueOnce(null);

            const result = await sessionManager.validateSession();

            expect(result).toBeNull();
            expect(redisClient.expire).not.toHaveBeenCalled();
        });
    });

    describe('setSessionCookie', () => {
        it('sets session cookie with default duration', () => {
            sessionManager.setSessionCookie(mockResponseCookies, mockSessionId);

            expect(mockResponseCookies.set).toHaveBeenCalledWith({
                name: 'sessionId',
                value: mockSessionId,
                httpOnly: true,
                secure: false, // Not in production
                sameSite: 'lax',
                path: '/',
                maxAge: sessionManager.SESSION_DURATION
            });
        });

        it('sets session cookie with remember me duration', () => {
            sessionManager.setSessionCookie(mockResponseCookies, mockSessionId, true);

            expect(mockResponseCookies.set).toHaveBeenCalledWith({
                name: 'sessionId',
                value: mockSessionId,
                httpOnly: true,
                secure: false, // Not in production
                sameSite: 'lax',
                path: '/',
                maxAge: sessionManager.REMEMBER_ME_DURATION
            });
        });
    });

    describe('deleteSession', () => {
        it('deletes session from Redis', async () => {
            // Mock redis del
            (redisClient.del as jest.Mock).mockResolvedValue(1);

            await sessionManager.deleteSession(mockSessionId);

            expect(redisClient.del).toHaveBeenCalledWith(`session:${mockSessionId}`);
        });
    });
});
