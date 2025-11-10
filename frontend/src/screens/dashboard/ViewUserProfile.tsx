import { useParams, useNavigate } from 'react-router';
import { useViewUserProfileQuery, useFollowUnfollowUserMutation } from '@/slices/usersApiSlice';
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
    Weight
} from 'lucide-react';
import { useState } from 'react';

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

    const {
        data: userProfile,
        isLoading,
        error,
        refetch
    } = useViewUserProfileQuery(username, {
        skip: !username
    });

    const [followUnfollowUser, { isLoading: isFollowLoading }] = useFollowUnfollowUserMutation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !userProfile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <User className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">User Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400">The user you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const user = userProfile as UserProfile;
    const isOwnProfile = currentUser?._id === user._id;
    const isFollowing = user.followers.some(follower => follower._id === currentUser?._id);

    const handleFollowToggle = async () => {
        try {
            const result = await followUnfollowUser(username).unwrap();
            toast.success(result.message);
            refetch(); // Refresh the profile data to get updated followers count
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update follow status');
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleUserClick = (clickedUsername: string) => {
        navigate(`/profile/view/${clickedUsername}`);
        //Scroll to top after navigation
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Cover Photo Section */}
            <div className="relative">
                <div className="h-48 sm:h-64 md:h-80 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700"></div>

                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        {/* Mobile Instagram-style Layout */}
                        <div className="block sm:hidden mt-6 mb-4">
                            <div className="flex items-center space-x-4">
                                {/* Profile Picture - Left */}
                                <Avatar className="w-28 h-28 border-3 border-white shadow-lg shrink-0">
                                    <AvatarImage src={user.photo} alt={user.name} />
                                    <AvatarFallback className="text-lg font-bold bg-blue-600 text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Stats and Info - Right */}
                                <div className="flex-1 text-white">
                                    <h1 className="text-xl font-bold mb-1">{user.name}</h1>
                                    <p className="text-xs text-gray-200 mb-1 leading">@{user.username}</p>

                                    {/* Stats Row */}
                                    <div className="flex space-x-6 mb-1">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="text-md font-bold">{user.followers.length}</div>
                                            <div className="text-xs text-gray-200">{user.followers.length === 1 ? "follower" : "followers"}</div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="text-md font-bold">{user.following.length}</div>
                                            <div className="text-xs text-gray-200">following</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {!isOwnProfile && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleFollowToggle}
                                                disabled={isFollowLoading}
                                                variant={isFollowing ? "outline" : "default"}
                                                className={`${isFollowing ? "text-white border-white bg-transparent hover:bg-white/10" : ""} text-xs flex-1`}
                                                size="sm"
                                            >
                                                {isFollowLoading ? (
                                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                ) : isFollowing ? (
                                                    "Following"
                                                ) : (
                                                    "Follow"
                                                )}
                                            </Button>
                                            <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white/10 text-xs flex-1" size="sm">
                                                Message
                                            </Button>
                                            <Button variant="outline" size="icon" className="text-white border-white bg-transparent hover:bg-white/10 w-8 h-8">
                                                <MoreHorizontal className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex sm:items-end sm:space-x-6">
                            {/* Profile Picture */}
                            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-4 border-white shadow-lg">
                                <AvatarImage src={user.photo} alt={user.name} />
                                <AvatarFallback className="text-2xl font-bold bg-blue-600 text-white">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Basic Info */}
                            <div className="flex-1 text-white pb-4">
                                <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
                                <p className="text-xl text-gray-200">@{user.username}</p>
                                <div className="flex items-center space-x-6 mt-2 flex-wrap">
                                    <span className="flex items-center space-x-2">
                                        <Users className="w-5 h-5" />
                                        <span>{user.followers.length} followers</span>
                                    </span>
                                    <span className="flex items-center space-x-2">
                                        <UserCheck className="w-5 h-5" />
                                        <span>{user.following.length} following</span>
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {!isOwnProfile && (
                                <div className="flex gap-3 pb-4">
                                    <Button
                                        onClick={handleFollowToggle}
                                        disabled={isFollowLoading}
                                        variant={isFollowing ? "outline" : "default"}
                                        className={isFollowing ? "text-white border-white bg-transparent hover:bg-white/10" : ""}
                                    >
                                        {isFollowLoading ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : isFollowing ? (
                                            <>
                                                <UserCheck className="w-4 h-4 mr-2" />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <Users className="w-4 h-4 mr-2" />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white/10">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Message
                                    </Button>
                                    <Button variant="outline" size="icon" className="text-white border-white bg-transparent hover:bg-white/10">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 md:py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Sidebar - About */}
                    <div className="lg:col-span-1 order-2 md:order-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">About</h2>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Cake className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Age</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{calculateAge(user.dob)} years old</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Gender</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base capitalize">{user.gender}</p>
                                    </div>
                                </div>

                                {user.height && (
                                    <div className="flex items-center space-x-3">
                                        <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Height</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{user.height} cm</p>
                                        </div>
                                    </div>
                                )}

                                {user.weight && (
                                    <div className="flex items-center space-x-3">
                                        <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Weight</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{user.weight} kg</p>
                                        </div>
                                    </div>
                                )}

                                {user.goal && (
                                    <div className="flex items-center space-x-3">
                                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Fitness Goal</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base wrap-break-word">{user.goal}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">Joined</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{formatDateToMMDDYYYY(user.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Followers Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Followers ({user.followers.length})</h2>
                                {user.followers.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFollowers(!showFollowers)}
                                        className="text-xs sm:text-sm"
                                    >
                                        {showFollowers ? 'Hide' : 'Show All'}
                                    </Button>
                                )}
                            </div>

                            {user.followers.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm sm:text-base">No followers yet</p>
                            ) : (
                                <div className={`space-y-2 sm:space-y-3 ${showFollowers ? '' : 'max-h-32 sm:max-h-40 overflow-hidden'}`}>
                                    {user.followers.slice(0, showFollowers ? undefined : 3).map((follower) => (
                                        <div
                                            key={follower._id}
                                            className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => handleUserClick(follower.username)}
                                        >
                                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                                                <AvatarImage src={follower.photo} alt={follower.name} />
                                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs sm:text-sm">
                                                    {getInitials(follower.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm sm:text-base truncate text-gray-900 dark:text-gray-100">{follower.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">@{follower.username}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {!showFollowers && user.followers.length > 3 && (
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                                            +{user.followers.length - 3} more followers
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Following Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Following ({user.following.length})</h2>
                                {user.following.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFollowing(!showFollowing)}
                                        className="text-xs sm:text-sm"
                                    >
                                        {showFollowing ? 'Hide' : 'Show All'}
                                    </Button>
                                )}
                            </div>

                            {user.following.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm sm:text-base">Not following anyone yet</p>
                            ) : (
                                <div className={`space-y-2 sm:space-y-3 ${showFollowing ? '' : 'max-h-32 sm:max-h-40 overflow-hidden'}`}>
                                    {user.following.slice(0, showFollowing ? undefined : 3).map((followingUser) => (
                                        <div
                                            key={followingUser._id}
                                            className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors"
                                            onClick={() => handleUserClick(followingUser.username)}
                                        >
                                            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                                                <AvatarImage src={followingUser.photo} alt={followingUser.name} />
                                                <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs sm:text-sm">
                                                    {getInitials(followingUser.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm sm:text-base truncate text-gray-900 dark:text-gray-100">{followingUser.name}</p>
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">@{followingUser.username}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {!showFollowing && user.following.length > 3 && (
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                                            +{user.following.length - 3} more following
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content - Activity Feed */}
                    <div className="md:col-span-1 lg:col-span-2 order-1 md:order-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Activity Feed</h2>

                            {/* Placeholder for future activity feed */}
                            <div className="text-center py-8 sm:py-12">
                                <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Activity Yet</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4">
                                    {isOwnProfile
                                        ? "Start your fitness journey to see your activity here!"
                                        : `${user.name} hasn't shared any activity yet.`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUserProfile;