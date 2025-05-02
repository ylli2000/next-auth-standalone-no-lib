'use client';

import VerifyEmail from '@/components/auth/VerifyEmail';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Redirect to home if no token is provided
    useEffect(() => {
        if (!token) {
            router.replace('/');
        }
    }, [token, router]);

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-8 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
            <h1 className="text-4xl font-bold text-center mb-8">Email Verification</h1>
            <div className="w-full max-w-md bg-[rgb(var(--color-card))] shadow-md rounded-lg p-6 border border-[rgb(var(--color-border))]">
                <VerifyEmail token={token} />
            </div>
        </div>
    );
}
