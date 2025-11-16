import { X, Users, UserCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import { getInitials } from '@/lib/getInitials';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface FollowersFollowingModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'followers' | 'following';
    users: User[];
    title: string;
}

const FollowersFollowingModal = ({
    isOpen,
    onClose,
    type,
    users,
    title
}: FollowersFollowingModalProps) => {
    const navigate = useNavigate();

    const handleUserClick = (username: string) => {
        navigate(`/profile/view/${username}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        {type === 'followers' ? (
                            <Users className="w-5 h-5 text-blue-600" />
                        ) : (
                            <UserCheck className="w-5 h-5 text-green-600" />
                        )}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {title}
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {users.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                {type === 'followers' ? (
                                    <Users className="w-8 h-8 text-gray-400" />
                                ) : (
                                    <UserCheck className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleUserClick(user.username)}
                                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                >
                                    <Avatar className="w-12 h-12 shrink-0">
                                        <AvatarImage src={user.photo} alt={user.name} />
                                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersFollowingModal;
