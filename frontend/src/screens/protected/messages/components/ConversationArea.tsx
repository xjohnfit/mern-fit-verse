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
    onlineUsers: string[];
}

export const ConversationArea = ({
    selectedUser,
    currentUserId,
    onBackToList,
    onlineUsers
}: ConversationAreaProps) => {
    const navigate = useNavigate();
    const [messageText, setMessageText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [sendMessage, { isLoading }] = useSendMessageMutation();

    const handleSendMessage = async () => {
        if ((!messageText.trim() && !image) || !currentUserId || !selectedUser) return;

        try {
            let imageBase64 = '';
            if (image) {
                imageBase64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(image);
                });
            }

            await sendMessage({
                senderId: currentUserId,
                receiverId: selectedUser._id,
                text: messageText.trim(),
                ...(imageBase64 && { image: imageBase64 }),
            }).unwrap();

            setMessageText('');
            setImage(null);
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
                        onlineUsers={onlineUsers}
                    />
                    <MessagesList
                        selectedUser={selectedUser}
                        currentUserId={currentUserId}
                    />
                    <MessageInput
                        messageText={messageText}
                        setMessageText={setMessageText}
                        image={image}
                        setImage={setImage}
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
