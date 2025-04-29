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
        <div className="flex flex-col items-center justify-start py-8">
            <ResetPasswordForm token={token} />
        </div>
    );
}
