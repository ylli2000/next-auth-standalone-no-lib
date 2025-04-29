'use client';

import { useState } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import LogInForm from './LogInForm';
import RegisterForm from './RegisterForm';

// Form types for state tracking
type FormType = 'login' | 'register' | 'forgot-password';

export default function EmailPasswordTab() {
    const [currentForm, setCurrentForm] = useState<FormType>('login');

    const showLogInForm = () => setCurrentForm('login');
    const showRegisterForm = () => setCurrentForm('register');
    const showForgotPasswordForm = () => setCurrentForm('forgot-password');

    return (
        <div>
            {currentForm === 'login' && (
                <LogInForm onShowRegisterForm={showRegisterForm} onForgotPassword={showForgotPasswordForm} />
            )}

            {currentForm === 'register' && <RegisterForm onShowLogInForm={showLogInForm} />}

            {currentForm === 'forgot-password' && <ForgotPasswordForm onShowLogInForm={showLogInForm} />}
        </div>
    );
}
