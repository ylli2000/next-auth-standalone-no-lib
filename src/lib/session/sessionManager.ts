import { env } from '@/lib/env/envSchema';
import { redisClient } from '@/lib/redis/client';
import { User } from '@/lib/store/authStore';
import { nanoid } from 'nanoid';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

const SESSION_PREFIX = 'session:';
export const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds
export const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const SESSION_COOKIE_NAME = 'sessionId';

/**
 * Creates a new session in Redis for the authenticated user
 *
 * @param user The authenticated user object to store in the session
 * @param rememberMe Whether to use the extended session duration
 * @returns The generated session ID
 *
 * Sliding Session Step 1:
 * - Creates a new session with an initial expiration time
 * - The session will expire after SESSION_DURATION or REMEMBER_ME_DURATION
 *   unless it's refreshed by user activity
 */
export async function createSession(user: User, rememberMe: boolean = false): Promise<string> {
    const sessionId = nanoid();
    const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;

    await redisClient.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(user), { ex: duration });

    return sessionId;
}

/**
 * Retrieves a session from Redis by session ID
 *
 * @param sessionId The session ID to look up
 * @returns The user object stored in the session or null if not found
 */
export async function getSession(sessionId: string): Promise<User | null> {
    try {
        const data = await redisClient.get(`${SESSION_PREFIX}${sessionId}`);
        return data ? JSON.parse(data as string) : null;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

/**
 * Deletes a session from Redis
 *
 * @param sessionId The session ID to delete
 */
export async function deleteSession(sessionId: string): Promise<void> {
    await redisClient.del(`${SESSION_PREFIX}${sessionId}`);
}

/**
 * Refreshes the expiration time of an existing session
 *
 * @param sessionId The session ID to refresh
 * @param rememberMe Whether to use the extended session duration
 * @returns Boolean indicating success or failure
 *
 * Sliding Session Step 2:
 * - This is the key function that implements the sliding window behavior
 * - It resets the TTL (time-to-live) for the session key in Redis
 * - Each time this is called, the session expiration is extended by the full duration
 * - This effectively creates a sliding window where user activity extends the session
 */
export async function refreshSession(sessionId: string, rememberMe: boolean = false): Promise<boolean> {
    try {
        const user = await getSession(sessionId);
        if (!user) return false;

        const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
        // Redis EXPIRE command resets the TTL to the specified duration
        await redisClient.expire(`${SESSION_PREFIX}${sessionId}`, duration);
        return true;
    } catch (error) {
        console.error('Error refreshing session:', error);
        return false;
    }
}

/**
 * Gets the current session ID from the cookies
 *
 * @returns The current session ID or undefined if not found
 */
export async function getSessionId(): Promise<string | undefined> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
        return sessionCookie?.value;
    } catch (error) {
        console.error('Error getting session ID:', error);
        return undefined;
    }
}

/**
 * Validates the current session and refreshes its expiration time
 *
 * @returns The user object from the session or null if invalid
 *
 * Sliding Session Step 3:
 * - This function is called on every authenticated request (typically by middleware)
 * - It combines session retrieval with automatic extension of the session lifetime
 * - After validating the session exists, it calls refreshSession() to extend the TTL
 * - This ensures that as long as the user remains active, their session won't expire
 * - The session only expires after the user has been inactive for the full duration
 */
export async function validateSession(): Promise<User | null> {
    try {
        const sessionId = await getSessionId();
        if (!sessionId) return null;

        const user = await getSession(sessionId);
        if (!user) return null;

        // Sliding Session: Refresh the session duration to extend its lifetime
        // This is what creates the "sliding window" effect - each verification
        // resets the countdown timer for session expiration
        await refreshSession(sessionId);
        return user;
    } catch (error) {
        console.error('Error validating session:', error);
        return null;
    }
}

/**
 * Sets the session cookie in the response
 *
 * @param responseCookies The response cookies object to set the cookie on
 * @param sessionId The session ID to store in the cookie
 * @param rememberMe Whether to use the extended cookie duration
 */
export function setSessionCookie(
    responseCookies: ResponseCookies,
    sessionId: string,
    rememberMe: boolean = false
): void {
    responseCookies.set({
        name: SESSION_COOKIE_NAME,
        value: sessionId,
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION
    });
}

/**
 * Clears the session cookie in the response
 *
 * @param responseCookies The response cookies object to clear the cookie from
 */
export function clearSessionCookie(responseCookies: ResponseCookies): void {
    responseCookies.set({
        name: SESSION_COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: new Date(0) // Expire immediately
    });
}

/**
 * Creates a session and sets the session cookie
 * This combines both Redis session creation and cookie setting in one function
 *
 * @param responseCookies The response cookies object to set the cookie on
 * @param user The user object to store in the session
 * @param rememberMe Whether to use the extended session duration
 * @returns The session ID
 */
export async function createSessionWithCookie(
    responseCookies: ResponseCookies,
    user: User,
    rememberMe: boolean = false
): Promise<string> {
    const sessionId = await createSession(user, rememberMe);
    setSessionCookie(responseCookies, sessionId, rememberMe);
    return sessionId;
}

/**
 * Deletes a session and clears the session cookie
 * This combines both Redis session deletion and cookie clearing in one function
 *
 * @param responseCookies The response cookies object to clear the cookie from
 * @param sessionId The session ID to delete (if not provided, will attempt to get from cookies)
 */
export async function deleteSessionWithCookie(responseCookies: ResponseCookies, sessionId?: string): Promise<void> {
    const idToDelete = sessionId || (await getSessionId());
    if (idToDelete) {
        await deleteSession(idToDelete);
    }
    clearSessionCookie(responseCookies);
}
