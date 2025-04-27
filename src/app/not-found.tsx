'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-gray-100">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6 text-gray-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Return Home
            </Link>
        </div>
    );
}
