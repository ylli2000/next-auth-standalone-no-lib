import RegisterForm from '@/components/auth/RegisterForm';
import { useAuthStore } from '@/lib/store/authStore';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

// Mock the auth store
jest.mock('@/lib/store/authStore', () => ({
    useAuthStore: {
        getState: jest.fn()
    }
}));

describe('RegisterForm', () => {
    // Mock data for form submission
    const mockFormData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        terms: true
    };

    const mockRegister = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup router mock
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn()
        });

        // Setup auth store mock
        (useAuthStore.getState as jest.Mock).mockReturnValue({
            register: mockRegister
        });
    });

    it('renders the registration form correctly', () => {
        render(<RegisterForm />);

        // Check that all form elements are present
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/terms/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(<RegisterForm />);

        // Submit the form without filling any fields
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        // Check for validation errors - using the actual error messages from the component
        await waitFor(() => {
            expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/you must agree to the terms and conditions/i)).toBeInTheDocument();
        });
    });

    it('calls register function on valid form submission', async () => {
        // Mock successful registration
        mockRegister.mockResolvedValueOnce({
            success: true,
            previewUrl: 'https://ethereal.email/preview/123'
        });

        render(<RegisterForm />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/full name/i), {
            target: { value: mockFormData.name }
        });

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: mockFormData.email }
        });

        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: mockFormData.password }
        });

        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: mockFormData.confirmPassword }
        });

        fireEvent.click(screen.getByLabelText(/terms/i));

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        // Verify register was called with correct data
        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith(mockFormData);
        });

        // Verify success message is shown
        await waitFor(() => {
            expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
            expect(screen.getByText(/demo email preview/i)).toBeInTheDocument();
            expect(screen.getByText(/check your verification link/i)).toBeInTheDocument();
        });
    });

    it('shows error message on registration failure', async () => {
        // Mock failed registration
        mockRegister.mockResolvedValueOnce({
            success: false,
            error: 'Email already in use'
        });

        render(<RegisterForm />);

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/full name/i), {
            target: { value: mockFormData.name }
        });

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: mockFormData.email }
        });

        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: mockFormData.password }
        });

        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: mockFormData.confirmPassword }
        });

        fireEvent.click(screen.getByLabelText(/terms/i));

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        // Verify error message is shown
        await waitFor(() => {
            expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
        });
    });

    it('calls onShowLogInForm when login link is clicked', () => {
        const mockShowLogin = jest.fn();
        render(<RegisterForm onShowLogInForm={mockShowLogin} />);

        fireEvent.click(screen.getByText(/log in/i));

        expect(mockShowLogin).toHaveBeenCalled();
    });

    it('shows loading state during registration', async () => {
        // Set up a delayed registration to test loading state
        mockRegister.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ success: true });
                    }, 100);
                })
        );

        const { getByRole } = render(<RegisterForm />);

        // Fill out the form
        await act(async () => {
            fireEvent.change(screen.getByLabelText(/full name/i), {
                target: { value: mockFormData.name }
            });

            fireEvent.change(screen.getByLabelText(/email/i), {
                target: { value: mockFormData.email }
            });

            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: mockFormData.password }
            });

            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: mockFormData.confirmPassword }
            });

            fireEvent.click(screen.getByLabelText(/terms/i));
        });

        // Submit the form
        await act(async () => {
            fireEvent.click(getByRole('button', { name: /register/i }));
        });

        // We need to check the content right after clicking
        expect(getByRole('button', { name: /creating account/i })).toBeInTheDocument();
    });
});
