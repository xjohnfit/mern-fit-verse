// React
import { type FC } from "react";

// Types
import { type SuggestedUser } from "@/screens/protected/dashboard/dashboard.types";

// UI components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Utilities
import { getInitials } from "@/lib/getInitials";

// Icons
import { Users, UserPlus } from "lucide-react";

interface SuggestedUsersListProps {
    suggestedUsers: SuggestedUser[] | undefined;
    isLoading: boolean;
    onFollow: (username: string) => void;
    onUserClick: (username: string) => void;
}

export const SuggestedUsersList: FC<SuggestedUsersListProps> = ({
    suggestedUsers,
    isLoading,
    onFollow,
    onUserClick,
}) => {
    return (
        <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Suggested Users
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
            ) : suggestedUsers && suggestedUsers.length > 0 ? (
                <div className="space-y-3">
                    {suggestedUsers.slice(0, 5).map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Avatar
                                className="w-10 h-10 cursor-pointer"
                                onClick={() => onUserClick(user.username)}
                            >
                                <AvatarImage src={user.photo} alt={user.name} />
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
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
                                variant="outline"
                                onClick={() => onFollow(user.username)}
                                className="px-3 py-1 text-xs"
                            >
                                <UserPlus className="w-3 h-3 mr-1" />
                                Follow
                            </Button>
                        </div>
                    ))}

                    {suggestedUsers.length > 5 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-blue-600 dark:text-blue-400"
                            onClick={() => {
                                /* Could navigate to a full suggested users page */
                            }}
                        >
                            See more suggestions
                        </Button>
                    )}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No suggestions available
                    </p>
                </div>
            )}
        </div>
    );
};
