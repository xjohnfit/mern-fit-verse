// React
import { type FC } from "react";

// Types
import { type Comment as CommentType } from "@/screens/protected/dashboard/types";

// UI components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Utilities
import { getInitials } from "@/lib/getInitials";

interface CommentItemProps {
    comment: CommentType;
    onUserClick: (username: string) => void;
    formatRelativeTime: (dateString: string) => string;
}

export const CommentItem: FC<CommentItemProps> = ({
    comment,
    onUserClick,
    formatRelativeTime,
}) => {
    return (
        <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
                <AvatarImage src={comment.user.photo} alt={comment.user.name} />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    {getInitials(comment.user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                        <span
                            className="font-medium text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline"
                            onClick={() => onUserClick(comment.user.username)}
                        >
                            {comment.user.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                        {comment.comment}
                    </p>
                </div>
            </div>
        </div>
    );
};
