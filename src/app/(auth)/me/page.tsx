'use client';

import UserProfile from '@/components/auth/UserProfile';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MePage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-gray-100">
            <h1 className="text-4xl font-bold text-center mb-8">My Profile</h1>

            <div className="w-full max-w-3xl">
                <UserProfile />
            </div>
        </main>
    );
}
