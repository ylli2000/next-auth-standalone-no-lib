'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { PasswordResetSchema, passwordResetSchema } from '@/lib/validation/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Redirect if no token is provided
    useEffect(() => {
        if (!token) {
            router.replace('/');
        }
    }, [token, router]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PasswordResetSchema>({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: PasswordResetSchema) => {
        if (!token) return;

        setIsLoading(true);
        setMessage(null);

        try {
            // Use the authStore to reset the password
            const result = await useAuthStore.getState().resetPassword(token, data);

            if (result.success) {
                setMessage({ text: result.message || 'Password has been successfully reset.', type: 'success' });
                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    router.push('/');
                }, 3000);
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

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-gray-100">
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
        </div>
    );
}
