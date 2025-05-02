'use client';

import { useState } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

// Form types for state tracking
type FormType = 'login' | 'register' | 'forgot-password';

export default function EmailPasswordTab() {
    const [currentForm, setCurrentForm] = useState<FormType>('login');

    const showLoginForm = () => setCurrentForm('login');
    const showRegisterForm = () => setCurrentForm('register');
    const showForgotPasswordForm = () => setCurrentForm('forgot-password');

    return (
        <div>
            {currentForm === 'login' && (
                <LoginForm onShowRegisterForm={showRegisterForm} onForgotPassword={showForgotPasswordForm} />
            )}

            {currentForm === 'register' && <RegisterForm onShowLogInForm={showLoginForm} />}

            {currentForm === 'forgot-password' && <ForgotPasswordForm onShowLogInForm={showLoginForm} />}
        </div>
    );
}
