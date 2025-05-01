'use client';

import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from './Button';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated } = useAuthStore();

    // Safely extract user name or fallback to a default
    const userName = user?.name || 'User';

    // Generate a dynamic avatar URL based on the user's name
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1F2937&color=fff&size=128`;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        const { logout } = useAuthStore.getState();
        await logout();
        setIsMenuOpen(false);
        // No need to redirect, store changes will trigger UI update
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 border-b border-gray-700 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-white text-xl font-bold">
                            Auth Demo
                        </Link>
                    </div>

                    <div className="flex items-center">
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={toggleMenu}
                                    className="flex items-center space-x-3 text-gray-300 hover:text-white focus:outline-none"
                                >
                                    <span className="hidden md:inline-block">{userName}</span>
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex-shrink-0 border border-gray-500">
                                        <Image
                                            src={avatarUrl}
                                            alt={userName || 'User'}
                                            width={32}
                                            height={32}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                        <Link
                                            href="/me"
                                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                                            onClick={handleLogout}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/auth" passHref>
                                    <Button variant="primary" size="sm">
                                        Log In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
