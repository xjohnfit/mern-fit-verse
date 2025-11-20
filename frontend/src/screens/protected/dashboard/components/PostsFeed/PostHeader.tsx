// React
import { type FC } from "react";

// Types
import { type PostUser } from "@/screens/protected/dashboard/types";

// UI components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Utilities
import { getInitials } from "@/lib/getInitials";

// Icons
import { Clock } from "lucide-react";

interface PostHeaderProps {
    user: PostUser;
    createdAt: string;
    onUserClick: (username: string) => void;
    formatRelativeTime: (dateString: string) => string;
}

export const PostHeader: FC<PostHeaderProps> = ({
    user,
    createdAt,
    onUserClick,
    formatRelativeTime,
}) => {
    return (
        <div className="flex items-center space-x-3 mb-4">
            <Avatar
                className="w-10 h-10 cursor-pointer"
                onClick={() => onUserClick(user.username)}
            >
                <AvatarImage src={user.photo} alt={user.name} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <p
                        className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:underline"
                        onClick={() => onUserClick(user.username)}
                    >
                        {user.name}
                    </p>
                    <span className="text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.username}
                    </span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(createdAt)}</span>
                </div>
            </div>
        </div>
    );
};
