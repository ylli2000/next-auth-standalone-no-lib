'use client';

import { useAuthStore, User } from '@/lib/store/authStore';
import { AuthResponse, LoginFormValues, RegisterFormValues } from '@/lib/validation/authSchema';
import { createContext, ReactNode, useContext, useEffect } from 'react';

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (loginFormValues: LoginFormValues) => Promise<void>;
    register: (registerFormValues: RegisterFormValues) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    resetAuthState: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, isLoading, error, login, register, logout, resetAuthState } = useAuthStore();

    useEffect(() => {
        // Check auth status on mount
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    // Update store with user data if needed
                    if (userData && !isAuthenticated) {
                        useAuthStore.setState({ user: userData, isAuthenticated: true });
                    }
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        if (!isAuthenticated) {
            checkAuth();
        }
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                error,
                login,
                register,
                logout,
                resetAuthState
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
