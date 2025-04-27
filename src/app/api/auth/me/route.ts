import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    // Get session ID from cookies
    const cookiesStore = await cookies();
    const sessionId = cookiesStore.get('session')?.value;

    if (!sessionId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // TODO: In a real implementation, you would:
        // 1. Verify the session from your sessions table
        // 2. Get the userId from the session
        // 3. Fetch the user with that ID

        // For now, we'll simulate by querying the user
        // This is just a placeholder - in a real app, look up by userId, not sessionId
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.id, sessionId)
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        // Remove sensitive data before returning
        const { password: _, salt: __, ...userWithoutSensitiveData } = user;

        return NextResponse.json(userWithoutSensitiveData);
    } catch (error) {
        console.error('Error fetching user:', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
