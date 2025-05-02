'use client';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ResetPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Redirect if no token is provided
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
            <h1 className="text-4xl font-bold text-center mb-8">Reset Password</h1>
            <div className="w-full max-w-md bg-[rgb(var(--color-card))] shadow-md rounded-lg p-6 border border-[rgb(var(--color-border))]">
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}
