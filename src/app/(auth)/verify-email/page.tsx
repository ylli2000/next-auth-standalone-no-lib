'use client';

import VerifyEmail from '@/components/auth/VerifyEmail';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Redirect to home if no token is provided
    useEffect(() => {
        if (!token) {
            router.replace('/');
        }
    }, [token, router]);

    const handleSuccess = () => {
        // Could add additional logic here if needed
    };

    const handleError = (error: string) => {
        // Could add additional error handling here if needed
        console.error('Email verification error:', error);
    };

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-gray-100">
            <VerifyEmail token={token} onSuccess={handleSuccess} onError={handleError} />
        </div>
    );
}
