import { type FC } from 'react';
import { Activity } from 'lucide-react';
import { PostCard } from './PostCard';
import { type Post, type UserProfile } from '../types';

interface PostsListProps {
    posts: Post[] | undefined;
    isLoading: boolean;
    error: any;
    isOwnProfile: boolean;
    currentUser: UserProfile | null;
    userName: string;
    commentTexts: { [key: string]: string; };
    showComments: { [key: string]: boolean; };
    onLikePost: (postId: string) => void;
    onDeletePost: (postId: string) => void;
    onToggleComments: (postId: string) => void;
    onUpdateCommentText: (postId: string, text: string) => void;
    onAddComment: (postId: string) => void;
    onDeleteComment: (postId: string, commentId: string) => void;
}

export const PostsList: FC<PostsListProps> = ({
    posts,
    isLoading,
    error,
    isOwnProfile,
    currentUser,
    userName,
    commentTexts,
    showComments,
    onLikePost,
    onDeletePost,
    onToggleComments,
    onUpdateCommentText,
    onAddComment,
    onDeleteComment,
}) => {
    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
            </div>
        );
    }

    if (error || !posts || posts.length === 0) {
        return (
            <div className="text-center py-8 sm:py-12">
                <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No Posts Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4">
                    {isOwnProfile
                        ? 'Share your fitness journey by creating your first post!'
                        : `${userName} hasn't shared any posts yet.`}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts
                .filter((post: Post) => post && post._id && post.user)
                .map((post: Post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        currentUser={currentUser}
                        isOwnProfile={isOwnProfile}
                        commentText={commentTexts[post._id] || ''}
                        showComments={showComments[post._id] || false}
                        onLike={() => onLikePost(post._id)}
                        onDelete={() => onDeletePost(post._id)}
                        onToggleComments={() => onToggleComments(post._id)}
                        onUpdateCommentText={(text) =>
                            onUpdateCommentText(post._id, text)
                        }
                        onAddComment={() => onAddComment(post._id)}
                        onDeleteComment={(commentId) =>
                            onDeleteComment(post._id, commentId)
                        }
                    />
                ))}
        </div>
    );
};
