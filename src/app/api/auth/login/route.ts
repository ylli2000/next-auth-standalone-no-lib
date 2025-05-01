import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { createSessionWithCookie } from '@/lib/session/sessionManager';
import { getSafeUser, loginFormSchema } from '@/lib/validation/authSchema';
import { verifyPassword } from '@/util/crypto';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Login route handler that authenticates users and creates sessions
 *
 * Sliding Session Initialization:
 * - This route initiates the sliding session lifecycle
 * - It creates the initial session in Redis with createSession()
 * - It sets the corresponding session cookie with the same expiration
 * - The initial expiration time is determined by the rememberMe preference
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = loginFormSchema.parse(body);

        // Find user by email
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValidPassword = verifyPassword(password, user.password, user.salt);
        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Get remember me preference from request
        const rememberMe = body.rememberMe || false;

        // Use Zod to remove sensitive data
        const safeUser = getSafeUser(user);

        // Create response with session cookie
        const response = NextResponse.json({ user: safeUser });

        /**
         * Sliding Session Step 1: Create the session and set the cookie
         *
         * - Creates a new session with an initial TTL in Redis
         * - Sets the session cookie with the same duration
         * - All cookie management is now handled by the sessionManager
         */
        await createSessionWithCookie(response.cookies, user.id, rememberMe);

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Login failed' }, { status: 400 });
    }
}
