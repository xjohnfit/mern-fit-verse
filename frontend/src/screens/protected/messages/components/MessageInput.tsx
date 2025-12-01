import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
    messageText: string;
    setMessageText: (text: string) => void;
    onSendMessage: () => void;
    recipientName: string;
    isLoading?: boolean;
}

export const MessageInput = ({
    messageText,
    setMessageText,
    onSendMessage,
    recipientName,
    isLoading = false
}: MessageInputProps) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    return (
        <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-end space-x-2">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder={`Message ${recipientName}...`}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="resize-none bg-gray-100 dark:bg-gray-700 border-0"
                    />
                </div>
                <Button
                    onClick={onSendMessage}
                    disabled={!messageText.trim() || isLoading}
                    size="icon"
                    className="shrink-0"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </Button>
            </div>
        </div>
    );
};
