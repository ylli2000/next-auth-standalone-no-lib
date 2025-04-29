import { loginFormSchema } from '@/lib/validation/authSchema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// This is a placeholder for database connection
// Will be replaced with actual database implementation
const mockUsers = new Map();

export async function POST(request: NextRequest) {
    try {
        // Parse and validate the request body
        const body = await request.json();

        const validatedData = loginFormSchema.parse(body);
        const { email, password } = validatedData;

        // Check if user exists - this is a placeholder
        const user = mockUsers.get(email);

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // In a real implementation, we would:
        // 1. Verify password hash
        // 2. Create a session
        // 3. Set session cookie
        // 4. Return user data

        // Mock password verification (insecure - for demo only!)
        if (user.password !== password) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Mock session
        const sessionId = `session_${Date.now()}`;

        // Create a response
        const response = NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        // Set cookie in the response
        response.cookies.set({
            name: 'session_id',
            value: sessionId,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/'
        });

        return response;
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
