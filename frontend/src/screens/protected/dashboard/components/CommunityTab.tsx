// Components
import { SuggestedUsersList, PostsFeed, MessagesSection } from './';

interface CommunityTabProps {
    suggestedUsers: any;
    isLoadingSuggested: boolean;
    currentUserProfile: any;
    isLoadingProfile: boolean;
    feedPosts: any;
    isLoadingPosts: boolean;
    userInfo: any;
    commentTexts: { [key: string]: string; };
    showComments: { [key: string]: boolean; };
    onFollow: (username: string) => void;
    onUserClick: (username: string) => void;
    onLike: (postId: string) => void;
    onToggleComments: (postId: string) => void;
    onCommentTextChange: (postId: string, text: string) => void;
    onAddComment: (postId: string) => void;
    formatRelativeTime: (dateString: string) => string;
}

export const CommunityTab = ({
    suggestedUsers,
    isLoadingSuggested,
    currentUserProfile,
    isLoadingProfile,
    feedPosts,
    isLoadingPosts,
    userInfo,
    commentTexts,
    showComments,
    onFollow,
    onUserClick,
    onLike,
    onToggleComments,
    onCommentTextChange,
    onAddComment,
    formatRelativeTime,
}: CommunityTabProps) => {
    return (
        <div className='space-y-6'>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                Community
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Left Column: Suggested Users and Feed */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Suggested Users */}
                    <SuggestedUsersList
                        suggestedUsers={suggestedUsers}
                        isLoading={isLoadingSuggested}
                        onFollow={onFollow}
                        onUserClick={onUserClick}
                    />

                    {/* Community Posts Feed */}
                    <PostsFeed
                        posts={feedPosts}
                        isLoading={isLoadingPosts}
                        currentUserId={userInfo?._id || ''}
                        currentUserName={userInfo?.name || 'User'}
                        currentUserPhoto={userInfo?.photo}
                        commentTexts={commentTexts}
                        showComments={showComments}
                        onLike={onLike}
                        onToggleComments={onToggleComments}
                        onCommentTextChange={onCommentTextChange}
                        onAddComment={onAddComment}
                        onUserClick={onUserClick}
                        formatRelativeTime={formatRelativeTime}
                    />
                </div>

                {/* Right Column: Messages Section */}
                <div className='lg:col-span-1'>
                    <MessagesSection
                        followedUsers={currentUserProfile?.following}
                        isLoading={isLoadingProfile}
                        onUserClick={onUserClick}
                    />
                </div>
            </div>
        </div>
    );
};
