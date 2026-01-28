import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { calculateAge } from '../../lib/calculateAge';
import { formatDateToMMDDYYYY } from '../../lib/formatDate';
import { UserProfile } from '../../types/profile.types';
import { NotificationBell } from './NotificationBell';
import { OptionMenuModal } from './OptionMenuModal';
import ProfileHeaderStyles from '../../styles/profile/ProfileHeaderStyles';

// Helper function to format goal values to display labels
const formatGoalLabel = (goalValue: string): string => {
    const goalMap: Record<string, string> = {
        'lose-weight': 'Lose Weight',
        'build-muscle': 'Build Muscle',
        'maintain': 'Maintain Health',
    };
    return goalMap[goalValue] || goalValue;
};

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
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

    const handleMessageClick = () => {
        router.push(`/chat?userId=${user._id}`);
    };

    const handleReportUser = () => {
        // Report is handled in OptionMenuModal with proper API call and alert
        // No additional action needed here
    };

    const handleBlockUser = () => {
        // Block is handled in OptionMenuModal with proper API call and alert
        // No additional action needed here
    };

    // Safety check for user data
    if (!user || !user.name) {
        return null;
    }

    return (
        <View style={isDark ? ProfileHeaderStyles.containerDark : ProfileHeaderStyles.container}>
            {/* Compact Gradient Header */}
            <LinearGradient
                colors={['#3b82f6', '#8b5cf6', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: insets.top + 20,
                    paddingBottom: 24,
                    paddingHorizontal: 16,
                    borderTopLeftRadius: 47,
                    borderTopRightRadius: 47,
                }}>
                {/* Name and Username centered */}
                <View style={ProfileHeaderStyles.nameContainer}>
                    <View style={ProfileHeaderStyles.topRow}>
                        {/* Back Button - Only show when not own profile */}
                        {!isOwnProfile && onBackPress ? (
                            <TouchableOpacity
                                onPress={onBackPress}
                                style={ProfileHeaderStyles.backButton}
                            >
                                <Ionicons
                                    name='arrow-back'
                                    color='#fff'
                                    size={24}
                                />
                            </TouchableOpacity>
                        ) : (
                            <View style={ProfileHeaderStyles.spacer} />
                        )}
                        <View style={ProfileHeaderStyles.nameWrapper}>
                            <Text
                                style={ProfileHeaderStyles.name}
                                numberOfLines={1}
                                ellipsizeMode='tail'>
                                {user.name}
                            </Text>
                        </View>
                        {/* More Options Button or Notification Bell */}
                        {!isOwnProfile ? (
                            <TouchableOpacity
                                style={ProfileHeaderStyles.moreButton}
                                onPress={() => setShowOptionsMenu(true)}
                            >
                                <Ionicons
                                    name='ellipsis-horizontal'
                                    color='#fff'
                                    size={20}
                                />
                            </TouchableOpacity>
                        ) : (
                            <NotificationBell color="#fff" />
                        )}
                    </View>

                    <Text
                        style={ProfileHeaderStyles.username}
                        numberOfLines={1}>
                        @{user.username}
                    </Text>
                </View>

                {/* Personal Info Chips */}
                <View style={ProfileHeaderStyles.chipsContainer}>
                    {/* Age */}
                    <View style={ProfileHeaderStyles.chip}>
                        <Ionicons
                            name='gift'
                            color='#fff'
                            size={14}
                        />
                        <Text style={ProfileHeaderStyles.chipText}>
                            {calculateAge(user.dob)} years
                        </Text>
                    </View>

                    {/* Gender */}
                    <View style={ProfileHeaderStyles.chip}>
                        <Ionicons
                            name='person'
                            color='#fff'
                            size={14}
                        />
                        <Text style={ProfileHeaderStyles.chipTextCapitalize}>
                            {user.gender}
                        </Text>
                    </View>

                    {/* Joined Date */}
                    <View style={ProfileHeaderStyles.chipLast}>
                        <Ionicons
                            name='calendar'
                            color='#fff'
                            size={14}
                        />
                        <Text style={ProfileHeaderStyles.chipText}>
                            Joined {formatDateToMMDDYYYY(user.createdAt)}
                        </Text>
                    </View>
                </View>

                {/* Fitness Info Chips */}
                <View style={ProfileHeaderStyles.chipsContainer}>
                    {/* Height */}
                    {user.height && (
                        <View style={ProfileHeaderStyles.chip}>
                            <Ionicons
                                name='resize'
                                color='#fff'
                                size={14}
                            />
                            <Text style={ProfileHeaderStyles.chipText}>
                                {user.height} cm
                            </Text>
                        </View>
                    )}

                    {/* Weight */}
                    {user.weight && (
                        <View style={ProfileHeaderStyles.chipLast}>
                            <Ionicons
                                name='barbell'
                                color='#fff'
                                size={14}
                            />
                            <Text style={ProfileHeaderStyles.chipText}>
                                {user.weight} {user.weightUnit || 'kg'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Fitness Goal */}
                {user.goal && (
                    <View style={ProfileHeaderStyles.goalChip}>
                        <View style={ProfileHeaderStyles.goalContent}>
                            <Ionicons
                                name='flag'
                                color='#fff'
                                size={14}
                            />
                            <Text style={ProfileHeaderStyles.goalLabel}>
                                Goal:
                            </Text>
                            <Text style={ProfileHeaderStyles.goalValue} numberOfLines={1}>
                                {formatGoalLabel(user.goal)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Stats in Gradient */}
                <View style={ProfileHeaderStyles.statsContainer}>
                    <TouchableOpacity
                        onPress={onShowFollowers}
                        style={ProfileHeaderStyles.statButton}>
                        <Text style={ProfileHeaderStyles.statValue}>
                            {user.followers.length}
                        </Text>
                        <Text style={ProfileHeaderStyles.statLabel}>
                            Followers
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onShowFollowing}
                        style={ProfileHeaderStyles.statButtonLast}>
                        <Text style={ProfileHeaderStyles.statValue}>
                            {user.following.length}
                        </Text>
                        <Text style={ProfileHeaderStyles.statLabel}>
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Profile Picture Overlay */}
            <View style={ProfileHeaderStyles.profilePictureSection}>
                <View style={ProfileHeaderStyles.profilePictureContainer}>
                    {/* Profile Picture */}
                    <View style={isDark ? ProfileHeaderStyles.profilePictureWrapperDark : ProfileHeaderStyles.profilePictureWrapper}>
                        <View style={isDark ? ProfileHeaderStyles.profilePictureDark : ProfileHeaderStyles.profilePicture}>
                            {user.photo ? (
                                <Image
                                    source={{ uri: user.photo }}
                                    style={ProfileHeaderStyles.profileImage}
                                    resizeMode='cover'
                                />
                            ) : (
                                <View style={isDark ? ProfileHeaderStyles.profileImagePlaceholderDark : ProfileHeaderStyles.profileImagePlaceholder}>
                                    <Ionicons
                                        name='person'
                                        size={64}
                                        color='#9ca3af'
                                    />
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    {!isOwnProfile && (
                        <View style={ProfileHeaderStyles.actionButtons}>
                            <TouchableOpacity
                                onPress={onFollowToggle}
                                disabled={isFollowLoading}
                                style={
                                    isFollowing ? ProfileHeaderStyles.followButtonFollowing : ProfileHeaderStyles.followButton
                                }>
                                {isFollowLoading ? (
                                    <ActivityIndicator
                                        color={isFollowing ? '#2563eb' : '#fff'}
                                        size='small'
                                    />
                                ) : (
                                    <View style={ProfileHeaderStyles.buttonContent}>
                                        {isFollowing ? (
                                            <Ionicons
                                                name='checkmark-circle'
                                                color='#2563eb'
                                                size={18}
                                            />
                                        ) : (
                                            <Ionicons
                                                name='people'
                                                color='#fff'
                                                size={18}
                                            />
                                        )}
                                        <Text
                                            style={[ProfileHeaderStyles.followButtonText, { color: isFollowing ? '#1e40af' : '#fff' }]}>
                                            {isFollowing
                                                ? 'Following'
                                                : 'Follow'}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleMessageClick}
                                style={ProfileHeaderStyles.messageButton}>
                                <View style={ProfileHeaderStyles.buttonContent}>
                                    <Ionicons
                                        name='chatbubble'
                                        color='#2563eb'
                                        size={18}
                                    />
                                    <Text style={ProfileHeaderStyles.messageButtonText}>
                                        Message
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Options Menu Modal */}
            <OptionMenuModal
                visible={showOptionsMenu}
                userName={user.name}
                userId={user._id}
                onClose={() => setShowOptionsMenu(false)}
                onReport={handleReportUser}
                onBlock={handleBlockUser}
            />
        </View>
    );
};
