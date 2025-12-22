// React
import { type FC } from "react";
import { useNavigate } from "react-router";

// Hooks
import { useSocket } from "@/hooks/useSocket";

// Third-party libraries
import { toast } from "sonner";

// Types
import { type FollowedUser } from "@/screens/protected/dashboard/dashboard.types";

// UI components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Components
import { EmptyMessages } from "./EmptyStates/EmptyMessages";

// Utilities
import { getInitials } from "@/lib/getInitials";

// Icons
import { MessageSquare, MessageCircle, User } from "lucide-react";

interface MessagesSectionProps {
    followedUsers: FollowedUser[] | undefined;
    isLoading: boolean;
    onUserClick: (username: string) => void;
}

export const MessagesSection: FC<MessagesSectionProps> = ({
    followedUsers,
    isLoading,
    onUserClick,
}) => {
    const navigate = useNavigate();
    const { onlineUsers } = useSocket();

    // Sort users: online users first
    const sortedUsers = followedUsers?.slice().sort((a, b) => {
        const aOnline = onlineUsers.includes(a._id);
        const bOnline = onlineUsers.includes(b._id);
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        return 0;
    });

    const handleMessageClick = (user: FollowedUser) => {
        navigate('/messages', {
            state: {
                selectedUser: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    photo: user.photo
                }
            }
        });
    };

    const handleSeeAllClick = () => {
        navigate('/messages');
    };

    return (
        <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Messages
                </h2>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : followedUsers && followedUsers.length > 0 ? (
                <div className="space-y-3">
                    {sortedUsers?.slice(0, 5).map((user) => {
                        const isOnline = onlineUsers.includes(user._id);
                        return (
                            <div
                                key={user._id}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                <div className="relative">
                                    <Avatar
                                        className="w-10 h-10"
                                        onClick={() => onUserClick(user.username)}
                                    >
                                        <AvatarImage src={user.photo} alt={user.name} />
                                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                            <User className="w-5 h-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Online status indicator */}
                                    {isOnline && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                    )}
                                </div>
                                <div
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={() => onUserClick(user.username)}
                                >
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {isOnline ? (
                                            <span className="text-green-600 dark:text-green-500 font-medium flex items-center gap-1">
                                                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                Online
                                            </span>
                                        ) : (
                                            `@${user.username}`
                                        )}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                                    onClick={() => handleMessageClick(user)}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                </Button>
                            </div>
                        );
                    })}

                    {followedUsers.length > 5 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={handleSeeAllClick}
                        >
                            See all conversations
                        </Button>
                    )}
                </div>
            ) : (
                <EmptyMessages />
            )}
        </div>
    );
};
