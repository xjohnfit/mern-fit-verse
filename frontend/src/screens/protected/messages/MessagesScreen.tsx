import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useGetUserProfileQuery } from '@/slices/usersApiSlice';
import { useSocket } from '@/hooks/useSocket';
import { UsersSidebar, ConversationArea } from './components';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

const MessagesScreen = () => {
    const { userInfo } = useSelector((state: any) => state.auth);
    const location = useLocation();
    const { data: currentUserProfile, isLoading } = useGetUserProfileQuery({});
    const { onlineUsers } = useSocket();

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Check if a user was passed via navigation state
    useEffect(() => {
        if (location.state?.selectedUser) {
            setSelectedUser(location.state.selectedUser);
        }
    }, [location.state]);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
    };

    const handleBackToList = () => {
        setSelectedUser(null);
    };

    const filteredUsers = currentUserProfile?.following
        ?.filter((user: User) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a: User, b: User) => {
            const aOnline = onlineUsers.includes(a._id);
            const bOnline = onlineUsers.includes(b._id);
            if (aOnline && !bOnline) return -1;
            if (!aOnline && bOnline) return 1;
            return 0;
        });

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background">
            <UsersSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredUsers={filteredUsers}
                isLoading={isLoading}
                selectedUser={selectedUser}
                onUserClick={handleUserClick}
                onlineUsers={onlineUsers}
            />
            <ConversationArea
                selectedUser={selectedUser}
                currentUserId={userInfo?._id}
                onBackToList={handleBackToList}
                onlineUsers={onlineUsers}
            />
        </div>
    );
};

export default MessagesScreen;
