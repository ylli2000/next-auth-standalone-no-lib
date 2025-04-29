import nodemailer from 'nodemailer';

// Create reusable transporter with Ethereal
export async function createTestTransporter() {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    console.info('Ethereal Email credentials:');
    console.info('- Username:', testAccount.user);
    console.info('- Password:', testAccount.pass);

    // Create a transporter using the test account
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
}

type SendEmailOptions = {
    to: string;
    subject: string;
    html: string;
};

interface SendEmailResult {
    success: boolean;
    previewUrl?: string;
    error?: Error | string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<SendEmailResult> {
    try {
        // Create test transporter
        const transporter = await createTestTransporter();

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Your App" <test@yourapp.com>',
            to,
            subject,
            html
        });

        // Get the preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

        console.info('Message sent: %s', info.messageId);
        console.info('Preview URL: %s', previewUrl);

        return {
            success: true,
            previewUrl
        };
    } catch (error) {
        console.error('Error sending email:', error);

        // Handle error properly with type guard
        return {
            success: false,
            error: error instanceof Error ? error : String(error)
        };
    }
}
