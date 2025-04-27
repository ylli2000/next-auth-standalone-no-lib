import React, { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(({ children, className = '', ...props }, ref) => (
    <form ref={ref} className={className} {...props}>
        {children}
    </form>
));

Form.displayName = 'Form';

// Form Group
interface FormGroupProps {
    children: ReactNode;
    className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>{children}</div>
);

// Form Error
interface FormErrorProps {
    children: ReactNode;
    className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ children, className = '' }) => (
    <div className={`text-red-500 text-sm mt-1 ${className}`}>{children}</div>
);

// Form Submit Button Group
interface FormButtonGroupProps {
    children: ReactNode;
    className?: string;
}

const FormButtonGroup: React.FC<FormButtonGroupProps> = ({ children, className = '' }) => (
    <div className={`flex justify-end space-x-2 mt-6 ${className}`}>{children}</div>
);

// Form Divider
interface FormDividerProps {
    label?: string;
    className?: string;
}

const FormDivider: React.FC<FormDividerProps> = ({ label, className = '' }) => (
    <div className={`flex items-center my-6 ${className}`}>
        <div className="flex-grow border-t border-gray-700"></div>
        {label && (
            <>
                <span className="flex-shrink mx-4 text-sm text-gray-400">{label}</span>
                <div className="flex-grow border-t border-gray-700"></div>
            </>
        )}
    </div>
);

export { Form, FormButtonGroup, FormDivider, FormError, FormGroup };
