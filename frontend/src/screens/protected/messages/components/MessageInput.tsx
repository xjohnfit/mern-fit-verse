import { Image, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useEffect, useState } from 'react';

interface MessageInputProps {
    messageText: string;
    image: File | null;
    setImage: (file: File | null) => void;
    setMessageText: (text: string) => void;
    onSendMessage: () => void;
    recipientName: string;
    isLoading?: boolean;
}

export const MessageInput = ({
    messageText,
    setMessageText,
    image,
    setImage,
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(image);
        } else {
            setImagePreview(null);
        }
    }, [image]);

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-card border-t border-border">
            {/* Image Preview */}
            {imagePreview && (
                <div className="p-3 border-b border-border">
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-32 rounded-lg border border-border"
                        />
                        <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={handleRemoveImage}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}

            <div className="p-3 sm:p-4">
                <div className="flex items-end space-x-2">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder={`Message ${recipientName}...`}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="resize-none bg-muted/50 border-0"
                        />
                    </div>

                    {/* Image upload button */}
                    <Button
                        variant={'secondary'}
                        size="icon"
                        className="shrink-0"
                        disabled={isLoading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Image className="w-5 h-5" />
                        )}
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImage(e.target.files[0]);
                            } else {
                                setImage(null);
                            }
                        }}
                    />
                    <Button
                        onClick={onSendMessage}
                        disabled={(!messageText.trim() && !image) || isLoading}
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
        </div>
    );
};
