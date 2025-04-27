import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled = false, size = 'md', className = '' }) => {
    const toggleSizes = {
        sm: {
            toggle: 'w-8 h-4',
            circle: 'w-3 h-3',
            translateX: 'translate-x-4'
        },
        md: {
            toggle: 'w-10 h-5',
            circle: 'w-4 h-4',
            translateX: 'translate-x-5'
        },
        lg: {
            toggle: 'w-12 h-6',
            circle: 'w-5 h-5',
            translateX: 'translate-x-6'
        }
    };

    const sizeClass = toggleSizes[size];

    return (
        <div className={`flex items-center ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`
          relative inline-flex flex-shrink-0 ${sizeClass.toggle} rounded-full 
          border-2 border-transparent transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          ${checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-400 dark:bg-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
            >
                <span
                    className={`
            ${checked ? sizeClass.translateX : 'translate-x-0'} 
            ${sizeClass.circle} 
            rounded-full bg-white dark:bg-gray-200 shadow transform transition ease-in-out duration-200
          `}
                />
            </button>
            {label && (
                <span className={`ml-2 text-sm text-gray-900 dark:text-gray-300 ${disabled ? 'opacity-50' : ''}`}>
                    {label}
                </span>
            )}
        </div>
    );
};

export { Toggle };
