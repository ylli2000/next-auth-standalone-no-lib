import { db } from '@/lib/drizzle/db';
import { userTable } from '@/lib/drizzle/tableSchema';
import { updateProfileSchema } from '@/lib/validation/authSchema';
import { generateSalt, hashPassword } from '@/util/crypto';
import { handleApiError } from '@/util/errors';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get the session token from cookies
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Find the user by session token
        const user = await db.query.userTable.findFirst({
            where: eq(userTable.id, sessionToken)
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Remove sensitive data
        const { password: _, salt: __, ...userWithoutSensitiveData } = user;

        return NextResponse.json({ user: userWithoutSensitiveData });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get the session token from cookies
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;
        //TODO: this is wrong! sessionToken is not the user id
        //TODO: come back to this when we have a proper session management system
        if (!sessionToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        //TODO: this is wrong! sessionToken is not the user id
        //TODO: come back to this when we have a proper session management system
        const user = await db.query.userTable.findFirst({
            //TODO: <---- fix this: you will never find session in userTable!!
            where: eq(userTable.id, sessionToken)
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
        await db.update(userTable).set(updateData).where(eq(userTable.id, user.id));

        // Get updated user data
        const updatedUser = await db.query.userTable.findFirst({
            where: eq(userTable.id, user.id)
        });

        if (!updatedUser) {
            return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
        }

        // Remove sensitive data
        const { password: _, salt: __, ...userWithoutSensitiveData } = updatedUser;

        return NextResponse.json({ user: userWithoutSensitiveData });
    } catch (error) {
        return handleApiError(error);
    }
}
