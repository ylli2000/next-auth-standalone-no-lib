import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { validateSession } from '@/lib/session/sessionManager';
import { getSafeUser, updateProfileSchema } from '@/lib/validation/authSchema';
import { generateSalt, hashPassword } from '@/util/crypto';
import { handleApiError } from '@/util/errors';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Note: This route is also protected by middleware, but we validate the session
        // here as well for defense-in-depth and to ensure the route remains secure even
        // if the middleware configuration changes.
        const userId = await validateSession();

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Fetch the user from the database
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.id, userId)
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Use Zod to remove sensitive data
        const safeUser = getSafeUser(user);

        return NextResponse.json({ user: safeUser });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Note: This route is also protected by middleware, but we validate the session
        // here as well for defense-in-depth and to ensure the route remains secure even
        // if the middleware configuration changes.
        const userId = await validateSession();

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Parse and validate the request body
        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        // Prepare update data
        const updateData: { name?: string; password?: string; salt?: string } = {};

        // Only update name if provided
        if (validatedData.name) {
            updateData.name = validatedData.name;
        }

        // If password is provided, hash it
        if (validatedData.password) {
            const salt = generateSalt();
            const hashedPassword = hashPassword(validatedData.password, salt);
            updateData.password = hashedPassword;
            updateData.salt = salt;
        }

        // Only proceed with update if there are changes
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
        }

        // Update the user
        await db.update(userTable).set(updateData).where(eq(userTable.id, userId));

        // Get updated user data
        const updatedUser = await db.query.userTable.findFirst({
            where: eq(userTable.id, userId)
        });

        if (!updatedUser) {
            return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }

        // Use Zod to remove sensitive data
        const safeUser = getSafeUser(updatedUser);

        return NextResponse.json({ user: safeUser });
    } catch (error) {
        return handleApiError(error);
    }
}
