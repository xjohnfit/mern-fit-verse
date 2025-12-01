import { type FC } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, MessageCircle, MoreHorizontal, User } from 'lucide-react';
import { getInitials } from '@/lib/getInitials';
import { type UserProfile } from '@/screens/protected/profile/profile.types';

interface ProfileHeaderProps {
    user: UserProfile;
    isOwnProfile: boolean;
    isFollowing: boolean;
    isFollowLoading: boolean;
    onFollowToggle: () => void;
    onShowFollowers: () => void;
    onShowFollowing: () => void;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({
    user,
    isOwnProfile,
    isFollowing,
    isFollowLoading,
    onFollowToggle,
    onShowFollowers,
    onShowFollowing,
}) => {
    const navigate = useNavigate();

    const handleMessageClick = () => {
        navigate('/messages', {
            state: {
                selectedUser: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    photo: user.photo
                }
            }
        });
    };

    return (
        <div className="relative">
            <div className="h-64 sm:h-64 md:h-80 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700"></div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    {/* Mobile Instagram-style Layout */}
                    <div className="block sm:hidden">
                        <div className="flex items-start space-x-4">
                            {/* Profile Picture - Left */}
                            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-blue-500 dark:border-blue-400 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 shrink-0">
                                {user.photo ? (
                                    <img
                                        src={user.photo}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                            </div>

                            {/* Name, Username & Stats - Right */}
                            <div className="flex-1 text-white h-32 flex flex-col min-w-0">
                                <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-0.5 wrap-break-word line-clamp-2">
                                        {user.name}
                                    </h1>
                                    <p className="text-sm text-gray-200 mb-2 truncate">
                                        @{user.username}
                                    </p>
                                </div>

                                {/* Stats Row - Aligned to bottom */}
                                <div className="flex items-center space-x-4 mb-2">
                                    <button
                                        onClick={onShowFollowers}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <span className="font-bold text-base">
                                            {user.followers.length}
                                        </span>
                                        <span className="text-sm text-gray-200 ml-1">
                                            {user.followers.length === 1
                                                ? 'follower'
                                                : 'followers'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={onShowFollowing}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <span className="font-bold text-base">
                                            {user.following.length}
                                        </span>
                                        <span className="text-sm text-gray-200 ml-1">following</span>
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                {!isOwnProfile && (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={onFollowToggle}
                                            disabled={isFollowLoading}
                                            variant={isFollowing ? 'outline' : 'default'}
                                            className={`${isFollowing
                                                ? 'text-white border-white bg-transparent hover:bg-white/10'
                                                : ''
                                                } text-xs flex-1`}
                                            size="sm"
                                        >
                                            {isFollowLoading ? (
                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : isFollowing ? (
                                                'Following'
                                            ) : (
                                                'Follow'
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleMessageClick}
                                            variant="outline"
                                            className="text-white border-white bg-transparent hover:bg-white/10 text-xs flex-1"
                                            size="sm"
                                        >
                                            Message
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-white border-white bg-transparent hover:bg-white/10 w-8 h-8"
                                        >
                                            <MoreHorizontal className="w-3 h-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex sm:items-end sm:justify-between sm:space-x-8 sm:pt-8 md:pt-10">
                        {/* Left Section: Profile Picture + Name */}
                        <div className="flex items-end space-x-4">
                            {user.photo ? (
                                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white shadow-lg overflow-hidden hover:shadow-xl cursor-pointer transition-all duration-200 shrink-0">
                                    <img
                                        src={user.photo}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        loading="eager"
                                    />
                                </div>
                            ) : (
                                <Avatar className="w-28 h-28 md:w-40 md:h-40 border-4 border-white shadow-lg">
                                    <AvatarFallback className="text-2xl md:text-3xl font-bold bg-blue-600 text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            {/* Name, Username & Stats */}

                            {/* Name, Username & Stats */}
                            <div className="text-white pb-4 max-w-xs md:max-w-md lg:max-w-lg">
                                <h1 className="text-2xl md:text-3xl font-bold mb-1 wrap-break-word line-clamp-2">
                                    {user.name}
                                </h1>
                                <p className="text-lg text-gray-200 mb-2 truncate">@{user.username}</p>

                                {/* Stats Row */}
                                <div className="flex items-center space-x-6">
                                    <button
                                        onClick={onShowFollowers}
                                        className="text-white hover:opacity-80 transition-opacity"
                                    >
                                        <span className="font-bold">{user.followers.length}</span>
                                        <span className="text-sm text-gray-300 ml-1">
                                            {user.followers.length === 1 ? 'follower' : 'followers'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={onShowFollowing}
                                        className="text-white hover:opacity-80 transition-opacity"
                                    >
                                        <span className="font-bold">{user.following.length}</span>
                                        <span className="text-sm text-gray-300 ml-1">following</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isOwnProfile && (
                            <div className="flex gap-3 pb-4">
                                <Button
                                    onClick={onFollowToggle}
                                    disabled={isFollowLoading}
                                    variant={isFollowing ? 'outline' : 'default'}
                                    className={
                                        isFollowing
                                            ? 'text-white border-white bg-transparent hover:bg-white/10'
                                            : ''
                                    }
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
                                <Button
                                    onClick={handleMessageClick}
                                    variant="outline"
                                    className="text-white border-white bg-transparent hover:bg-white/10"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Message
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-white border-white bg-transparent hover:bg-white/10"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
