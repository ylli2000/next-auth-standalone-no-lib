'use client';

// Define the tab types
export type AuthTabType = 'email-password' | 'vercel' | 'clerk';

interface AuthTabHeadersProps {
    activeTab: AuthTabType;
    onTabChange: (tab: AuthTabType) => void;
}

export default function AuthTabHeaders({ activeTab, onTabChange }: AuthTabHeadersProps) {
    return (
        <div className="w-full max-w-3xl mb-8">
            <div className="flex border-b border-gray-700">
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === 'email-password'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => onTabChange('email-password')}
                >
                    Email/Password
                </button>
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === 'vercel'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => onTabChange('vercel')}
                >
                    Vercel
                </button>
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === 'clerk'
                            ? 'text-blue-500 border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => onTabChange('clerk')}
                >
                    Clerk
                </button>
            </div>
        </div>
    );
}
