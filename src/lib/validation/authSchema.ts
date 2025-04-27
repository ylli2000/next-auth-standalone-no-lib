import { z } from 'zod';

// Registration form schema
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters' })
            .max(50, { message: 'Name must be less than 50 characters' }),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' })
            .max(100, { message: 'Password must be less than 100 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),
        confirmPassword: z.string(),
        terms: z.boolean().refine((data) => data, {
            message: 'You must agree to the terms and conditions'
        })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
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
export const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' })
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' })
});

// Password reset schema
export const passwordResetSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' })
            .max(100, { message: 'Password must be less than 100 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

// Export types for use with react-hook-form
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type PasswordResetRequestValues = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetValues = z.infer<typeof passwordResetSchema>;
