import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Delete the session cookie
    response.cookies.delete('session_id');

    return response;
}
