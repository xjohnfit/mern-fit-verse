import * as React from 'react';

interface SelectContextType {
    value: string;
    onValueChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    disabled?: boolean;
}

export const Select = ({ value, onValueChange, children, disabled }: SelectProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
            <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
                {children}
            </div>
        </SelectContext.Provider>
    );
};

interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export const SelectTrigger = ({ children, className = '' }: SelectTriggerProps) => {
    const context = React.useContext(SelectContext);

    if (!context) {
        throw new Error('SelectTrigger must be used within a Select');
    }

    return (
        <div className='relative'>
            <button
                type='button'
                onClick={() => context.setIsOpen(!context.isOpen)}
                className={`flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
                <span className='truncate'>{children}</span>
                <svg
                    className='h-4 w-4 opacity-50 ml-2 shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                    />
                </svg>
            </button>
        </div>
    );
};

export const SelectValue = ({ placeholder }: { placeholder?: string; }) => {
    const context = React.useContext(SelectContext);

    if (!context) {
        return <span>{placeholder || 'Select...'}</span>;
    }

    return <span>{context.value || placeholder || 'Select...'}</span>;
};

interface SelectContentProps {
    children: React.ReactNode;
}

export const SelectContent = ({ children }: SelectContentProps) => {
    const context = React.useContext(SelectContext);

    if (!context || !context.isOpen) {
        return null;
    }

    return (
        <>
            <div
                className='fixed inset-0 z-40'
                onClick={() => context.setIsOpen(false)}
            />
            <div className='absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg'>
                <div className='p-1'>
                    {children}
                </div>
            </div>
        </>
    );
};

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
}

export const SelectItem = ({ value, children }: SelectItemProps) => {
    const context = React.useContext(SelectContext);

    if (!context) {
        return null;
    }

    const handleClick = () => {
        context.onValueChange(value);
        context.setIsOpen(false);
    };

    return (
        <div
            onClick={handleClick}
            className='relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
            {children}
        </div>
    );
};
