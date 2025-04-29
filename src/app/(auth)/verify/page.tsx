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
        <div className="flex flex-col items-center justify-start py-8">
            <VerifyEmail token={token} />
        </div>
    );
}
