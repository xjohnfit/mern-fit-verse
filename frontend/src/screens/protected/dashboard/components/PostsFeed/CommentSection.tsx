// React
import { type FC } from "react";

// Types
import { type Comment } from "@/screens/protected/dashboard/types";

// UI components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Components
import { CommentItem } from "./CommentItem";

// Utilities
import { getInitials } from "@/lib/getInitials";

// Icons
import { Send } from "lucide-react";

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    commentText: string;
    currentUserName: string;
    currentUserPhoto?: string;
    showComments: boolean;
    onCommentTextChange: (postId: string, text: string) => void;
    onAddComment: (postId: string) => void;
    onUserClick: (username: string) => void;
    formatRelativeTime: (dateString: string) => string;
}

export const CommentSection: FC<CommentSectionProps> = ({
    postId,
    comments,
    commentText,
    currentUserName,
    currentUserPhoto,
    showComments,
    onCommentTextChange,
    onAddComment,
    onUserClick,
    formatRelativeTime,
}) => {
    if (!showComments) return null;

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* Add Comment */}
            <div className="flex space-x-3 mb-4">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUserPhoto} alt={currentUserName} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                        {getInitials(currentUserName)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex space-x-2">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => onCommentTextChange(postId, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                onAddComment(postId);
                            }
                        }}
                    />
                    <Button
                        size="sm"
                        onClick={() => onAddComment(postId)}
                        disabled={!commentText?.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
                {comments?.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        onUserClick={onUserClick}
                        formatRelativeTime={formatRelativeTime}
                    />
                ))}
            </div>
        </div>
    );
};
