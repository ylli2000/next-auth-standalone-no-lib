import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className = '',
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            isLoading = false,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'font-medium rounded-md focus:outline-none transition-colors';

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2',
            lg: 'px-5 py-2.5 text-lg'
        };

        const variantStyles = {
            primary:
                'bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary),0.8)] focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)]',
            secondary:
                'bg-[rgb(var(--color-secondary),0.1)] text-[rgb(var(--color-secondary))] hover:bg-[rgb(var(--color-secondary),0.2)] focus:ring-2 focus:ring-[rgb(var(--color-secondary)/0.5)]',
            outline:
                'border border-[rgb(var(--color-border))] bg-transparent text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-card))] focus:ring-2 focus:ring-[rgb(var(--color-border))]',
            ghost: 'bg-transparent text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-card))] focus:ring-2 focus:ring-[rgb(var(--color-border))]',
            link: 'bg-transparent text-[rgb(var(--color-primary))] hover:underline p-0 h-auto focus:ring-0'
        };

        const widthStyle = fullWidth ? 'w-full' : '';
        const isDisabled = disabled || isLoading;
        const disabledStyle = isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${disabledStyle} ${className}`}
                disabled={isDisabled}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {children}
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
