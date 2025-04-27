'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { loginSchema } from '@/lib/validation/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type LoginSchema = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onToggleForm?: () => void;
    onForgotPassword?: () => void;
}

export default function LogInForm({ onToggleForm, onForgotPassword }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const { login, error } = useAuthStore.getState();
            await login(data);
            if (error) setErrorMessage(error);
            redirect('/');
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Log In</h2>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full rounded-md border px-3 py-2"
                        placeholder="your@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        className="w-full rounded-md border px-3 py-2"
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" type="checkbox" className="h-4 w-4 rounded" />
                        <label htmlFor="remember-me" className="ml-2 text-sm">
                            Remember me
                        </label>
                    </div>

                    {onForgotPassword ? (
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Forgot password?
                        </button>
                    ) : (
                        <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </a>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-4">
                Don&apos;t have an account?{' '}
                <button onClick={onToggleForm} className="text-blue-500 hover:underline">
                    Sign up
                </button>
            </p>
        </div>
    );
}
