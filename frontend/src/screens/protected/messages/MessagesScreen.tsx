import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useGetUserProfileQuery } from '@/slices/usersApiSlice';
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

    const filteredUsers = currentUserProfile?.following?.filter((user: User) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
            <UsersSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredUsers={filteredUsers}
                isLoading={isLoading}
                selectedUser={selectedUser}
                onUserClick={handleUserClick}
            />
            <ConversationArea
                selectedUser={selectedUser}
                currentUserId={userInfo?._id}
                onBackToList={handleBackToList}
            />
        </div>
    );
};

export default MessagesScreen;
