'use client';

import MessageText from '@/components/common/MessageText';
import { useAuthStore } from '@/lib/store/authStore';
import { PasswordResetRequestFormValues, passwordResetRequestResolver } from '@/lib/validation/authSchema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ForgotPasswordFormProps {
    onShowLogInForm?: () => void; // To go back to login form
}

export default function ForgotPasswordForm({ onShowLogInForm }: ForgotPasswordFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PasswordResetRequestFormValues>({
        resolver: passwordResetRequestResolver,
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (data: PasswordResetRequestFormValues) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setPreviewUrl(null);

        try {
            // Use the authStore to request a password reset
            const result = await useAuthStore.getState().requestPasswordReset(data);

            if (result.success && result.previewUrl) {
                setSuccessMessage(`Password reset instructions have been sent to: ${data.email}`);
                setIsSuccess(true);
                // For Ethereal demo email preview
                setPreviewUrl(result.previewUrl);
            } else {
                // service is actually available but user email is not valid, so we do NOT want to send the reset link
                setErrorMessage(useAuthStore.getState().error || 'Reset service is not available, try again later.');
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
            <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--color-foreground))]">Forgot Your Password?</h2>
            {errorMessage && (
                <div className="mb-4">
                    <MessageText message={errorMessage} variant="error" />
                </div>
            )}

            {successMessage && (
                <div className="mb-4">
                    <MessageText message={successMessage} variant="success" />
                </div>
            )}

            {/* Display the Ethereal preview link if available */}
            {previewUrl && (
                <div className="mb-4">
                    <MessageText
                        variant="info"
                        message={`📧 Demo Email Preview: Since this is a demo using Ethereal, the email is not actually sent to the recipient.`}
                    />
                </div>
            )}

            {isSuccess ? (
                <div className="p-6 space-y-4 text-center">
                    <p className="text-green-500 mb-4">Reset link has been sent to your email!</p>
                    {previewUrl && (
                        <button
                            onClick={() => window.open(previewUrl, '_blank')}
                            className="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:ring-offset-2"
                        >
                            Check Your Reset Link
                        </button>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-[rgb(var(--color-foreground)/0.7)]"
                        >
                            Enter the email you used to register:
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent"
                            placeholder="your@email.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:ring-offset-[rgb(var(--color-background))] disabled:opacity-50"
                    >
                        {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                    </button>
                </form>
            )}
            <p className="mt-4 text-center text-sm text-[rgb(var(--color-foreground)/0.7)]">
                Remembered your password?{' '}
                <button onClick={onShowLogInForm} className="text-[rgb(var(--color-primary))] hover:underline">
                    Back to login
                </button>
            </p>

            {/* Add demo notice */}
            <div className="mt-6">
                <MessageText
                    variant="warning"
                    message="📝 Demo Mode Information: In this demo, Ethereal Email is used instead of a real email service. Emails are not actually delivered to recipients' inboxes but can be viewed through the preview link that appears after submission."
                />
            </div>
        </div>
    );
}
