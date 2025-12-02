import { MessageCircle } from 'lucide-react';

export const EmptyState = () => {
    return (
        <div className="flex-1 flex items-center justify-center bg-background px-4">
            <div className="text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                </div>
                <p className="text-foreground font-semibold text-lg sm:text-xl mb-2">
                    Your Messages
                </p>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Select a conversation from the left to start messaging
                </p>
            </div>
        </div>
    );
};
