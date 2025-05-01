'use client';

import EmailPasswordTab from '@/components/auth/EmailPasswordTab';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-gray-100">
            <h1 className="text-4xl font-bold text-center mb-8">Authentication</h1>
            <div className="w-full max-w-3xl bg-gray-800 shadow-md rounded-lg p-6">
                <EmailPasswordTab></EmailPasswordTab>
            </div>
        </main>
    );
}
