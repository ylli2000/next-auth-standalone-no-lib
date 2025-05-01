import { deleteSessionWithCookie } from '@/lib/session/sessionManager';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json({ success: true });

        // Delete session and clear session cookie in one step
        await deleteSessionWithCookie(response.cookies);

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Logout failed' }, { status: 500 });
    }
}
