import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChatHeader } from './ChatHeader';
import { MessagesList } from './MessagesList';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';
import { useSendMessageMutation } from '@/slices/messageApiSlice';
import { toast } from 'sonner';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface ConversationAreaProps {
    selectedUser: User | null;
    currentUserId: string | undefined;
    onBackToList: () => void;
}

export const ConversationArea = ({
    selectedUser,
    currentUserId,
    onBackToList
}: ConversationAreaProps) => {
    const navigate = useNavigate();
    const [messageText, setMessageText] = useState('');
    const [sendMessage, { isLoading }] = useSendMessageMutation();

    const handleSendMessage = async () => {
        if (!messageText.trim() || !currentUserId || !selectedUser) return;

        try {
            await sendMessage({
                senderId: currentUserId,
                receiverId: selectedUser._id,
                text: messageText.trim(),
            }).unwrap();

            setMessageText('');
        } catch (error: any) {
            console.error('Failed to send message:', error);
            toast.error(error?.data?.message || 'Failed to send message');
        }
    };

    const handleUserClick = () => {
        if (selectedUser) {
            navigate(`/profile/view/${selectedUser.username}`);
        }
    };

    return (
        <div className={`flex-1 flex flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
            {selectedUser ? (
                <>
                    <ChatHeader
                        selectedUser={selectedUser}
                        onBackClick={onBackToList}
                        onUserClick={handleUserClick}
                    />
                    <MessagesList
                        selectedUser={selectedUser}
                        currentUserId={currentUserId}
                    />
                    <MessageInput
                        messageText={messageText}
                        setMessageText={setMessageText}
                        onSendMessage={handleSendMessage}
                        recipientName={selectedUser.name}
                        isLoading={isLoading}
                    />
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
};
