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
        console.info('Email verified successfully');
    };

    const handleError = (error: string) => {
        // Could add additional error handling here if needed
        console.error('Email verification error:', error);
    };

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex flex-col items-center justify-start py-8">
            <VerifyEmail token={token} onSuccess={handleSuccess} onError={handleError} />
        </div>
    );
}
