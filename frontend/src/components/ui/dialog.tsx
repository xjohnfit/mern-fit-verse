import { useEffect } from 'react';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

interface DialogDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };

        if (open) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
        >
            {children}
        </div>
    );
};

export const DialogContent = ({ children, className = '' }: DialogContentProps) => {
    return (
        <div
            className={`relative bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4 ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
};

export const DialogHeader = ({ children, className = '' }: DialogHeaderProps) => {
    return (
        <div className={`px-6 pt-6 pb-4 ${className}`}>
            {children}
        </div>
    );
};

export const DialogTitle = ({ children, className = '' }: DialogTitleProps) => {
    return (
        <h2 className={`text-2xl font-bold text-foreground ${className}`}>
            {children}
        </h2>
    );
};

export const DialogDescription = ({ children, className = '' }: DialogDescriptionProps) => {
    return (
        <p className={`text-sm text-muted-foreground mt-2 ${className}`}>
            {children}
        </p>
    );
};

export const DialogFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string; }) => {
    return (
        <div className={`px-6 pb-6 pt-4 flex gap-2 justify-end ${className}`}>
            {children}
        </div>
    );
};

export const DialogBody = ({ children, className = '' }: { children: React.ReactNode; className?: string; }) => {
    return (
        <div className={`px-6 pb-4 ${className}`}>
            {children}
        </div>
    );
};
