import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { loginFormSchema } from '@/lib/validation/authSchema';
import { verifyPassword } from '@/util/crypto';
import { handleApiError } from '@/util/errors';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        // Parse and validate the request body
        const body = await request.json();

        const validatedData = loginFormSchema.parse(body);
        const { email, password } = validatedData;

        // Query the database for the user
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        });

        // If no user is found or password doesn't match, return an error
        // Using the same error message for both cases for security
        if (!user || !verifyPassword(password, user.password, user.salt)) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Generate a unique session ID
        const sessionId = uuidv4();

        // TODO: In a real implementation, save the session to your redis session cache
        // await redisCache.insert(session).values({ id: sessionId, userId: user.id, expiresAt: ... });

        // Create a response with user data (excluding sensitive information)
        const { password: _, salt: __, ...userWithoutSensitiveData } = user;

        const response = NextResponse.json({ user: userWithoutSensitiveData });

        // Set session cookie in the response
        response.cookies.set({
            name: 'session',
            value: sessionId,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        });

        return response;
    } catch (error) {
        return handleApiError(error);
    }
}
