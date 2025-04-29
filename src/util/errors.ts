import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Formats ZodError into a bullet-point string
 * @param error ZodError instance
 * @returns Formatted error string with bullet points
 */
export function formatZodError(error: z.ZodError): string {
    return error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('\n');
}

/**
 * Handles API errors and returns an appropriate NextResponse
 * @param error Any error thrown in an API route
 * @returns NextResponse with appropriate error message and status
 */
export function handleApiError(error: unknown) {
    if (error instanceof z.ZodError) {
        const errorMessage = formatZodError(error);
        console.error('Validation error:', errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (error instanceof Error) {
        console.error('API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fallback for unknown error types
    console.error('Unknown API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
