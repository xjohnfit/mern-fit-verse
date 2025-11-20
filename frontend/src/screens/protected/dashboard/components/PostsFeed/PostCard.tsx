// React
import { type FC } from "react";

// Types
import { type Post } from "@/screens/protected/dashboard/dashboard.types";

// Components
import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostActions } from "./PostActions";
import { CommentSection } from "./CommentSection";

interface PostCardProps {
    post: Post;
    currentUserId: string;
    currentUserName: string;
    currentUserPhoto?: string;
    commentText: string;
    showComments: boolean;
    onLike: (postId: string) => void;
    onToggleComments: (postId: string) => void;
    onCommentTextChange: (postId: string, text: string) => void;
    onAddComment: (postId: string) => void;
    onUserClick: (username: string) => void;
    formatRelativeTime: (dateString: string) => string;
}

export const PostCard: FC<PostCardProps> = ({
    post,
    currentUserId,
    currentUserName,
    currentUserPhoto,
    commentText,
    showComments,
    onLike,
    onToggleComments,
    onCommentTextChange,
    onAddComment,
    onUserClick,
    formatRelativeTime,
}) => {
    return (
        <div className="p-6">
            <PostHeader
                user={post.user}
                createdAt={post.createdAt}
                onUserClick={onUserClick}
                formatRelativeTime={formatRelativeTime}
            />
            <PostContent content={post.content} image={post.image} />
            <PostActions
                postId={post._id}
                likes={post.likes}
                commentsCount={post.comments?.length || 0}
                currentUserId={currentUserId}
                onLike={onLike}
                onToggleComments={onToggleComments}
            />
            <CommentSection
                postId={post._id}
                comments={post.comments}
                commentText={commentText}
                currentUserName={currentUserName}
                currentUserPhoto={currentUserPhoto}
                showComments={showComments}
                onCommentTextChange={onCommentTextChange}
                onAddComment={onAddComment}
                onUserClick={onUserClick}
                formatRelativeTime={formatRelativeTime}
            />
        </div>
    );
};
