import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ children, className = '', variant = 'default', padding = 'md', ...props }, ref) => {
        const baseStyles = 'rounded-lg shadow-md overflow-hidden';

        const variantStyles = {
            default: 'bg-gray-800 text-gray-100',
            bordered: 'bg-gray-900 border border-gray-700 text-gray-100'
        };

        const paddingStyles = {
            none: 'p-0',
            sm: 'p-3',
            md: 'p-5',
            lg: 'p-8'
        };

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    separator?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ children, className = '', separator = true, ...props }, ref) => (
        <div ref={ref} className={`mb-4 ${separator ? 'pb-3 border-b border-gray-700' : ''} ${className}`} {...props}>
            {children}
        </div>
    )
);

CardHeader.displayName = 'CardHeader';

// Card Title
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ children, className = '', ...props }, ref) => (
        <h3 ref={ref} className={`text-xl font-semibold text-white ${className}`} {...props}>
            {children}
        </h3>
    )
);

CardTitle.displayName = 'CardTitle';

// Card Description
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ children, className = '', ...props }, ref) => (
        <p ref={ref} className={`text-gray-400 ${className}`} {...props}>
            {children}
        </p>
    )
);

CardDescription.displayName = 'CardDescription';

// Card Body
interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props}>
        {children}
    </div>
));

CardBody.displayName = 'CardBody';

// Card Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    separator?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
    ({ children, className = '', separator = true, ...props }, ref) => (
        <div ref={ref} className={`mt-4 ${separator ? 'pt-3 border-t border-gray-700' : ''} ${className}`} {...props}>
            {children}
        </div>
    )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle };
