import nodemailer from 'nodemailer';

// Create reusable transporter with Ethereal
export async function createTestTransporter() {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    console.log('Ethereal Email credentials:');
    console.log('- Username:', testAccount.user);
    console.log('- Password:', testAccount.pass);

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

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{
    success: boolean;
    previewUrl?: string;
    error?: any;
}> {
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

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', previewUrl);

        return {
            success: true,
            previewUrl
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error
        };
    }
}
