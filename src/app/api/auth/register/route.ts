import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { sendEmail } from '@/lib/email/emailService';
import { getEmailVerificationEmailTemplate } from '@/lib/email/templates';
import { getSafeUser, registerApiSchema } from '@/lib/validation/authSchema';
import { generateEmailVerificationToken, generateSalt, hashPassword } from '@/util/crypto';
import { handleApiError } from '@/util/errors';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse and validate the request body
        const body = await request.json();

        const validatedData = registerApiSchema.parse(body);
        const { name, email, password } = validatedData;

        // Check if user already exists
        const existingUser = await db.query.userTable.findFirst({
            where: eq(userTable.email, email)
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'It seems you already have an account with this email, did you forget your password?' },
                { status: 400 }
            );
        }

        // Hash the password
        const salt = generateSalt();
        const hashedPassword = hashPassword(password, salt);

        // Insert the new user into the database
        const [newUser] = await db
            .insert(userTable)
            .values({
                name,
                email,
                password: hashedPassword,
                role: 'user',
                salt,
                emailVerified: false
            })
            .returning();

        // Generate verification token
        const token = generateEmailVerificationToken({
            userId: newUser.id,
            email: newUser.email
        });

        // Create verification link
        const verificationLink = `${request.nextUrl.origin}/verify?token=${token}`;

        // Create email content
        const emailHtml = getEmailVerificationEmailTemplate(newUser.name || 'there', verificationLink);

        // Send verification email
        const emailResult = await sendEmail({
            to: newUser.email,
            subject: 'Verify Your Email Address',
            html: emailHtml
        });

        // Use Zod to remove sensitive data
        const safeUser = getSafeUser(newUser);

        //TODO: In a real app, you wouldn't include the preview URL in the response
        // But for a demo project, this is helpful to see the email that would be sent
        return NextResponse.json(
            {
                user: safeUser,
                //TODO: For demo purposes only!
                demoPreviewUrl: emailResult.previewUrl,
                message: 'Registration successful. Please check your email to verify your account.'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return handleApiError(error);
    }
}
