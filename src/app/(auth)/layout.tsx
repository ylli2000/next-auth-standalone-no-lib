import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication - Next.js Standalone Auth',
    description: 'Authentication pages for Next.js Standalone Auth'
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <main className="flex-grow py-8">{children}</main>
        </div>
    );
}
