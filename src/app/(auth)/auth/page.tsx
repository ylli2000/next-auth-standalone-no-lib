'use client';

import EmailPasswordTab from '@/components/auth/EmailPasswordTab';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
            <h1 className="text-4xl font-bold text-center mb-8">Authentication</h1>
            <div className="w-full max-w-3xl bg-[rgb(var(--color-card))] shadow-md rounded-lg p-6 border border-[rgb(var(--color-border))]">
                <EmailPasswordTab></EmailPasswordTab>
            </div>
        </main>
    );
}
