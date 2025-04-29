'use client';

import AuthTabHeaders, { AuthTabType } from '@/components/auth/AuthTabHeaders';
import EmailPasswordTab from '@/components/auth/EmailPasswordTab';
import { useState } from 'react';

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<AuthTabType>('email-password');

    const handleTabChange = (tab: AuthTabType) => {
        setActiveTab(tab);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-gray-100">
            <h1 className="text-4xl font-bold text-center mb-8">Authentication Examples</h1>

            {/* Tab Headers */}
            <AuthTabHeaders activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Tab Content */}
            <div className="w-full max-w-3xl bg-gray-800 shadow-md rounded-lg p-6">
                {activeTab === 'email-password' && <EmailPasswordTab />}

                {activeTab === 'vercel' && <div>{/* Vercel Authentication Content */}</div>}

                {activeTab === 'clerk' && <div>{/* Clerk Authentication Content */}</div>}
            </div>
        </main>
    );
}
