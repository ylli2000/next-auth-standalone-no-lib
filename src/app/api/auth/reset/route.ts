import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { passwordResetApiSchema } from '@/lib/validation/authSchema';
import { generateSalt, hashPassword, verifyPasswordResetToken } from '@/util/crypto';
import { handleApiError } from '@/util/errors';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = passwordResetApiSchema.parse(body);

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
        return handleApiError(error);
    }
}
