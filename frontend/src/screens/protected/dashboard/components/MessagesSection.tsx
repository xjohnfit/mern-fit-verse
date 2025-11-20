// React
import { type FC } from "react";

// Third-party libraries
import { toast } from "sonner";

// Types
import { type FollowedUser } from "@/screens/protected/dashboard/types";

// UI components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Components
import { EmptyMessages } from "./EmptyStates/EmptyMessages";

// Utilities
import { getInitials } from "@/lib/getInitials";

// Icons
import { MessageSquare, MessageCircle } from "lucide-react";

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
    return (
        <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-green-600" />
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
                    {followedUsers.slice(0, 5).map((user) => (
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
                                    <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Online status indicator - placeholder for future implementation */}
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                            </div>
                            <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => onUserClick(user.username)}
                            >
                                <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    @{user.username}
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                                onClick={() => {
                                    // TODO: Implement messaging functionality
                                    toast.success("Messaging feature coming soon!");
                                }}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}

                    {followedUsers.length > 5 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-green-600 dark:text-green-400"
                            onClick={() => {
                                // TODO: Navigate to full messages page or expand list
                                toast.info("Full messaging interface coming soon!");
                            }}
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
