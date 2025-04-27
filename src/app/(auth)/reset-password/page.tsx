'use client';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Redirect if no token is provided
    useEffect(() => {
        if (!token) {
            router.replace('/');
        }
    }, [token, router]);

    const handleSuccess = () => {
        router.push('/');
    };

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-gray-100">
            <ResetPasswordForm token={token} onSuccess={handleSuccess} />
        </div>
    );
}
