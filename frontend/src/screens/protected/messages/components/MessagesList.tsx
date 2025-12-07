import { MessageCircle } from 'lucide-react';
import { useGetMessagesQuery } from '@/slices/messageApiSlice';
import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/hooks/useSocket';

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface MessagesListProps {
    selectedUser: User;
    currentUserId: string | undefined;
}

export const MessagesList = ({ selectedUser, currentUserId }: MessagesListProps) => {
    const { data: messagesData, isLoading, error } = useGetMessagesQuery(
        {
            senderId: currentUserId || '',
            receiverId: selectedUser._id,
        },
        {
            skip: !currentUserId || !selectedUser._id,
        }
    );

    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Update local messages when query data changes
    useEffect(() => {
        if (messagesData?.messages) {
            setAllMessages(messagesData.messages);
        }
    }, [messagesData]);

    // Listen for real-time messages
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (message: Message) => {
            // Only add message if it's part of the current conversation
            if (
                (message.senderId === selectedUser._id && message.receiverId === currentUserId) ||
                (message.senderId === currentUserId && message.receiverId === selectedUser._id)
            ) {
                setAllMessages((prev) => {
                    // Check if message already exists to avoid duplicates
                    if (prev.some((m) => m._id === message._id)) {
                        return prev;
                    }
                    return [...prev, message];
                });
            }
        };

        socket.on('new-message', handleNewMessage);

        return () => {
            socket.off('new-message', handleNewMessage);
        };
    }, [selectedUser._id, currentUserId]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [allMessages]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-destructive">Failed to load messages</p>
                    <p className="text-muted-foreground text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-background">
            {allMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-foreground font-semibold text-lg mb-2">
                        Start a conversation
                    </p>
                    <p className="text-muted-foreground text-sm max-w-sm">
                        Send a message to {selectedUser.name} to start chatting
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allMessages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex ${message.senderId === currentUserId
                                ? 'justify-end'
                                : 'justify-start'
                                }`}
                        >
                            <div
                                className={`max-w-[90%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${message.senderId === currentUserId
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card text-card-foreground border border-border'
                                    }`}
                            >
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Message attachment"
                                        className="rounded-lg mb-2 max-w-full shadow-sm"
                                    />
                                )}
                                <p className="text-sm break-word leading-relaxed">{message.text}</p>
                                {message.createdAt && (
                                    <p className={`text-[10px] mt-1 ${message.senderId === currentUserId
                                        ? 'text-primary-foreground/80'
                                        : 'text-muted-foreground'
                                        }`}>
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};
