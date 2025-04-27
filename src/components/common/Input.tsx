import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', error, icon, iconPosition = 'left', ...props }, ref) => {
        const baseStyles =
            'block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:ring-opacity-50';

        const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '';

        const iconPaddingStyles = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

        return (
            <div className="relative">
                {icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    ref={ref}
                    className={`${baseStyles} ${errorStyles} ${iconPaddingStyles} ${className}`}
                    {...props}
                />

                {icon && iconPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}

                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
