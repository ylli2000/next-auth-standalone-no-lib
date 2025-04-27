import { NextResponse } from 'next/server';

export async function POST() {
    // Create a response
    const response = NextResponse.json({ success: true });

    // Clear the session cookie
    response.cookies.set({
        name: 'session',
        value: '',
        httpOnly: true,
        expires: new Date(0), // Set expiration to the past to delete the cookie
        path: '/'
    });

    return response;
}
