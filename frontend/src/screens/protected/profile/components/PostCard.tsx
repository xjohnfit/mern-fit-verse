import { type FC } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Heart,
    MessageCircle,
    Trash2,
    Clock,
    Send,
} from 'lucide-react';
import { getInitials } from '@/lib/getInitials';
import { formatRelativeTime } from '../../../../lib/formatDate';
import { type Post, type UserProfile } from '../types';

interface PostCardProps {
    post: Post;
    currentUser: UserProfile | null;
    isOwnProfile: boolean;
    commentText: string;
    showComments: boolean;
    onLike: () => void;
    onDelete: () => void;
    onToggleComments: () => void;
    onUpdateCommentText: (text: string) => void;
    onAddComment: () => void;
    onDeleteComment: (commentId: string) => void;
}

export const PostCard: FC<PostCardProps> = ({
    post,
    currentUser,
    isOwnProfile,
    commentText,
    showComments,
    onLike,
    onDelete,
    onToggleComments,
    onUpdateCommentText,
    onAddComment,
    onDeleteComment,
}) => {
    const isLiked = post.likes?.includes(currentUser?._id || '') || false;

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={post.user?.photo} alt={post.user?.name} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            {post.user?.name ? getInitials(post.user.name) : 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {post.user?.name || 'Unknown User'}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>@{post.user?.username || 'unknown'}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatRelativeTime(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {(isOwnProfile || currentUser?._id === post.user?._id) && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Post Content */}
            <div className="mb-4">
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {post.content}
                </p>
                {post.image && (
                    <div className="mt-3">
                        <img
                            src={post.image}
                            alt="Post image"
                            className="w-full max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-4 mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLike}
                    className={`flex items-center space-x-2 ${isLiked
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes?.length || 0}</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleComments}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments?.length || 0}</span>
                </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    {/* Add Comment */}
                    <div className="flex space-x-3 mb-4">
                        <Avatar className="w-8 h-8 shrink-0">
                            <AvatarImage
                                src={currentUser?.photo}
                                alt={currentUser?.name}
                            />
                            <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {currentUser ? getInitials(currentUser.name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex space-x-2">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => onUpdateCommentText(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        onAddComment();
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                onClick={onAddComment}
                                disabled={!commentText?.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                        {post.comments?.map((comment) => (
                            <div key={comment._id} className="flex space-x-3">
                                <Avatar className="w-8 h-8 shrink-0">
                                    <AvatarImage
                                        src={comment.user?.photo}
                                        alt={comment.user?.name}
                                    />
                                    <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                                        {comment.user?.name
                                            ? getInitials(comment.user.name)
                                            : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                {comment.user?.name || 'Unknown User'}
                                            </span>
                                            {(currentUser?._id === comment.user?._id ||
                                                isOwnProfile) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onDeleteComment(comment._id)}
                                                        className="w-6 h-6 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                )}
                                        </div>
                                        <p className="text-gray-900 dark:text-gray-100 text-sm">
                                            {comment.comment}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span>@{comment.user?.username || 'unknown'}</span>
                                        <span>•</span>
                                        <span>{formatRelativeTime(comment.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
