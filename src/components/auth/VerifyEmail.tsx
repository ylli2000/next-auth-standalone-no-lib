'use client';

import { EmailVerificationValues } from '@/lib/validation/authSchema';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface VerifyEmailProps {
    token: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function VerifyEmail({ token, onSuccess, onError }: VerifyEmailProps) {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            const errorMsg = 'Invalid verification link. Email verification token is required.';
            setMessage(errorMsg);
            if (onError) onError(errorMsg);
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token } as EmailVerificationValues)
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified successfully!');
                    if (onSuccess) onSuccess();
                } else {
                    setStatus('error');
                    const errorMsg = data.error || 'Failed to verify email. Please try again or contact support.';
                    setMessage(errorMsg);
                    if (onError) onError(errorMsg);
                }
            } catch (error) {
                setStatus('error');
                const errorMsg = 'An unexpected error occurred. Please try again later.';
                setMessage(errorMsg);
                if (onError) onError(errorMsg);
                console.error('Email verification error:', error);
            }
        };

        verifyEmail();
    }, [token, onSuccess, onError]);

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

            {status === 'verifying' && (
                <div className="flex items-center justify-center p-4">
                    <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin mr-2"></div>
                    <p>{message}</p>
                </div>
            )}

            {status === 'success' && (
                <div className="text-center">
                    <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
                        <p>{message}</p>
                    </div>
                    <p className="mb-4">Your email has been verified. You can now log in to your account.</p>
                    <Link href="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Log In
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="text-center">
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                        <p>{message}</p>
                    </div>
                    <p className="mb-4">We couldn&apos;t verify your email. Please try again or contact support.</p>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                        <Link
                            href="/"
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Back to Login
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
