import { MessageCircle } from 'lucide-react';
import { useGetMessagesQuery } from '@/slices/messageApiSlice';

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
    const { data: messages = [], isLoading } = useGetMessagesQuery(
        {
            senderId: currentUserId || '',
            receiverId: selectedUser._id,
        }
    );

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
                        Start a conversation
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                        Send a message to {selectedUser.name} to start chatting
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex ${message.senderId === currentUserId
                                ? 'justify-end'
                                : 'justify-start'
                                }`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 ${message.senderId === currentUserId
                                    ? 'bg-primary text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                                    }`}
                            >
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Message attachment"
                                        className="rounded-lg mb-2 max-w-full"
                                    />
                                )}
                                <p className="text-sm">{message.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
