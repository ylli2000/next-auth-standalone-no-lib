'use client';

import MessageText from '@/components/common/MessageText';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface VerifyEmailProps {
    token: string;
}

export default function VerifyEmail({ token }: VerifyEmailProps) {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const verifyEmail = async () => {
            setStatus('loading');

            try {
                const { verifyEmail: verifyEmailFn } = useAuthStore.getState();
                const result = await verifyEmailFn({ token });

                if (result.success) {
                    setStatus('success');
                    setMessage(result.message || 'Email verified successfully!');
                } else if (result.error) {
                    setStatus('error');
                    setMessage(result.error || 'Email verification failed');
                }
            } catch (error) {
                setStatus('error');
                const errorMsg = 'An unexpected error occurred. Please try again later.';
                setMessage(errorMsg);
                console.error('Email verification error:', error);
            }
        };

        verifyEmail();
    }, [token]);

    const handleReturnToLogin = () => {
        router.push('/auth');
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-center text-[rgb(var(--color-foreground))]">
                Verify Your Email
            </h1>

            {message && (
                <div className="mb-6">
                    <MessageText
                        message={message}
                        variant={status === 'success' ? 'success' : status === 'error' ? 'error' : 'default'}
                        className="text-center"
                    />
                </div>
            )}

            {status === 'success' ? (
                <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg space-y-4 text-center">
                    <p className="text-[rgb(var(--color-foreground)/0.7)] mb-4">
                        Your email has been verified successfully!
                    </p>
                    <button
                        onClick={handleReturnToLogin}
                        className="w-full py-2 px-4 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:ring-offset-[rgb(var(--color-background))]"
                    >
                        Return to Login
                    </button>
                </div>
            ) : (
                <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg space-y-4 text-center">
                    <p className="text-[rgb(var(--color-foreground)/0.7)] mb-4">
                        {status === 'loading' ? 'Verifying your email...' : 'Please wait while we verify your email.'}
                    </p>
                </div>
            )}
        </div>
    );
}
