'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { PasswordResetRequestSchema, passwordResetRequestSchema } from '@/lib/validation/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ForgotPasswordFormProps {
    onToggleForm?: () => void; // To go back to login form
}

export default function ForgotPasswordForm({ onToggleForm }: ForgotPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PasswordResetRequestSchema>({
        resolver: zodResolver(passwordResetRequestSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data: PasswordResetRequestSchema) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setPreviewUrl(null);

        try {
            // Use the authStore to request a password reset
            const result = await useAuthStore.getState().requestPasswordReset(data);

            if (result.success) {
                setSuccessMessage(
                    `Password reset instructions have been sent to ${data.email}. Please check your inbox.`
                );

                // For Ethereal demo email preview
                if (result.previewUrl) {
                    setPreviewUrl(result.previewUrl);
                }
            } else {
                setErrorMessage(useAuthStore.getState().error || 'Failed to send reset link. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            {/* Display the Ethereal preview link if available */}
            {previewUrl && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-800 rounded">
                    <p className="font-semibold mb-2">📧 Demo Email Preview:</p>
                    <p className="mb-2 text-sm">
                        Since this is a demo using Ethereal, the email is not actually sent to the recipient.
                    </p>
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium inline-flex items-center"
                    >
                        Click here to view the email that would have been sent
                        <svg
                            className="ml-1 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full rounded-md border px-3 py-2 text-gray-900"
                        placeholder="your@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-400">
                Remembered your password?{' '}
                <button onClick={onToggleForm} className="text-blue-500 hover:underline">
                    Back to login
                </button>
            </p>

            {/* Add demo notice */}
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs">
                <p className="font-medium">📝 Demo Mode Information</p>
                <p className="mt-1">
                    In this demo, Ethereal Email is used instead of a real email service. Emails are not actually
                    delivered to recipients' inboxes but can be viewed through the preview link that appears after
                    submission.
                </p>
            </div>
        </div>
    );
}
