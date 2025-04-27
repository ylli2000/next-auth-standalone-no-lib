import crypto from 'crypto';

export const hashPassword = (password: string, salt: string) => {
    /**
     * This code normalizes text by removing diacritical marks and non-alphanumeric characters:
     * normalize('NFD') - Decomposes characters with accents into their base characters and separate accent marks (Unicode Normalization Form D)
     * .replace(/[\u0300-\u036f]/g, '') - Removes all accent/diacritical marks (Unicode range 0300-036F)
     * .replace(/[^a-zA-Z0-9]/g, '') - Removes all non-alphanumeric characters (everything except a-z, A-Z, 0-9)
     * For example, it would transform "Héllö Wörld!" into "HelloWorld".
     */
    const normalizedPassword = password
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '');
    return crypto.scryptSync(normalizedPassword, salt, 64).toString('hex');
};

export const verifyPassword = (password: string, hashedPassword: string, salt: string) => {
    const passwordHash = hashPassword(password, salt);
    return passwordHash === hashedPassword;
};

export const generateSalt = () =>
    crypto
        .randomBytes(16)
        .toString('hex')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '');

export const generatePasswordResetToken = (payload: { userId: string; email: string }) => {
    // Create a JSON string from the payload
    const data = JSON.stringify(payload);

    // Generate a random token
    const randomBytes = crypto.randomBytes(32).toString('hex');

    // Create expiration time (1 hour from now)
    const expiresAt = Date.now() + 3600000; // 1 hour in milliseconds

    // Combine data, random bytes, and expiration into a JSON string
    const tokenData = JSON.stringify({
        data,
        randomBytes,
        expiresAt
    });

    // Base64 encode the token data
    return Buffer.from(tokenData).toString('base64url');
};

export const verifyPasswordResetToken = (
    token: string
): { valid: boolean; payload?: { userId: string; email: string } } => {
    try {
        // Decode the token
        const tokenData = JSON.parse(Buffer.from(token, 'base64url').toString());

        // Check if token has expired
        if (tokenData.expiresAt < Date.now()) {
            return { valid: false };
        }

        // Parse and return the payload
        const payload = JSON.parse(tokenData.data);
        return {
            valid: true,
            payload
        };
    } catch (error) {
        return { valid: false };
    }
};

export const generateEmailVerificationToken = (payload: { userId: string; email: string }) => {
    // Create a JSON string from the payload
    const data = JSON.stringify(payload);

    // Generate a random token
    const randomBytes = crypto.randomBytes(32).toString('hex');

    // Create expiration time (24 hours from now)
    const expiresAt = Date.now() + 86400000; // 24 hours in milliseconds

    // Combine data, random bytes, and expiration into a JSON string
    const tokenData = JSON.stringify({
        data,
        randomBytes,
        expiresAt
    });

    // Base64 encode the token data
    return Buffer.from(tokenData).toString('base64url');
};

export const verifyEmailVerificationToken = (
    token: string
): { valid: boolean; payload?: { userId: string; email: string } } => {
    try {
        // Decode the token
        const tokenData = JSON.parse(Buffer.from(token, 'base64url').toString());

        // Check if token has expired
        if (tokenData.expiresAt < Date.now()) {
            return { valid: false };
        }

        // Parse and return the payload
        const payload = JSON.parse(tokenData.data);
        return {
            valid: true,
            payload
        };
    } catch (error) {
        return { valid: false };
    }
};
