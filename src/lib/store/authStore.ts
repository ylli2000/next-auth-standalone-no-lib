'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    AuthResponse,
    EmailVerificationFormValues,
    LoginFormValues,
    PasswordResetFormValues,
    PasswordResetRequestFormValues,
    RegisterApiValues,
    RegisterFormValues,
    UpdateProfileFormValues
} from '../validation/authSchema';

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
};

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    rememberMe: boolean;
    login: (data: LoginFormValues) => Promise<AuthResponse>;
    register: (data: RegisterFormValues) => Promise<AuthResponse>;
    logout: () => Promise<AuthResponse>;
    updateProfile: (data: UpdateProfileFormValues) => Promise<AuthResponse>;
    requestPasswordReset: (data: PasswordResetRequestFormValues) => Promise<AuthResponse>;
    resetPassword: (token: string, data: PasswordResetFormValues) => Promise<AuthResponse>;
    verifyEmail: (data: EmailVerificationFormValues) => Promise<AuthResponse>;
    resetAuthState: () => void;
    setRememberMe: (remember: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            rememberMe: false,

            setRememberMe: (remember) => set({ rememberMe: remember }),

            login: async ({ email, password }) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await fetchApi<LoginFormValues, { user: User }>(
                        '/api/auth/login',
                        'POST',
                        { email, password },
                        'Login failed'
                    );

                    set({ user: result.user, isAuthenticated: true, isLoading: false });
                    return {
                        success: true,
                        user: result.user
                    };
                } catch (error) {
                    return handleAuthError(error, set, 'Login failed');
                }
            },

            register: async ({ name, email, password }) => {
                set({ isLoading: true, error: null });
                try {
                    // Only send the fields that the API needs
                    const apiData: RegisterApiValues = { name, email, password };
                    const result = await fetchApi<RegisterApiValues, { user: User; demoPreviewUrl?: string }>(
                        '/api/auth/register',
                        'POST',
                        apiData,
                        'Registration failed'
                    );

                    set({ user: result.user, isAuthenticated: true, isLoading: false });
                    console.info('User registered:', result.user);
                    return {
                        success: true,
                        previewUrl: result.demoPreviewUrl // For demo purposes with Ethereal
                    };
                } catch (error) {
                    return handleAuthError(error, set, 'Registration failed');
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await fetchApi('/api/auth/logout', 'POST');
                    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
                    return {
                        success: true
                    };
                } catch (error) {
                    return handleAuthError(error, set, 'Logout failed');
                }
            },

            updateProfile: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await fetchApi<UpdateProfileFormValues, { user: User }>(
                        '/api/auth/me',
                        'POST',
                        data,
                        'Profile update failed'
                    );

                    set({ user: result.user, isLoading: false });
                    return {
                        success: true,
                        user: result.user
                    };
                } catch (error) {
                    return handleAuthError(error, set, 'Profile update failed');
                }
            },

            requestPasswordReset: async ({ email }) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await fetchApi<PasswordResetRequestFormValues, { demoPreviewUrl?: string }>(
                        '/api/auth/forgot',
                        'POST',
                        { email },
                        'Password reset request failed'
                    );

                    set({ isLoading: false });
                    console.info('Password reset request successful:', result);
                    return {
                        success: true,
                        previewUrl: result.demoPreviewUrl // For demo purposes with Ethereal
                    };
                } catch (error) {
                    return handleAuthError(error, set, 'Password reset request failed');
                }
            },

            resetPassword: async (token, { password }) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await fetchApi<{ token: string; password: string }, { message?: string }>(
                        '/api/auth/reset',
                        'POST',
                        { token, password },
                        'Password reset failed'
                    );

                    set({ isLoading: false });
                    return {
                        success: true,
                        message: result.message || 'Password has been reset successfully'
                    };
                } catch (error) {
                    return handleAuthError(error, set, 'Password reset failed');
                }
            },

            verifyEmail: async ({ token }) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await fetchApi<EmailVerificationFormValues, { message?: string }>(
                        '/api/auth/verify',
                        'POST',
                        { token },
                        'Email verification failed'
                    );

                    set({ isLoading: false });
                    return {
                        success: true,
                        message: result.message || 'Email verified successfully!'
                    };
                } catch (error) {
                    return handleAuthError(error, set, 'Email verification failed');
                }
            },

            resetAuthState: () => {
                set({ error: null });
            }
        }),
        {
            name: 'auth-storage',
            // We'll only store the user and rememberMe in localStorage
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                rememberMe: state.rememberMe
            })
        }
    )
);

/**
 * Helper function to handle common error patterns in auth functions
 */

type SetFunction = (state: Partial<AuthState>) => void;

const handleAuthError = (
    error: unknown,
    set: SetFunction,
    defaultMessage: string,
    logPrefix?: string
): { success: false; error: string } => {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;

    // Update state
    set({
        error: errorMessage,
        isLoading: false
    });

    // Log error if prefix provided
    if (logPrefix) {
        console.error(`${logPrefix}:`, errorMessage);
    }

    // Return standardized error response
    return {
        success: false,
        error: errorMessage
    };
};

/**
 * Helper function to make authenticated API requests
 * @param endpoint The API endpoint to call
 * @param method HTTP method
 * @param data Request payload data
 * @param errorMessage Default error message if no error is provided by the API
 * @returns Response data
 */
const fetchApi = async <T, R>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    data?: T,
    errorMessage: string = 'Request failed'
): Promise<R> => {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || errorMessage);
    }

    return result;
};
