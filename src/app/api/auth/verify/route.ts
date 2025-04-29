import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { emailVerificationFormSchema } from '@/lib/validation/authSchema';
import { verifyEmailVerificationToken } from '@/util/crypto';
import { handleApiError } from '@/util/errors';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = emailVerificationFormSchema.parse(body);
        const { token } = validatedData;

        // Verify token
        const verificationResult = verifyEmailVerificationToken(token);

        if (!verificationResult.valid || !verificationResult.payload) {
            return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
        }

        const { userId, email } = verificationResult.payload;

        // Find user
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.id, userId)
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if email matches
        if (user.email !== email) {
            return NextResponse.json({ error: 'Email mismatch in verification token' }, { status: 400 });
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.json({ message: 'Email already verified' }, { status: 200 });
        }

        // Update user to mark email as verified
        await db.update(userTable).set({ emailVerified: true }).where(eq(userTable.id, userId));

        return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
}
