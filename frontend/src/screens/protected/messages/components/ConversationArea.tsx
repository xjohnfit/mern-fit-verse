import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChatHeader } from './ChatHeader';
import { MessagesList } from './MessagesList';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';

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

    const handleSendMessage = () => {
        if (!messageText.trim()) return;

        // TODO: Implement socket.io send message
        console.log('Sending message:', messageText);
        setMessageText('');
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
                    />
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
};
