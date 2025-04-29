import { Button } from '@/components/common/Button';
import Navbar from '@/components/common/Navbar';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Navbar />

            <main className="flex min-h-screen flex-col items-center justify-center p-8 pt-24 bg-gray-900 text-gray-100">
                <div className="max-w-4xl w-full text-center">
                    <h1 className="text-5xl font-bold mb-6">Welcome to Next.js Authentication</h1>
                    <p className="text-xl mb-8">
                        A standalone authentication solution built with Next.js and custom backend.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth" passHref>
                            <Button variant="primary" className="px-8 py-3 text-lg">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-3">Secure Authentication</h2>
                            <p>Built with modern security practices including password hashing and secure cookies.</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-3">Email Verification</h2>
                            <p>Complete email verification flow with custom templates and token handling.</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-3">Password Reset</h2>
                            <p>Forgot password functionality with secure token-based reset process.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
