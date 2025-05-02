'use client';

import MessageText from '@/components/common/MessageText';
import { useAuthStore } from '@/lib/store/authStore';
import { PasswordResetFormValues, passwordResetResolver } from '@/lib/validation/authSchema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<PasswordResetFormValues>({
        resolver: passwordResetResolver,
        defaultValues: {
            token,
            password: '',
            confirmPassword: ''
        },
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    const onSubmit = async (data: PasswordResetFormValues) => {
        setIsLoading(true);
        setMessage(null);

        try {
            // Use the authStore to reset the password
            const result = await useAuthStore.getState().resetPassword(token, data);
            if (result.success) {
                setMessage({ text: result.message || 'Password has been successfully reset.', type: 'success' });
                setIsSuccess(true);
            } else {
                setMessage({ text: result.error || 'Password reset failed.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
            console.error('Reset password error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        router.push('/auth');
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-center text-[rgb(var(--color-foreground))]">
                Reset Your Password
            </h1>
            {message && (
                <div className="mb-6">
                    <MessageText
                        message={message.text}
                        variant={message.type === 'success' ? 'success' : 'error'}
                        className="text-center"
                    />
                </div>
            )}

            {isSuccess ? (
                <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg space-y-4 text-center">
                    <p className="text-green-500 mb-4">Your password has been successfully reset!</p>
                    <button
                        onClick={handleLogin}
                        className="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:ring-offset-[rgb(var(--color-background))]"
                    >
                        Go to Login
                    </button>
                </div>
            ) : (
                <>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-[rgb(var(--color-card))] p-6 rounded-lg space-y-4"
                    >
                        <p className="text-[rgb(var(--color-foreground)/0.7)] mb-10">
                            You can reset your password by entering your new password and confirming it below. If you
                            did not request a password reset, please ignore this link and your password will remain
                            unchanged.
                        </p>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-[rgb(var(--color-foreground)/0.7)]"
                            >
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block mb-2 text-sm font-medium text-[rgb(var(--color-foreground)/0.7)]"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword')}
                                className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isValid}
                            className="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:ring-offset-[rgb(var(--color-background))] disabled:opacity-50"
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
