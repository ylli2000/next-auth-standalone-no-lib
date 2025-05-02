'use client';

import { Button } from '@/components/common/Button';
import MessageText from '@/components/common/MessageText';
import { useAuthStore } from '@/lib/store/authStore';
import { LoginFormValues, loginFormResolver } from '@/lib/validation/authSchema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface LoginFormProps {
    onShowRegisterForm?: () => void; // For toggling to register form
    onForgotPassword?: () => void; // For handling forgot password
}

export default function LoginForm({ onShowRegisterForm, onForgotPassword }: LoginFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login, rememberMe, setRememberMe } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: loginFormResolver,
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setErrorMessage(null);

        const { success, error } = await login(data);
        if (success) {
            router.push('/'); // Redirect to home after successful login
        } else {
            setErrorMessage(error || 'Please check your credentials and try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--color-foreground))]">Welcome Back</h2>

            {errorMessage && (
                <div className="mb-4">
                    <MessageText message={errorMessage} variant="error" />
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[rgb(var(--color-foreground)/0.7)] mb-1"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent transition-colors"
                        placeholder="your@email.com"
                        disabled={isLoading}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-[rgb(var(--color-foreground)/0.7)] mb-1"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register('password')}
                        className="w-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent transition-colors"
                        placeholder="••••••••"
                        disabled={isLoading}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] focus:ring-offset-[rgb(var(--color-background))]"
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-[rgb(var(--color-foreground)/0.7)]"
                        >
                            Remember me
                        </label>
                    </div>
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-[rgb(var(--color-primary))] hover:underline"
                    >
                        Forgot your password?
                    </button>
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-[rgb(var(--color-foreground)/0.7)]">
                    Do not have an account?{' '}
                    <button
                        type="button"
                        onClick={onShowRegisterForm}
                        className="text-[rgb(var(--color-primary))] hover:underline"
                    >
                        Create an account
                    </button>
                </p>
            </form>
        </div>
    );
}
