import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Common password validation schema for reuse
const passwordValidation = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be less than 100 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    });

// Common name validation schema for reuse
const nameField = z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' });

// Shared password validation schema
const passwordFields = {
    password: passwordValidation,
    confirmPassword: z.string()
};

const passwordMatchRefinement = <T extends { password: z.ZodString; confirmPassword: z.ZodString }>(
    schema: z.ZodObject<T>
) =>
    schema.refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

// Registration form schema
export const registerFormSchema = passwordMatchRefinement(
    z.object({
        name: nameField,
        email: z.string().email({ message: 'Please enter a valid email address' }),
        terms: z.boolean().refine((data) => data, {
            message: 'You must agree to the terms and conditions'
        }),
        ...passwordFields
    })
);

// API Registration schema - Only requires fields needed for API
export const registerApiSchema = z.object({
    name: nameField,
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: passwordValidation
});

// This creates a server-side async validator that can be used with the schema
export const checkEmailExists = async (email: string, checkFn: (email: string) => Promise<boolean>) => {
    const exists = await checkFn(email);
    if (exists) {
        throw new z.ZodError([
            {
                code: 'custom',
                path: ['email'],
                message: 'Account already exists'
            }
        ]);
    }
    return email;
};

// Login form schema
export const loginFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' })
});

// Password reset request schema
export const passwordResetRequestFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' })
});

// Email verification token schema
export const emailVerificationFormSchema = z.object({
    token: z.string().min(1, { message: 'Email verification token is required' })
});

// Password reset token schema (for API usage - combines passwordResetSchema with token)
// We're creating a new schema instead of extending to avoid TypeScript issues
export const passwordResetFormSchema = z
    .object({
        token: z.string().min(1, { message: 'Password reset token is required' }),
        password: passwordValidation,
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

// API-only schema for password reset (no confirmPassword needed)
export const passwordResetApiSchema = z.object({
    token: z.string().min(1, { message: 'Password reset token is required' }),
    password: passwordValidation
});

// Export types for use with react-hook-form
export type AuthResponse = {
    success: boolean;
    previewUrl?: string;
    error?: string;
    message?: string;
};

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type RegisterApiValues = z.infer<typeof registerApiSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type PasswordResetRequestFormValues = z.infer<typeof passwordResetRequestFormSchema>;
export type PasswordResetFormValues = z.infer<typeof passwordResetFormSchema>;
export type EmailVerificationFormValues = z.infer<typeof emailVerificationFormSchema>;

// Export form resolvers for convenience
export const registerFormResolver = zodResolver(registerFormSchema);
export const loginFormResolver = zodResolver(loginFormSchema);
export const passwordResetRequestResolver = zodResolver(passwordResetRequestFormSchema);
export const passwordResetResolver = zodResolver(passwordResetFormSchema);
export const emailVerificationResolver = zodResolver(emailVerificationFormSchema);

export const updateProfileSchema = z
    .object({
        name: nameField.optional(),
        password: passwordValidation.optional()
    })
    .refine((data) => data.name || data.password, {
        message: 'At least one field (name or password) must be provided'
    });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

// User password update schema
export const userPasswordUpdateSchema = passwordMatchRefinement(z.object(passwordFields));

export type UserPasswordUpdateFormValues = z.infer<typeof userPasswordUpdateSchema>;
export const userPasswordUpdateResolver = zodResolver(userPasswordUpdateSchema);
