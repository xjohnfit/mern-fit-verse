import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
    messageText: string;
    setMessageText: (text: string) => void;
    onSendMessage: () => void;
    recipientName: string;
}

export const MessageInput = ({
    messageText,
    setMessageText,
    onSendMessage,
    recipientName
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
                        onKeyPress={handleKeyPress}
                        className="resize-none bg-gray-100 dark:bg-gray-700 border-0"
                    />
                </div>
                <Button
                    onClick={onSendMessage}
                    disabled={!messageText.trim()}
                    size="icon"
                    className="shrink-0"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};
