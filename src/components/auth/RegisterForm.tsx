'use client';

import MessageText from '@/components/common/MessageText';
import { useAuthStore } from '@/lib/store/authStore';
import { RegisterFormValues, registerFormResolver } from '@/lib/validation/authSchema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface RegisterFormProps {
    onShowLogInForm?: () => void; // For toggling to login form
}

export default function RegisterForm({ onShowLogInForm }: RegisterFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormValues>({
        resolver: registerFormResolver,
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
        setPreviewUrl(null);

        try {
            const result = await useAuthStore.getState().register(data);

            if (result.success) {
                setSuccessMessage('Registration successful! Please check your email for verification.');
                setIsSuccess(true);
                if (result.previewUrl) {
                    setPreviewUrl(result.previewUrl);
                }
            } else {
                setErrorMessage(result.error || 'Registration failed');
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckVerification = () => {
        if (previewUrl) {
            window.open(previewUrl, '_blank');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--color-foreground))]">Create an Account</h2>

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
                    <p className="text-[rgb(var(--color-foreground)/0.7)] mb-4">
                        Please check your email for the verification link
                    </p>
                    {previewUrl && (
                        <button
                            onClick={handleCheckVerification}
                            className="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:ring-offset-[rgb(var(--color-background))]"
                        >
                            Check Your Verification Link
                        </button>
                    )}
                    <p className="mt-4 text-sm text-[rgb(var(--color-foreground)/0.7)]">
                        <button onClick={onShowLogInForm} className="text-[rgb(var(--color-primary))] hover:underline">
                            Return to Login
                        </button>
                    </p>
                </div>
            ) : (
                <>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-[rgb(var(--color-foreground)/0.7)]"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent"
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name.message?.toString()}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-[rgb(var(--color-foreground)/0.7)]"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent"
                                placeholder="your@email.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message?.toString()}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-[rgb(var(--color-foreground)/0.7)]"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message?.toString()}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block mb-2 text-sm font-medium text-[rgb(var(--color-foreground)/0.7)]"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword')}
                                className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword.message?.toString()}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                {...register('terms')}
                                className="h-4 w-4 rounded border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] focus:ring-offset-[rgb(var(--color-background))]"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-[rgb(var(--color-foreground)/0.7)]">
                                I agree to the{' '}
                                <a href="/terms" className="text-[rgb(var(--color-primary))] hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-[rgb(var(--color-primary))] hover:underline">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>
                        {errors.terms && <p className="text-sm text-red-500">{errors.terms.message?.toString()}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:ring-offset-[rgb(var(--color-background))] disabled:opacity-50"
                        >
                            {isLoading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-[rgb(var(--color-foreground)/0.7)]">
                        Already have an account?{' '}
                        <button onClick={onShowLogInForm} className="text-[rgb(var(--color-primary))] hover:underline">
                            Log in
                        </button>
                    </p>
                </>
            )}
        </div>
    );
}
