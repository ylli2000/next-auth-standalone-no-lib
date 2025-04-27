'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    LoginFormValues,
    PasswordResetRequestValues,
    PasswordResetValues,
    RegisterFormValues
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
    login: (data: LoginFormValues) => Promise<void>;
    register: (data: RegisterFormValues) => Promise<void>;
    logout: () => Promise<void>;
    requestPasswordReset: (data: PasswordResetRequestValues) => Promise<{ success: boolean; previewUrl?: string }>;
    resetPassword: (
        token: string,
        data: PasswordResetValues
    ) => Promise<{ success: boolean; message?: string; error?: string }>;
    resetAuthState: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async ({ email, password }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Login failed');
                    }

                    const user = await response.json();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false
                    });
                }
            },

            register: async ({ name, email, password }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, password })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Registration failed');
                    }

                    const user = await response.json();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Registration failed',
                        isLoading: false
                    });
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await fetch('/api/auth/logout', {
                        method: 'POST'
                    });
                    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Logout failed',
                        isLoading: false
                    });
                }
            },

            requestPasswordReset: async ({ email }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/auth/forgot-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        set({
                            error: result.error || 'Password reset request failed',
                            isLoading: false
                        });
                        return { success: false };
                    }

                    set({ isLoading: false });
                    return {
                        success: true,
                        previewUrl: result.demoPreviewUrl // For demo purposes with Ethereal
                    };
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Password reset request failed',
                        isLoading: false
                    });
                    return { success: false };
                }
            },

            resetPassword: async (token, { password }) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await fetch('/api/auth/reset-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ token, password })
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        set({
                            error: result.error || 'Password reset failed',
                            isLoading: false
                        });
                        return {
                            success: false,
                            error: result.error || 'Password reset failed'
                        };
                    }

                    set({ isLoading: false });
                    return {
                        success: true,
                        message: result.message || 'Password has been reset successfully'
                    };
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
                    set({
                        error: errorMessage,
                        isLoading: false
                    });
                    return {
                        success: false,
                        error: errorMessage
                    };
                }
            },

            resetAuthState: () => {
                set({ error: null });
            }
        }),
        {
            name: 'auth-storage',
            // We'll only store the user in localStorage (not sensitive data)
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
        }
    )
);
