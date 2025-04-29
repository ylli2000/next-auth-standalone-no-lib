import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { sendEmail } from '@/lib/email/emailService';
import { getPasswordResetEmailTemplate } from '@/lib/email/templates';
import { passwordResetRequestFormSchema } from '@/lib/validation/authSchema';
import { generatePasswordResetToken } from '@/util/crypto';
import { handleApiError } from '@/util/errors';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = passwordResetRequestFormSchema.parse(body);

        // Find user by email
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.email, validatedData.email)
        });

        // Don't reveal if user exists or not for security
        if (!user) {
            return NextResponse.json(
                {
                    message: 'If an account with that email exists, a password reset link has been sent.',
                    //TODO: For demo purposes only - would NOT include this in production
                    demo: "User not found, but we don't tell the client that for security reasons."
                },
                { status: 200 }
            );
        }

        // Generate password reset token
        const token = generatePasswordResetToken({
            userId: user.id,
            email: user.email
        });

        // Create reset link
        const resetLink = `${request.nextUrl.origin}/reset?token=${token}`;

        // Create email content
        const emailHtml = getPasswordResetEmailTemplate(
            user.name || 'there', // Use name or fallback
            resetLink
        );

        // Send email using Ethereal
        const emailResult = await sendEmail({
            to: user.email,
            subject: 'Reset Your Password',
            html: emailHtml
        });

        if (emailResult.success) {
            //TODO: In a real app, you wouldn't include the preview URL in the response
            // But for a demo project, this is helpful to see the email that would be sent
            return NextResponse.json(
                {
                    message: 'If an account with that email exists, a password reset link has been sent.',
                    //TODO: For demo purposes only!
                    demoPreviewUrl: emailResult.previewUrl,
                    demoMessage: 'This is an Ethereal email preview link. In production, a real email would be sent.'
                },
                { status: 200 }
            );
        } else {
            console.error('Failed to send email:', emailResult.error);
            return NextResponse.json({ error: 'Failed to send email. Please try again later.' }, { status: 500 });
        }
    } catch (error) {
        return handleApiError(error);
    }
}
