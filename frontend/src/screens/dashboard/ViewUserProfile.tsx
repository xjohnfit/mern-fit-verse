import { useParams, useNavigate } from 'react-router';
import {
    useViewUserProfileQuery,
    useFollowUnfollowUserMutation,
} from '@/slices/usersApiSlice';
import {
    useGetUserPostsQuery,
    useLikeUnlikePostMutation,
    useDeletePostMutation,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useCreatePostMutation,
} from '@/slices/postsApiSlice';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDateToMMDDYYYY } from '@/lib/formatDate';
import { toast } from 'sonner';
import {
    Calendar,
    Users,
    UserCheck,
    MessageCircle,
    MoreHorizontal,
    // MapPin,
    Cake,
    User,
    Target,
    Activity,
    Ruler,
    Weight,
    Heart,
    Send,
    Trash2,
    Clock,
    Plus,
    Image as ImageIcon,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { calculateAge } from '@/lib/calculateAge';
import { getInitials } from '@/lib/getInitials';

interface Post {
    _id: string;
    user: {
        _id: string;
        name: string;
        username: string;
        photo?: string;
    };
    content: string;
    image?: string;
    likes: string[];
    comments: Array<{
        _id: string;
        user: {
            _id: string;
            name: string;
            username: string;
            photo?: string;
        };
        comment: string;
        createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

interface UserProfile {
    _id: string;
    name: string;
    username: string;
    email: string;
    dob: string;
    gender: string;
    followers: Array<{
        _id: string;
        name: string;
        username: string;
        photo?: string;
    }>;
    following: Array<{
        _id: string;
        name: string;
        username: string;
        photo?: string;
    }>;
    height?: number;
    weight?: number;
    goal?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
}

interface RootState {
    auth: {
        userInfo: UserProfile | null;
    };
}

const ViewUserProfile = () => {
    const { username } = useParams<{ username: string; }>();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.userInfo);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [commentTexts, setCommentTexts] = useState<{ [key: string]: string; }>(
        {}
    );
    const [showComments, setShowComments] = useState<{
        [key: string]: boolean;
    }>({});
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState<string | null>(null);

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

    // Scroll to top whenever the username parameter changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, [username]);

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

    const handleFollowToggle = async () => {
        try {
            const result = await followUnfollowUser(username).unwrap();
            toast.success(result.message);
            refetch(); // Refresh the profile data to get updated followers count
        } catch (error: any) {
            toast.error(
                error?.data?.message || 'Failed to update follow status'
            );
        }
    };

    const handleUserClick = (clickedUsername: string) => {
        console.log('Navigating to user:', clickedUsername);
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

    const handleDeletePost = async (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(postId).unwrap();
                toast.success('Post deleted successfully');
                refetchPosts();
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to delete post');
            }
        }
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

    const handleDeleteComment = async (postId: string, commentId: string) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment({ postId, commentId }).unwrap();
                toast.success('Comment deleted successfully');
                refetchPosts();
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to delete comment');
            }
        }
    };

    const toggleComments = (postId: string) => {
        setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const updateCommentText = (postId: string, text: string) => {
        setCommentTexts((prev) => ({ ...prev, [postId]: text }));
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return date.toLocaleDateString();
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

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Cover Photo Section */}
            <div className='relative'>
                <div className='h-48 sm:h-64 md:h-80 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700'></div>

                {/* Profile Info Overlay */}
                <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent'>
                    <div className='max-w-6xl mx-auto px-4 py-6'>
                        {/* Mobile Instagram-style Layout */}
                        <div className='block sm:hidden mt-6 mb-4'>
                            <div className='flex items-center space-x-4'>
                                {/* Profile Picture - Left */}
                                <div className='w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-blue-500 dark:border-blue-400 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200'>
                                    {user.photo ? (
                                        <img
                                            src={user.photo}
                                            alt='Profile'
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center'>
                                            <User className='w-12 h-12 text-gray-400 dark:text-gray-500' />
                                        </div>
                                    )}
                                </div>

                                {/* Stats and Info - Right */}
                                <div className='flex-1 text-white'>
                                    <h1 className='text-xl font-bold mb-1'>
                                        {user.name}
                                    </h1>
                                    <p className='text-xs text-gray-200 mb-1 leading'>
                                        @{user.username}
                                    </p>

                                    {/* Stats Row */}
                                    <div className='flex space-x-6 mb-1'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <div className='text-md font-bold'>
                                                {user.followers.length}
                                            </div>
                                            <div className='text-xs text-gray-200'>
                                                {user.followers.length === 1
                                                    ? 'follower'
                                                    : 'followers'}
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-center gap-2'>
                                            <div className='text-md font-bold'>
                                                {user.following.length}
                                            </div>
                                            <div className='text-xs text-gray-200'>
                                                following
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {!isOwnProfile && (
                                        <div className='flex gap-2'>
                                            <Button
                                                onClick={handleFollowToggle}
                                                disabled={isFollowLoading}
                                                variant={
                                                    isFollowing
                                                        ? 'outline'
                                                        : 'default'
                                                }
                                                className={`${isFollowing
                                                        ? 'text-white border-white bg-transparent hover:bg-white/10'
                                                        : ''
                                                    } text-xs flex-1`}
                                                size='sm'>
                                                {isFollowLoading ? (
                                                    <div className='w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin' />
                                                ) : isFollowing ? (
                                                    'Following'
                                                ) : (
                                                    'Follow'
                                                )}
                                            </Button>
                                            <Button
                                                variant='outline'
                                                className='text-white border-white bg-transparent hover:bg-white/10 text-xs flex-1'
                                                size='sm'>
                                                Message
                                            </Button>
                                            <Button
                                                variant='outline'
                                                size='icon'
                                                className='text-white border-white bg-transparent hover:bg-white/10 w-8 h-8'>
                                                <MoreHorizontal className='w-3 h-3' />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className='hidden sm:flex sm:items-end sm:space-x-6'>
                            {/* Profile Picture */}
                            <Avatar className='w-28 h-28 md:w-32 md:h-32 border-4 border-white shadow-lg'>
                                <AvatarImage
                                    src={user.photo}
                                    alt={user.name}
                                />
                                <AvatarFallback className='text-2xl font-bold bg-blue-600 text-white'>
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Basic Info */}
                            <div className='flex-1 text-white pb-4'>
                                <h1 className='text-3xl md:text-4xl font-bold'>
                                    {user.name}
                                </h1>
                                <p className='text-xl text-gray-200'>
                                    @{user.username}
                                </p>
                                <div className='flex items-center space-x-6 mt-2 flex-wrap'>
                                    <span className='flex items-center space-x-2'>
                                        <Users className='w-5 h-5' />
                                        <span>
                                            {user.followers.length} followers
                                        </span>
                                    </span>
                                    <span className='flex items-center space-x-2'>
                                        <UserCheck className='w-5 h-5' />
                                        <span>
                                            {user.following.length} following
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {!isOwnProfile && (
                                <div className='flex gap-3 pb-4'>
                                    <Button
                                        onClick={handleFollowToggle}
                                        disabled={isFollowLoading}
                                        variant={
                                            isFollowing ? 'outline' : 'default'
                                        }
                                        className={
                                            isFollowing
                                                ? 'text-white border-white bg-transparent hover:bg-white/10'
                                                : ''
                                        }>
                                        {isFollowLoading ? (
                                            <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                                        ) : isFollowing ? (
                                            <>
                                                <UserCheck className='w-4 h-4 mr-2' />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <Users className='w-4 h-4 mr-2' />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='text-white border-white bg-transparent hover:bg-white/10'>
                                        <MessageCircle className='w-4 h-4 mr-2' />
                                        Message
                                    </Button>
                                    <Button
                                        variant='outline'
                                        size='icon'
                                        className='text-white border-white bg-transparent hover:bg-white/10'>
                                        <MoreHorizontal className='w-4 h-4' />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-6xl mx-auto px-4 py-4 sm:py-6 md:py-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                    {/* Left Sidebar - About */}
                    <div className='lg:col-span-1 order-2 md:order-1'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6'>
                            <h2 className='text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-gray-100'>
                                About
                            </h2>
                            <div className='space-y-3 sm:space-y-4'>
                                <div className='flex items-center space-x-3'>
                                    <Cake className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0' />
                                    <div className='min-w-0 flex-1'>
                                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100'>
                                            Age
                                        </p>
                                        <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'>
                                            {calculateAge(user.dob)} years old
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <User className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0' />
                                    <div className='min-w-0 flex-1'>
                                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100'>
                                            Gender
                                        </p>
                                        <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base capitalize'>
                                            {user.gender}
                                        </p>
                                    </div>
                                </div>

                                {user.height && (
                                    <div className='flex items-center space-x-3'>
                                        <Ruler className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0' />
                                        <div className='min-w-0 flex-1'>
                                            <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100'>
                                                Height
                                            </p>
                                            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'>
                                                {user.height} cm
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {user.weight && (
                                    <div className='flex items-center space-x-3'>
                                        <Weight className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0' />
                                        <div className='min-w-0 flex-1'>
                                            <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100'>
                                                Weight
                                            </p>
                                            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'>
                                                {user.weight} kg
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {user.goal && (
                                    <div className='flex items-center space-x-3'>
                                        <Target className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0' />
                                        <div className='min-w-0 flex-1'>
                                            <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100'>
                                                Fitness Goal
                                            </p>
                                            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base wrap-break-word'>
                                                {user.goal}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className='flex items-center space-x-3'>
                                    <Calendar className='w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0' />
                                    <div className='min-w-0 flex-1'>
                                        <p className='font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100'>
                                            Joined
                                        </p>
                                        <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base'>
                                            {formatDateToMMDDYYYY(
                                                user.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Followers Section */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
                                    Followers ({user.followers.length})
                                </h2>
                                {user.followers.length > 0 && (
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                            setShowFollowers(!showFollowers)
                                        }
                                        className='text-xs sm:text-sm'>
                                        {showFollowers ? 'Hide' : 'Show All'}
                                    </Button>
                                )}
                            </div>

                            {user.followers.length === 0 ? (
                                <p className='text-gray-500 dark:text-gray-400 text-center py-4 text-sm sm:text-base'>
                                    No followers yet
                                </p>
                            ) : (
                                <div
                                    className={`space-y-2 sm:space-y-3 ${showFollowers
                                            ? ''
                                            : 'max-h-32 sm:max-h-40 overflow-hidden'
                                        }`}>
                                    {user.followers
                                        .slice(0, showFollowers ? undefined : 3)
                                        .map((follower) => (
                                            <div
                                                key={follower._id}
                                                onClick={() =>
                                                    handleUserClick(
                                                        follower.username
                                                    )
                                                }
                                                className='flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors'>
                                                <Avatar className='w-8 h-8 sm:w-10 sm:h-10 shrink-0'>
                                                    <AvatarImage
                                                        src={follower.photo}
                                                        alt={follower.name}
                                                    />
                                                    <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs sm:text-sm'>
                                                        {getInitials(
                                                            follower.name
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-medium text-sm sm:text-base truncate text-gray-900 dark:text-gray-100'>
                                                        {follower.name}
                                                    </p>
                                                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate'>
                                                        @{follower.username}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    {!showFollowers &&
                                        user.followers.length > 3 && (
                                            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center'>
                                                +{user.followers.length - 3}{' '}
                                                more followers
                                            </p>
                                        )}
                                </div>
                            )}
                        </div>

                        {/* Following Section */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
                                    Following ({user.following.length})
                                </h2>
                                {user.following.length > 0 && (
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                            setShowFollowing(!showFollowing)
                                        }
                                        className='text-xs sm:text-sm'>
                                        {showFollowing ? 'Hide' : 'Show All'}
                                    </Button>
                                )}
                            </div>

                            {user.following.length === 0 ? (
                                <p className='text-gray-500 dark:text-gray-400 text-center py-4 text-sm sm:text-base'>
                                    Not following anyone yet
                                </p>
                            ) : (
                                <div
                                    className={`space-y-2 sm:space-y-3 ${showFollowing
                                            ? ''
                                            : 'max-h-32 sm:max-h-40 overflow-hidden'
                                        }`}>
                                    {user.following
                                        .slice(0, showFollowing ? undefined : 3)
                                        .map((followingUser) => (
                                            <div
                                                key={followingUser._id}
                                                onClick={() =>
                                                    handleUserClick(
                                                        followingUser.username
                                                    )
                                                }
                                                className='flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors'>
                                                <Avatar className='w-8 h-8 sm:w-10 sm:h-10 shrink-0'>
                                                    <AvatarImage
                                                        src={
                                                            followingUser.photo
                                                        }
                                                        alt={followingUser.name}
                                                    />
                                                    <AvatarFallback className='bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs sm:text-sm'>
                                                        {getInitials(
                                                            followingUser.name
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='font-medium text-sm sm:text-base truncate text-gray-900 dark:text-gray-100'>
                                                        {followingUser.name}
                                                    </p>
                                                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate'>
                                                        @
                                                        {followingUser.username}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    {!showFollowing &&
                                        user.following.length > 3 && (
                                            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center'>
                                                +{user.following.length - 3}{' '}
                                                more following
                                            </p>
                                        )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content - Posts */}
                    <div className='md:col-span-1 lg:col-span-2 order-1 md:order-2'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6'>
                            <div className='flex items-center justify-between mb-4 sm:mb-6'>
                                <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>
                                    Posts ({userPosts?.length || 0})
                                </h2>
                                {isOwnProfile && (
                                    <Button
                                        onClick={() =>
                                            setShowCreatePost(!showCreatePost)
                                        }
                                        className='flex items-center space-x-2'
                                        size='sm'>
                                        <Plus className='w-4 h-4' />
                                        <span className='sm:inline'>
                                            Create Post
                                        </span>
                                    </Button>
                                )}
                            </div>

                            {/* Create Post Section */}
                            {isOwnProfile && showCreatePost && (
                                <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600'>
                                    <div className='flex space-x-3'>
                                        <Avatar className='w-10 h-10 shrink-0'>
                                            <AvatarImage
                                                src={currentUser?.photo}
                                                alt={currentUser?.name}
                                            />
                                            <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'>
                                                {currentUser
                                                    ? getInitials(
                                                        currentUser.name
                                                    )
                                                    : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='flex-1'>
                                            <textarea
                                                placeholder='Share your fitness journey...'
                                                value={postContent}
                                                onChange={(e) =>
                                                    setPostContent(
                                                        e.target.value
                                                    )
                                                }
                                                className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                                                rows={3}
                                            />

                                            {postImage && (
                                                <div className='mt-3 relative'>
                                                    <img
                                                        src={postImage}
                                                        alt='Upload preview'
                                                        className='w-full max-h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700'
                                                    />
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={removeImage}
                                                        className='absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70'>
                                                        <X className='w-4 h-4' />
                                                    </Button>
                                                </div>
                                            )}

                                            <div className='flex items-center justify-between mt-3'>
                                                <label className='flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'>
                                                    <ImageIcon className='w-5 h-5' />
                                                    <span>Add Photo</span>
                                                    <input
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={
                                                            handleImageUpload
                                                        }
                                                        className='hidden'
                                                    />
                                                </label>
                                                <div className='flex space-x-2'>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() => {
                                                            setShowCreatePost(
                                                                false
                                                            );
                                                            setPostContent('');
                                                            setPostImage(null);
                                                        }}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size='sm'
                                                        onClick={
                                                            handleCreatePost
                                                        }
                                                        disabled={
                                                            !postContent.trim() &&
                                                            !postImage
                                                        }>
                                                        Post
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isPostsLoading ? (
                                <div className='text-center py-8'>
                                    <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                                    <p className='text-gray-600 dark:text-gray-400'>
                                        Loading posts...
                                    </p>
                                </div>
                            ) : postsError ||
                                !userPosts ||
                                userPosts.length === 0 ? (
                                <div className='text-center py-8 sm:py-12'>
                                    <Activity className='w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4' />
                                    <h3 className='text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                                        No Posts Yet
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4'>
                                        {isOwnProfile
                                            ? 'Share your fitness journey by creating your first post!'
                                            : `${user.name} hasn't shared any posts yet.`}
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-6'>
                                    {userPosts
                                        .filter(
                                            (post: Post) =>
                                                post && post._id && post.user
                                        )
                                        .map((post: Post) => (
                                            <div
                                                key={post._id}
                                                className='border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0'>
                                                {/* Post Header */}
                                                <div className='flex items-center justify-between mb-3'>
                                                    <div className='flex items-center space-x-3'>
                                                        <Avatar className='w-10 h-10'>
                                                            <AvatarImage
                                                                src={
                                                                    post.user
                                                                        ?.photo
                                                                }
                                                                alt={
                                                                    post.user
                                                                        ?.name
                                                                }
                                                            />
                                                            <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'>
                                                                {post.user?.name
                                                                    ? getInitials(
                                                                        post
                                                                            .user
                                                                            .name
                                                                    )
                                                                    : 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className='font-medium text-gray-900 dark:text-gray-100'>
                                                                {post.user
                                                                    ?.name ||
                                                                    'Unknown User'}
                                                            </p>
                                                            <div className='flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400'>
                                                                <span>
                                                                    @
                                                                    {post.user
                                                                        ?.username ||
                                                                        'unknown'}
                                                                </span>
                                                                <span>•</span>
                                                                <div className='flex items-center space-x-1'>
                                                                    <Clock className='w-3 h-3' />
                                                                    <span>
                                                                        {formatRelativeTime(
                                                                            post.createdAt
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {(isOwnProfile ||
                                                        currentUser?._id ===
                                                        post.user?._id) && (
                                                            <Button
                                                                variant='ghost'
                                                                size='icon'
                                                                onClick={() =>
                                                                    handleDeletePost(
                                                                        post._id
                                                                    )
                                                                }
                                                                className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'>
                                                                <Trash2 className='w-4 h-4' />
                                                            </Button>
                                                        )}
                                                </div>

                                                {/* Post Content */}
                                                <div className='mb-4'>
                                                    <p className='text-gray-900 dark:text-gray-100 whitespace-pre-wrap'>
                                                        {post.content}
                                                    </p>
                                                    {post.image && (
                                                        <div className='mt-3'>
                                                            <img
                                                                src={post.image}
                                                                alt='Post image'
                                                                className='w-full max-h-96 object-cover rounded-lg border border-gray-200 dark:border-gray-700'
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Post Actions */}
                                                <div className='flex items-center space-x-4 mb-4'>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() =>
                                                            handleLikePost(
                                                                post._id
                                                            )
                                                        }
                                                        className={`flex items-center space-x-2 ${post.likes?.includes(
                                                            currentUser?._id ||
                                                            ''
                                                        ) || false
                                                                ? 'text-red-500 hover:text-red-600'
                                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                            }`}>
                                                        <Heart
                                                            className={`w-4 h-4 ${post.likes?.includes(
                                                                currentUser?._id ||
                                                                ''
                                                            )
                                                                    ? 'fill-current'
                                                                    : ''
                                                                }`}
                                                        />
                                                        <span>
                                                            {post.likes
                                                                ?.length || 0}
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() =>
                                                            toggleComments(
                                                                post._id
                                                            )
                                                        }
                                                        className='flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'>
                                                        <MessageCircle className='w-4 h-4' />
                                                        <span>
                                                            {post.comments
                                                                ?.length || 0}
                                                        </span>
                                                    </Button>
                                                </div>

                                                {/* Comments Section */}
                                                {showComments[post._id] && (
                                                    <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                                                        {/* Add Comment */}
                                                        <div className='flex space-x-3 mb-4'>
                                                            <Avatar className='w-8 h-8 shrink-0'>
                                                                <AvatarImage
                                                                    src={
                                                                        currentUser?.photo
                                                                    }
                                                                    alt={
                                                                        currentUser?.name
                                                                    }
                                                                />
                                                                <AvatarFallback className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
                                                                    {currentUser
                                                                        ? getInitials(
                                                                            currentUser.name
                                                                        )
                                                                        : 'U'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className='flex-1 flex space-x-2'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='Add a comment...'
                                                                    value={
                                                                        commentTexts[
                                                                        post
                                                                            ._id
                                                                        ] || ''
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateCommentText(
                                                                            post._id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
                                                                    onKeyPress={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            'Enter'
                                                                        ) {
                                                                            handleAddComment(
                                                                                post._id
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                <Button
                                                                    size='sm'
                                                                    onClick={() =>
                                                                        handleAddComment(
                                                                            post._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !commentTexts[
                                                                            post
                                                                                ._id
                                                                        ]?.trim()
                                                                    }>
                                                                    <Send className='w-4 h-4' />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Comments List */}
                                                        <div className='space-y-3'>
                                                            {post.comments?.map(
                                                                (comment) => (
                                                                    <div
                                                                        key={
                                                                            comment._id
                                                                        }
                                                                        className='flex space-x-3'>
                                                                        <Avatar className='w-8 h-8 shrink-0'>
                                                                            <AvatarImage
                                                                                src={
                                                                                    comment
                                                                                        .user
                                                                                        ?.photo
                                                                                }
                                                                                alt={
                                                                                    comment
                                                                                        .user
                                                                                        ?.name
                                                                                }
                                                                            />
                                                                            <AvatarFallback className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs'>
                                                                                {comment
                                                                                    .user
                                                                                    ?.name
                                                                                    ? getInitials(
                                                                                        comment
                                                                                            .user
                                                                                            .name
                                                                                    )
                                                                                    : 'U'}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className='flex-1'>
                                                                            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2'>
                                                                                <div className='flex items-center justify-between mb-1'>
                                                                                    <span className='font-medium text-sm text-gray-900 dark:text-gray-100'>
                                                                                        {comment
                                                                                            .user
                                                                                            ?.name ||
                                                                                            'Unknown User'}
                                                                                    </span>
                                                                                    {(currentUser?._id ===
                                                                                        comment
                                                                                            .user
                                                                                            ?._id ||
                                                                                        isOwnProfile) && (
                                                                                            <Button
                                                                                                variant='ghost'
                                                                                                size='icon'
                                                                                                onClick={() =>
                                                                                                    handleDeleteComment(
                                                                                                        post._id,
                                                                                                        comment._id
                                                                                                    )
                                                                                                }
                                                                                                className='w-6 h-6 text-red-500 hover:text-red-700'>
                                                                                                <Trash2 className='w-3 h-3' />
                                                                                            </Button>
                                                                                        )}
                                                                                </div>
                                                                                <p className='text-gray-900 dark:text-gray-100 text-sm'>
                                                                                    {
                                                                                        comment.comment
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            <div className='flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400'>
                                                                                <span>
                                                                                    @
                                                                                    {comment
                                                                                        .user
                                                                                        ?.username ||
                                                                                        'unknown'}
                                                                                </span>
                                                                                <span>
                                                                                    •
                                                                                </span>
                                                                                <span>
                                                                                    {formatRelativeTime(
                                                                                        comment.createdAt
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUserProfile;
