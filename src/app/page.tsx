'use client';

import { useState } from 'react';

export default function Home() {
    const [activeTab, setActiveTab] = useState('email-password');

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-gray-100">
            <h1 className="text-4xl font-bold text-center mb-8">Authentication Examples</h1>

            {/* Tabs */}
            <div className="w-full max-w-3xl mb-8">
                <div className="flex border-b border-gray-700">
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'email-password'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('email-password')}
                    >
                        Email/Password
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'vercel'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('vercel')}
                    >
                        Vercel
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'clerk'
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab('clerk')}
                    >
                        Clerk
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full max-w-3xl bg-gray-800 shadow-md rounded-lg p-6">
                {activeTab === 'email-password' && <div>{/* Email/Password Authentication Content */}</div>}

                {activeTab === 'vercel' && <div>{/* Vercel Authentication Content */}</div>}

                {activeTab === 'clerk' && <div>{/* Clerk Authentication Content */}</div>}
            </div>
        </main>
    );
}
