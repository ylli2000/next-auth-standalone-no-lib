import LoginForm from '@/components/auth/LoginForm';
import { useAuthStore } from '@/lib/store/authStore';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mock the next/navigation router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

// Mock the auth store
jest.mock('@/lib/store/authStore', () => ({
    useAuthStore: jest.fn()
}));

describe('LoginForm', () => {
    const mockLogin = jest.fn();
    const mockSetRememberMe = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup router mock
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush
        });

        // Setup auth store mock
        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            login: mockLogin,
            rememberMe: false,
            setRememberMe: mockSetRememberMe
        });
    });

    it('renders the login form correctly', () => {
        render(<LoginForm />);

        // Check that all form elements are present
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
        expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    });

    it('calls login function and redirects on successful form submission', async () => {
        // Mock successful login
        mockLogin.mockImplementation(() => Promise.resolve());

        await act(async () => {
            render(<LoginForm />);
        });

        // Fill in form fields
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/email/i), {
                target: { value: 'test@example.com' }
            });

            fireEvent.change(screen.getByLabelText(/password/i), {
                target: { value: 'password123' }
            });
        });

        // Submit the form
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        });

        // Verify login was called with correct arguments
        expect(mockLogin).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });

        // Verify redirect happened after login
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('toggles remember me checkbox', async () => {
        render(<LoginForm />);

        const checkbox = screen.getByLabelText(/remember me/i);

        await act(async () => {
            fireEvent.click(checkbox);
        });

        expect(mockSetRememberMe).toHaveBeenCalledWith(true);
    });

    it('calls onShowRegisterForm when create account is clicked', async () => {
        const mockShowRegister = jest.fn();
        render(<LoginForm onShowRegisterForm={mockShowRegister} />);

        await act(async () => {
            fireEvent.click(screen.getByText(/create an account/i));
        });

        expect(mockShowRegister).toHaveBeenCalled();
    });

    it('calls onForgotPassword when forgot password is clicked', async () => {
        const mockForgotPassword = jest.fn();
        render(<LoginForm onForgotPassword={mockForgotPassword} />);

        await act(async () => {
            fireEvent.click(screen.getByText(/forgot your password/i));
        });

        expect(mockForgotPassword).toHaveBeenCalled();
    });
});
