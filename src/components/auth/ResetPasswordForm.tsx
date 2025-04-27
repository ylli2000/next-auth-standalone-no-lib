'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { PasswordResetValues, passwordResetResolver } from '@/lib/validation/authSchema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ResetPasswordFormProps {
    token: string;
    onSuccess?: () => void;
}

export default function ResetPasswordForm({ token, onSuccess }: ResetPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PasswordResetValues>({
        resolver: passwordResetResolver,
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: PasswordResetValues) => {
        setIsLoading(true);
        setMessage(null);

        try {
            // Use the authStore to reset the password
            const result = await useAuthStore.getState().resetPassword(token, data);

            if (result.success) {
                setMessage({ text: result.message || 'Password has been successfully reset.', type: 'success' });

                // Call onSuccess callback if provided
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 3000);
                }
            } else {
                setMessage({ text: result.error || 'Password reset failed.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred. Please try again.', type: 'error' });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Reset Your Password</h1>

            {message && (
                <div
                    className={`mb-6 p-4 rounded ${
                        message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        className="w-full rounded-md border px-3 py-2 text-gray-900"
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                        Confirm New Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        className="w-full rounded-md border px-3 py-2 text-gray-900"
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}
