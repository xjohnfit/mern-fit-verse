// React & Router
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import AlertModal from '@/components/modals/AlertModal';

// API Slices
import {
    useViewUserProfileQuery,
    useFollowUnfollowUserMutation,
    useGetSuggestedUsersQuery,
} from '@/slices/usersApiSlice';
import {
    useGetUserPostsQuery,
    useLikeUnlikePostMutation,
    useDeletePostMutation,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useCreatePostMutation,
} from '@/slices/postsApiSlice';

// Components
import {
    ProfileHeader,
    PersonalInfoCard,
    FitnessInfoCard,
    PostsList,
    FollowersFollowingModal
} from './components';
import { SuggestedUsersList } from '@/screens/protected/dashboard/components/SuggestedUsersList';

// UI Components
import { User, Plus, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Utilities
import { toast } from 'sonner';
import { getInitials } from '@/lib/getInitials';

// Types
import { type RootState, type UserProfile } from './profile.types';

const ViewUserProfile = () => {
    const { username } = useParams<{ username: string; }>();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.userInfo);
    const [commentTexts, setCommentTexts] = useState<{ [key: string]: string; }>(
        {}
    );
    const [showComments, setShowComments] = useState<{
        [key: string]: boolean;
    }>({});
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState<string | null>(null);
    const [deletePostId, setDeletePostId] = useState<string | null>(null);
    const [deleteCommentInfo, setDeleteCommentInfo] = useState<{ postId: string; commentId: string; } | null>(null);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    const {
        data: userProfile,
        isLoading,
        error,
        refetch,
    } = useViewUserProfileQuery(username, {
        skip: !username,
    });

    const {
        data: userPosts,
        isLoading: isPostsLoading,
        error: postsError,
        refetch: refetchPosts,
    } = useGetUserPostsQuery(username, {
        skip: !username,
    });

    const [followUnfollowUser, { isLoading: isFollowLoading }] =
        useFollowUnfollowUserMutation();
    const [likeUnlikePost] = useLikeUnlikePostMutation();
    const [deletePost] = useDeletePostMutation();
    const [addComment] = useAddCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [createPost] = useCreatePostMutation();

    // Get suggested users
    const {
        data: suggestedUsers,
        isLoading: isSuggestedUsersLoading,
    } = useGetSuggestedUsersQuery({});

    // Handler functions
    const handleFollowToggle = async () => {
        try {
            const result = await followUnfollowUser(username).unwrap();
            toast.success(result.message);
            refetch();
        } catch (error: any) {
            toast.error(
                error?.data?.message || 'Failed to update follow status'
            );
        }
    };

    const handleFollowSuggestedUser = async (suggestedUsername: string) => {
        try {
            const result = await followUnfollowUser(suggestedUsername).unwrap();
            toast.success(result.message);
        } catch (error: any) {
            toast.error(
                error?.data?.message || 'Failed to follow user'
            );
        }
    };

    const handleUserClick = (clickedUsername: string) => {
        navigate(`/profile/view/${clickedUsername}`);
    };

    const handleLikePost = async (postId: string) => {
        try {
            const result = await likeUnlikePost(postId).unwrap();
            toast.success(result.message || 'Post liked/unliked successfully');
            refetchPosts();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to like post');
        }
    };

    const handleDeletePost = (postId: string) => {
        setDeletePostId(postId);
    };

    const confirmDeletePost = async () => {
        if (!deletePostId) return;
        try {
            await deletePost(deletePostId).unwrap();
            toast.success('Post deleted successfully');
            refetchPosts();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete post');
        }
        setDeletePostId(null);
    };

    const handleAddComment = async (postId: string) => {
        const comment = commentTexts[postId]?.trim();
        if (!comment) return;

        try {
            const result = await addComment({ postId, comment }).unwrap();
            setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
            toast.success(result.message || 'Comment added successfully');
            refetchPosts();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to add comment');
        }
    };

    const handleDeleteComment = (postId: string, commentId: string) => {
        setDeleteCommentInfo({ postId, commentId });
    };

    const confirmDeleteComment = async () => {
        if (!deleteCommentInfo) return;
        try {
            await deleteComment(deleteCommentInfo).unwrap();
            toast.success('Comment deleted successfully');
            refetchPosts();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete comment');
        }
        setDeleteCommentInfo(null);
    };

    const toggleComments = (postId: string) => {
        setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const updateCommentText = (postId: string, text: string) => {
        setCommentTexts((prev) => ({ ...prev, [postId]: text }));
    };

    const handleCreatePost = async () => {
        if (!postContent.trim() && !postImage) {
            toast.error('Please add some content or an image to your post');
            return;
        }

        try {
            const postData = {
                content: postContent,
                ...(postImage && { image: postImage }),
            };

            await createPost(postData).unwrap();
            toast.success('Post created successfully!');
            setPostContent('');
            setPostImage(null);
            setShowCreatePost(false);
            refetchPosts();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to create post');
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPostImage(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !userProfile) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <User className='w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4' />
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                        User Not Found
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400'>
                        The user you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    const user = userProfile as UserProfile;
    const isOwnProfile = currentUser?._id === user._id;
    const isFollowing = user.followers.some(
        (follower) => follower._id === currentUser?._id
    );

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Profile Header with Cover Photo */}
            <ProfileHeader
                user={user}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                isFollowLoading={isFollowLoading}
                onFollowToggle={handleFollowToggle}
                onShowFollowers={() => setShowFollowersModal(true)}
                onShowFollowing={() => setShowFollowingModal(true)}
            />

            {/* Main Content */}
            <div className='max-w-7xl mx-auto px-4 py-4 sm:py-6 md:py-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
                    {/* Left Sidebar - About Cards */}
                    <div className='xl:col-span-3 order-2 md:order-1'>
                        <PersonalInfoCard user={user} />
                        <FitnessInfoCard user={user} />
                    </div>

                    {/* Right Content - Posts */}
                    <div className='md:col-span-1 xl:col-span-6 order-1 md:order-2'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
                                    Posts ({userPosts?.length || 0})
                                </h2>
                                {isOwnProfile && (
                                    <Button
                                        onClick={() => setShowCreatePost(!showCreatePost)}
                                        className="flex items-center space-x-2"
                                        size="sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="sm:inline">Create Post</span>
                                    </Button>
                                )}
                            </div>

                            {isOwnProfile && showCreatePost && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4 mb-6 border border-gray-200 dark:border-gray-600">
                                    <div className="flex space-x-3">
                                        <Avatar className="w-10 h-10 shrink-0">
                                            <AvatarImage
                                                src={currentUser?.photo}
                                                alt={currentUser?.name}
                                            />
                                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                                {currentUser ? getInitials(currentUser.name) : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <textarea
                                                placeholder="Share your fitness journey..."
                                                value={postContent}
                                                onChange={(e) => setPostContent(e.target.value)}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                rows={3}
                                            />

                                            {postImage && (
                                                <div className="mt-3 relative">
                                                    <img
                                                        src={postImage}
                                                        alt="Upload preview"
                                                        className="w-full max-h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={removeImage}
                                                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-3">
                                                <label className="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                                    <ImageIcon className="w-5 h-5" />
                                                    <span>Add Photo</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.heic,.heif"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShowCreatePost(false);
                                                            setPostContent('');
                                                            removeImage();
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleCreatePost}
                                                        disabled={!postContent.trim() && !postImage}
                                                    >
                                                        Post
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={isOwnProfile && showCreatePost ? '' : 'mt-4 sm:mt-6'}>
                                <PostsList
                                    posts={userPosts}
                                    isLoading={isPostsLoading}
                                    error={postsError}
                                    isOwnProfile={isOwnProfile}
                                    currentUser={currentUser}
                                    userName={user.name}
                                    commentTexts={commentTexts}
                                    showComments={showComments}
                                    onLikePost={handleLikePost}
                                    onDeletePost={handleDeletePost}
                                    onToggleComments={toggleComments}
                                    onUpdateCommentText={updateCommentText}
                                    onAddComment={handleAddComment}
                                    onDeleteComment={handleDeleteComment}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Third Column - Suggested Users (Desktop Only) */}
                    <div className='hidden xl:block xl:col-span-3 order-3'>
                        <SuggestedUsersList
                            suggestedUsers={suggestedUsers}
                            isLoading={isSuggestedUsersLoading}
                            onFollow={handleFollowSuggestedUser}
                            onUserClick={handleUserClick}
                        />
                    </div>
                </div>
            </div>

            {/* Followers Modal */}
            <FollowersFollowingModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                type='followers'
                users={user.followers}
                title='Followers'
            />

            {/* Following Modal */}
            <FollowersFollowingModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                type='following'
                users={user.following}
                title='Following'
            />

            {/* Delete Post Confirmation Modal */}
            <AlertModal
                isOpen={deletePostId !== null}
                onClose={() => setDeletePostId(null)}
                onConfirm={confirmDeletePost}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />

            {/* Delete Comment Confirmation Modal */}
            <AlertModal
                isOpen={deleteCommentInfo !== null}
                onClose={() => setDeleteCommentInfo(null)}
                onConfirm={confirmDeleteComment}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
};

export default ViewUserProfile;
