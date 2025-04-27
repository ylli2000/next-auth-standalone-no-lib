import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { generateSalt, hashPassword, verifyPasswordResetToken } from '@/util/crypto';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// API specific schema for password reset
const resetPasswordAPISchema = z.object({
    token: z.string().min(1, { message: 'Reset token is required' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(100, { message: 'Password must be less than 100 characters' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        })
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = resetPasswordAPISchema.parse(body);

        // Verify token
        const tokenResult = verifyPasswordResetToken(validatedData.token);

        if (!tokenResult.valid || !tokenResult.payload) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token. Please request a new password reset link.' },
                { status: 400 }
            );
        }

        // Find user by id
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.id, tokenResult.payload.userId)
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found. Please request a new password reset link.' },
                { status: 400 }
            );
        }

        // Check if token email matches user email for extra security
        if (user.email !== tokenResult.payload.email) {
            return NextResponse.json(
                { error: 'Invalid reset token. Please request a new password reset link.' },
                { status: 400 }
            );
        }

        // Generate a new salt and hash the new password
        const salt = generateSalt();
        const hashedPassword = hashPassword(validatedData.password, salt);

        // Update user's password
        await db
            .update(userTable)
            .set({
                password: hashedPassword,
                salt: salt,
                updatedAt: new Date()
            })
            .where(eq(userTable.id, user.id));

        return NextResponse.json(
            { message: 'Password has been successfully reset. You can now log in with your new password.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }

        return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
    }
}
