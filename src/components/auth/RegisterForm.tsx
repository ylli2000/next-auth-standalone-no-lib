'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { registerSchema } from '@/lib/validation/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false
        }
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const { register: registerFn, error } = useAuthStore.getState();
            await registerFn(data);

            if (error) {
                setErrorMessage(error);
            } else {
                setSuccessMessage('Registration successful! You are being redirected...');
                setTimeout(() => {
                    redirect('/login');
                }, 2000);
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
            <h2 className="text-2xl font-bold mb-6">Create an Account</h2>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="w-full rounded-md border px-3 py-2"
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

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

                <div>
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword')}
                        className="w-full rounded-md border px-3 py-2"
                        placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div className="flex items-center">
                    <input id="terms" type="checkbox" {...register('terms')} className="h-4 w-4 rounded" />
                    <label htmlFor="terms" className="ml-2 text-sm">
                        I agree to the{' '}
                        <a href="/terms" className="text-blue-500 hover:underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-blue-500 hover:underline">
                            Privacy Policy
                        </a>
                    </label>
                </div>
                {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isLoading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-blue-500 hover:underline">
                    Log in
                </a>
            </p>
        </div>
    );
}
