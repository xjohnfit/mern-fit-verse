import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Users,
    UserCheck,
    MessageCircle,
    MoreHorizontal,
    Cake,
    User as UserIcon,
    Calendar,
    Ruler,
    Weight,
    Target,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getInitials } from '../../lib/getInitials';
import { calculateAge } from '../../lib/calculateAge';
import { formatDateToMMDDYYYY } from '../../lib/formatDate';
import { UserProfile } from '../../types/profile.types';

interface ProfileHeaderProps {
    user: UserProfile;
    isOwnProfile: boolean;
    isFollowing: boolean;
    isFollowLoading: boolean;
    onFollowToggle: () => void;
    onShowFollowers: () => void;
    onShowFollowing: () => void;
    onBackPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    isOwnProfile,
    isFollowing,
    isFollowLoading,
    onFollowToggle,
    onShowFollowers,
    onShowFollowing,
    onBackPress,
}) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleMessageClick = () => {
        console.log('Navigate to messages with user:', user.username);
    };

    // Safety check for user data
    if (!user || !user.name) {
        return null;
    }

    return (
        <View className='bg-white dark:bg-gray-900'>
            {/* Compact Gradient Header */}
            <LinearGradient
                colors={['#3b82f6', '#8b5cf6', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: insets.top + 20,
                    paddingBottom: 24,
                    paddingHorizontal: 16,
                }}>
                {/* Name and Username centered */}
                <View className='items-center mb-4'>
                    <View className='flex-row items-center justify-center mb-1 gap-2'>
                        {/* Back Button - Only show when not own profile */}
                        {!isOwnProfile && onBackPress && (
                            <TouchableOpacity
                                onPress={onBackPress}
                                className='w-10 h-10 rounded-full bg-white/20 items-center justify-center'
                            >
                                <Ionicons
                                    name='arrow-back'
                                    color='#fff'
                                    size={24}
                                />
                            </TouchableOpacity>
                        )}
                        <Text
                            style={{
                                color: '#ffffff',
                                fontSize: 30,
                                fontWeight: 'bold',
                            }}
                            numberOfLines={1}>
                            {user.name}
                        </Text>
                        {/* More Options Button */}
                        {!isOwnProfile && (
                            <TouchableOpacity className='w-10 h-10 rounded-full bg-white/20 items-center justify-center'>
                                <MoreHorizontal
                                    color='#fff'
                                    size={20}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text
                        style={{
                            color: '#ffffff',
                            fontSize: 14,
                            opacity: 0.9,
                        }}
                        numberOfLines={1}>
                        @{user.username}
                    </Text>
                </View>

                {/* Personal Info Chips */}
                <View className='flex-row flex-wrap justify-center mb-4'>
                    {/* Age */}
                    <View className='flex-row items-center bg-white/20 rounded-full px-3 py-1.5 mr-2 mb-2'>
                        <Cake
                            color='#fff'
                            size={14}
                        />
                        <Text className='ml-1.5 text-xs font-medium text-white'>
                            {calculateAge(user.dob)} years
                        </Text>
                    </View>

                    {/* Gender */}
                    <View className='flex-row items-center bg-white/20 rounded-full px-3 py-1.5 mr-2 mb-2'>
                        <UserIcon
                            color='#fff'
                            size={14}
                        />
                        <Text className='ml-1.5 text-xs font-medium text-white capitalize'>
                            {user.gender}
                        </Text>
                    </View>

                    {/* Joined Date */}
                    <View className='flex-row items-center bg-white/20 rounded-full px-3 py-1.5 mb-2'>
                        <Calendar
                            color='#fff'
                            size={14}
                        />
                        <Text className='ml-1.5 text-xs font-medium text-white'>
                            Joined {formatDateToMMDDYYYY(user.createdAt)}
                        </Text>
                    </View>
                </View>

                {/* Fitness Info Chips */}
                <View className='flex-row flex-wrap justify-center mb-4'>
                    {/* Height */}
                    {user.height && (
                        <View className='flex-row items-center bg-white/20 rounded-full px-3 py-1.5 mr-2 mb-2'>
                            <Ruler
                                color='#fff'
                                size={14}
                            />
                            <Text className='ml-1.5 text-xs font-medium text-white'>
                                {user.height} cm
                            </Text>
                        </View>
                    )}

                    {/* Weight */}
                    {user.weight && (
                        <View className='flex-row items-center bg-white/20 rounded-full px-3 py-1.5 mb-2'>
                            <Weight
                                color='#fff'
                                size={14}
                            />
                            <Text className='ml-1.5 text-xs font-medium text-white'>
                                {user.weight} {user.weightUnit || 'kg'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Fitness Goal */}
                {user.goal && (
                    <View className='bg-white/20 rounded-2xl p-3 mb-4'>
                        <View className='flex-row items-center mb-1.5'>
                            <Target
                                color='#fff'
                                size={16}
                            />
                            <Text className='ml-2 text-xs font-bold text-white'>
                                Fitness Goal
                            </Text>
                        </View>
                        <Text className='text-xs text-white/95 leading-relaxed'>
                            {user.goal}
                        </Text>
                    </View>
                )}

                {/* Stats in Gradient */}
                <View className='flex-row items-center justify-center'>
                    <TouchableOpacity
                        onPress={onShowFollowers}
                        className='flex-1 items-center border-r border-white/30 pr-4'>
                        <Text className='text-2xl font-bold text-white'>
                            {user.followers.length}
                        </Text>
                        <Text className='text-xs text-white/90 mt-0.5'>
                            Followers
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onShowFollowing}
                        className='flex-1 items-center pl-4'>
                        <Text className='text-2xl font-bold text-white'>
                            {user.following.length}
                        </Text>
                        <Text className='text-xs text-white/90 mt-0.5'>
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Profile Picture Overlay */}
            <View className='-mt-16 px-4'>
                <View className='items-center'>
                    {/* Profile Picture */}
                    <View className='w-32 h-32 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg'>
                        <View className='w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700'>
                            {user.photo ? (
                                <Image
                                    source={{ uri: user.photo }}
                                    className='w-full h-full'
                                    resizeMode='cover'
                                />
                            ) : (
                                <LinearGradient
                                    colors={['#3b82f6', '#8b5cf6']}
                                    className='w-full h-full items-center justify-center'>
                                    <Text className='text-white text-4xl font-bold'>
                                        {getInitials(user.name)}
                                    </Text>
                                </LinearGradient>
                            )}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    {!isOwnProfile && (
                        <View className='flex-row w-full mt-4'>
                            <TouchableOpacity
                                onPress={onFollowToggle}
                                disabled={isFollowLoading}
                                className='flex-1 py-3 rounded-xl items-center justify-center mr-2'
                                style={{
                                    backgroundColor: isFollowing
                                        ? '#f3f4f6'
                                        : '#3b82f6',
                                    borderWidth: isFollowing ? 1 : 0,
                                    borderColor: isFollowing
                                        ? '#d1d5db'
                                        : undefined,
                                }}>
                                {isFollowLoading ? (
                                    <ActivityIndicator
                                        color={isFollowing ? '#6b7280' : '#fff'}
                                        size='small'
                                    />
                                ) : (
                                    <View className='flex-row items-center'>
                                        {isFollowing ? (
                                            <UserCheck
                                                color='#6b7280'
                                                size={18}
                                            />
                                        ) : (
                                            <Users
                                                color='#fff'
                                                size={18}
                                            />
                                        )}
                                        <Text
                                            className={`ml-2 font-semibold ${isFollowing ? 'text-gray-700' : 'text-white'}`}>
                                            {isFollowing
                                                ? 'Following'
                                                : 'Follow'}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleMessageClick}
                                className='flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 items-center justify-center'>
                                <View className='flex-row items-center'>
                                    <MessageCircle
                                        color='#6b7280'
                                        size={18}
                                    />
                                    <Text className='ml-2 font-semibold text-gray-700 dark:text-gray-300'>
                                        Message
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};
