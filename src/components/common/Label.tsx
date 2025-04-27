import React, { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ children, className = '', required = false, ...props }, ref) => (
        <label ref={ref} className={`block text-sm font-medium text-gray-200 mb-1 ${className}`} {...props}>
            {children}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
    )
);

Label.displayName = 'Label';

export { Label };
