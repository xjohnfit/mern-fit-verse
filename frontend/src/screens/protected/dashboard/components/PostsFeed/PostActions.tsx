// React
import { type FC } from "react";

// UI components
import { Button } from "@/components/ui/button";

// Icons
import { Heart, MessageCircle } from "lucide-react";

interface PostActionsProps {
    postId: string;
    likes: string[];
    commentsCount: number;
    currentUserId: string;
    onLike: (postId: string) => void;
    onToggleComments: (postId: string) => void;
}

export const PostActions: FC<PostActionsProps> = ({
    postId,
    likes,
    commentsCount,
    currentUserId,
    onLike,
    onToggleComments,
}) => {
    const isLiked = likes?.includes(currentUserId);

    return (
        <div className="flex items-center space-x-4 mb-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(postId)}
                className={`flex items-center space-x-2 ${isLiked
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
            >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likes?.length || 0}</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleComments(postId)}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
                <MessageCircle className="w-4 h-4" />
                <span>{commentsCount || 0}</span>
            </Button>
        </div>
    );
};
