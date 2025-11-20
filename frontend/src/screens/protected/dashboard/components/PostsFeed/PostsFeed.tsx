// React
import { type FC } from "react";

// Types
import { type Post } from "@/screens/protected/dashboard/types";

// Components
import { PostCard } from "./PostCard";
import { EmptyPosts } from "@/screens/protected/dashboard/components/EmptyStates/EmptyPosts";

interface PostsFeedProps {
    posts: Post[] | undefined;
    isLoading: boolean;
    currentUserId: string;
    currentUserName: string;
    currentUserPhoto?: string;
    commentTexts: { [key: string]: string; };
    showComments: { [key: string]: boolean; };
    onLike: (postId: string) => void;
    onToggleComments: (postId: string) => void;
    onCommentTextChange: (postId: string, text: string) => void;
    onAddComment: (postId: string) => void;
    onUserClick: (username: string) => void;
    formatRelativeTime: (dateString: string) => string;
}

export const PostsFeed: FC<PostsFeedProps> = ({
    posts,
    isLoading,
    currentUserId,
    currentUserName,
    currentUserPhoto,
    commentTexts,
    showComments,
    onLike,
    onToggleComments,
    onCommentTextChange,
    onAddComment,
    onUserClick,
    formatRelativeTime,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Your Feed
                </h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                    </div>
                ) : !posts || posts.length === 0 ? (
                    <EmptyPosts />
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            currentUserId={currentUserId}
                            currentUserName={currentUserName}
                            currentUserPhoto={currentUserPhoto}
                            commentText={commentTexts[post._id] || ""}
                            showComments={showComments[post._id] || false}
                            onLike={onLike}
                            onToggleComments={onToggleComments}
                            onCommentTextChange={onCommentTextChange}
                            onAddComment={onAddComment}
                            onUserClick={onUserClick}
                            formatRelativeTime={formatRelativeTime}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
