import Navbar from '@/components/common/Navbar';
import { useAuthStore } from '@/lib/store/authStore';
import { render, screen } from '../utils/test-utils';

// Mock the authStore
jest.mock('@/lib/store/authStore', () => ({
    useAuthStore: jest.fn()
}));

describe('Navbar Component', () => {
    // Test case for unauthenticated user
    it('renders login button for unauthenticated user', () => {
        // Mock the auth store return value for an unauthenticated user
        (useAuthStore as jest.Mock).mockReturnValue({
            user: null,
            isAuthenticated: false
        });

        render(<Navbar />);

        // Check that login button is visible
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();

        // Check that dropdown menu items are not visible
        expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
    });

    // Test case for authenticated user
    it('renders user avatar and dropdown for authenticated user', async () => {
        // Mock the auth store return value for an authenticated user
        const mockUser = { name: 'Test User', email: 'test@example.com' };
        const mockLogout = jest.fn();

        (useAuthStore as jest.Mock).mockReturnValue({
            user: mockUser,
            isAuthenticated: true
        });

        // Mock the getState method for logout
        (useAuthStore as any).getState = jest.fn().mockReturnValue({
            logout: mockLogout
        });

        const { user } = render(<Navbar />);

        // Check that user name is visible
        expect(screen.getByText('Test User')).toBeInTheDocument();

        // Click on the avatar to open dropdown
        const avatarButton = screen.getByRole('button');
        await user.click(avatarButton);

        // Check that dropdown items are visible
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
        expect(screen.getByText(/sign out/i)).toBeInTheDocument();

        // Ensure settings item is NOT present
        expect(screen.queryByText(/settings/i)).not.toBeInTheDocument();
    });
});
