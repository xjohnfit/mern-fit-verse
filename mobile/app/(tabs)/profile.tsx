// React
import React, { useEffect, useState } from 'react';

// React Native
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    useColorScheme,
} from 'react-native';

// Expo
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Third-party
import Toast from 'react-native-toast-message';

// Hooks
import { useAppSelector } from '../../hooks/useRedux';

// API Slices
import {
    useViewUserProfileQuery,
    useFollowUnfollowUserMutation,
    useGetUserProfileQuery,
} from '../../slices/usersApiSlice';
import {
    useGetUserPostsQuery,
    useLikeUnlikePostMutation,
    useAddCommentMutation,
    useDeleteCommentMutation,
    useDeletePostMutation,
    useCreatePostMutation,
} from '../../slices/postsApiSlice';

// Components
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { FollowersModal } from '../../components/profile/FollowersModal';
import { CreatePostModal } from '../../components/profile/CreatePostModal';
import { PostCard } from '../../components/profile/PostCard';

// Styles
import profileStyles from '../../styles/profile/profileStyles';

export default function ProfileScreen() {
    const { userInfo } = useAppSelector((state) => state.auth);
    const { username: paramUsername } = useLocalSearchParams<{
        username?: string;
    }>();
    const [viewingUsername, setViewingUsername] = useState<string | null>(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = profileStyles(isDark);

    // Update viewingUsername when paramUsername changes
    useEffect(() => {
        if (paramUsername && paramUsername !== userInfo?.username) {
            setViewingUsername(paramUsername);
        } else if (paramUsername === userInfo?.username) {
            setViewingUsername(null);
        }
    }, [paramUsername, userInfo?.username]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);

    // Use viewing username or fall back to own username
    const profileUsername = viewingUsername || userInfo?.username;
    const isOwnProfile =
        !viewingUsername || viewingUsername === userInfo?.username;

    // Fetch own profile to get populated followers/following
    const {
        data: ownProfile,
        isLoading: isLoadingOwn,
        refetch: refetchOwn,
    } = useGetUserProfileQuery(undefined, {
        skip: !isOwnProfile,
    });

    // Fetch the profile ONLY if viewing another user's profile
    const {
        data: userProfile,
        currentData,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useViewUserProfileQuery(profileUsername, {
        skip: !profileUsername || isOwnProfile, // Skip API call for own profile
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });

    // Use populated own profile for own profile, otherwise use API data for other users
    const displayProfile = isOwnProfile
        ? ownProfile
        : currentData || userProfile;

    const [followUnfollowUser, { isLoading: isFollowLoading }] =
        useFollowUnfollowUserMutation();

    const [likeUnlikePost] = useLikeUnlikePostMutation();
    const [addComment] = useAddCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [deletePost] = useDeletePostMutation();
    const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();

    // Only refetch when viewing a different user's profile
    useEffect(() => {
        if (viewingUsername && profileUsername && !isOwnProfile) {
            refetch();
        }
    }, [viewingUsername, isOwnProfile, profileUsername]);

    // Fetch user posts
    const {
        data: userPosts,
        isLoading: isPostsLoading,
        error: postsError,
        refetch: refetchPosts,
    } = useGetUserPostsQuery(profileUsername, {
        skip: !profileUsername,
        refetchOnMountOrArgChange: true,
    });

    const handleFollowToggle = async () => {
        if (!userProfile) return;

        try {
            await followUnfollowUser(userProfile.username).unwrap();
            if (!isOwnProfile) {
                refetch();
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to update follow status',
            });
        }
    };

    const handleUserPress = (username: string) => {
        if (username === userInfo?.username) {
            // Viewing own profile, reset to default
            setViewingUsername(null);
        } else {
            // View another user's profile
            setViewingUsername(username);
        }
        // Close modals
        setShowFollowersModal(false);
        setShowFollowingModal(false);
    };

    const handleLikePost = async (postId: string) => {
        try {
            await likeUnlikePost(postId).unwrap();
            refetchPosts();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to like post',
            });
        }
    };

    const handleAddComment = async (postId: string, comment: string) => {
        try {
            await addComment({ postId, comment }).unwrap();
            refetchPosts();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to add comment',
            });
        }
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        try {
            await deleteComment({ postId, commentId }).unwrap();
            refetchPosts();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to delete comment',
            });
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await deletePost(postId).unwrap();
            refetchPosts();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to delete post',
            });
        }
    };

    const handleCreatePost = async (
        content: string,
        imageUri: string | null
    ) => {
        try {
            let base64Image = null;

            if (imageUri) {
                // Convert image to base64
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const reader = new FileReader();

                base64Image = await new Promise<string>((resolve, reject) => {
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }

            const postData = {
                content,
                ...(base64Image && { image: base64Image }),
            };

            await createPost(postData).unwrap();
            setShowCreatePostModal(false);
            refetchPosts();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to create post',
            });
        }
    };

    const onRefresh = React.useCallback(() => {
        if (isOwnProfile) {
            refetchOwn();
        } else {
            refetch();
        }
        refetchPosts();
    }, [refetch, refetchPosts, refetchOwn, isOwnProfile]);

    // Loading state - show loading screen when initially loading OR when we have no data
    if ((isOwnProfile ? isLoadingOwn : isLoading) || !displayProfile) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size='large'
                    color='#2563eb'
                />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons
                    name='person-circle-outline'
                    size={64}
                    color='#9ca3af'
                />
                <Text style={styles.errorTitle}>Profile Not Found</Text>
                <Text style={styles.errorText}>
                    Unable to load your profile. Please try again.
                </Text>
            </View>
        );
    }

    const isFollowing = displayProfile.followers.some(
        (follower: { _id: string; }) => follower._id === userInfo?._id
    );

    return (
        <>
            <StatusBar
                barStyle='light-content'
                backgroundColor='#3b82f6'
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.scrollView}
                        keyboardShouldPersistTaps='handled'
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={onRefresh}
                            />
                        }>
                        {/* Profile Header with Cover Photo */}
                        <ProfileHeader
                            user={displayProfile}
                            isOwnProfile={isOwnProfile}
                            isFollowing={isFollowing}
                            isFollowLoading={isFollowLoading}
                            onFollowToggle={handleFollowToggle}
                            onShowFollowers={() => setShowFollowersModal(true)}
                            onShowFollowing={() => setShowFollowingModal(true)}
                            onBackPress={
                                viewingUsername
                                    ? () => setViewingUsername(null)
                                    : undefined
                            }
                        />

                        {/* Posts Section - Full Width */}
                        <View style={styles.postsSection}>
                            {isPostsLoading ? (
                                <View style={styles.loadingPostsContainer}>
                                    <ActivityIndicator
                                        size='small'
                                        color='#2563eb'
                                    />
                                    <Text style={styles.loadingPostsText}>
                                        Loading posts...
                                    </Text>
                                </View>
                            ) : postsError ? (
                                <View style={styles.errorPostsContainer}>
                                    <Text style={styles.errorPostsText}>
                                        Failed to load posts
                                    </Text>
                                </View>
                            ) : userPosts && userPosts.length > 0 ? (
                                <View>
                                    {userPosts.map((post: any) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            currentUserId={userInfo?._id || ''}
                                            onLike={handleLikePost}
                                            onDelete={handleDeletePost}
                                            onAddComment={handleAddComment}
                                            onDeleteComment={handleDeleteComment}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.emptyPostsContainer}>
                                    <Text style={styles.emptyPostsText}>
                                        No posts yet
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Followers Modal */}
                    <FollowersModal
                        isOpen={showFollowersModal}
                        onClose={() => setShowFollowersModal(false)}
                        type='followers'
                        users={displayProfile?.followers || []}
                        title='Followers'
                        onUserPress={handleUserPress}
                    />

                    {/* Following Modal */}
                    <FollowersModal
                        isOpen={showFollowingModal}
                        onClose={() => setShowFollowingModal(false)}
                        type='following'
                        users={displayProfile?.following || []}
                        title='Following'
                        onUserPress={handleUserPress}
                    />

                    {/* Create Post Modal */}
                    <CreatePostModal
                        visible={showCreatePostModal}
                        onClose={() => setShowCreatePostModal(false)}
                        onSubmit={handleCreatePost}
                        isLoading={isCreatingPost}
                    />

                    {/* Floating Action Button - Only show on own profile */}
                    {isOwnProfile && (
                        <TouchableOpacity
                            onPress={() => setShowCreatePostModal(true)}
                            style={styles.fab}>
                            <Ionicons
                                name='add'
                                size={32}
                                color='#fff'
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </>
    );
}
