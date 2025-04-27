export function getPasswordResetEmailTemplate(username: string, resetLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${username},</p>
        <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
        <p>To reset your password, click the link below:</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>Thank you,<br/>Your App Team</p>
      </div>
    `;
}

export function getEmailVerificationEmailTemplate(username: string, verificationLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification Required</h2>
        <p>Hello ${username},</p>
        <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the link below:</p>
        <p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>Thank you,<br/>Your App Team</p>
      </div>
    `;
}

export function getWelcomeEmailTemplate(username: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Our App!</h2>
        <p>Hello ${username},</p>
        <p>Thank you for signing up! We're excited to have you on board.</p>
        <p>Here's a quick overview of what you can do:</p>
        <ul>
          <li>Access your account dashboard</li>
          <li>Explore our features</li>
          <li>Contact our support team</li>
        </ul>
        <p>If you have any questions or need assistance, our support team is here for you. Happy exploring!</p>
        <p>Thank you,<br/>Your App Team</p>
      </div>
    `;
}
