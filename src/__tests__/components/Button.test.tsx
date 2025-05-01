import { Button } from '@/components/common/Button';
import { render, screen } from '../utils/test-utils';

describe('Button Component', () => {
    it('renders the button with correct text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies the correct variant class', () => {
        render(<Button variant="primary">Primary Button</Button>);
        const button = screen.getByRole('button', { name: /primary button/i });
        expect(button).toHaveClass('bg-blue-600');
    });

    it('applies the correct size class', () => {
        render(<Button size="lg">Large Button</Button>);
        const button = screen.getByRole('button', { name: /large button/i });
        expect(button).toHaveClass('text-lg');
    });
});
