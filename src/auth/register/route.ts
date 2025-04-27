import { registerSchema } from '@/lib/validation/authSchema';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// This is a placeholder for database connection
// Will be replaced with actual database implementation
const mockUsers = new Map();

export async function POST(request: NextRequest) {
    try {
        // Parse and validate the request body
        const body = await request.json();

        const validatedData = registerSchema.parse(body);
        const { name, email, password } = validatedData;

        // Check if user already exists - this is a placeholder
        if (mockUsers.has(email)) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
        }

        // In a real implementation, we would:
        // 1. Hash the password
        // 2. Save user to database
        // 3. Create a session
        // 4. Return user data (excluding password)

        // Mock user creation
        const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        mockUsers.set(email, {
            ...newUser,
            password // In real app, this would be hashed!
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
