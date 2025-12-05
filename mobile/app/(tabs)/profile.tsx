import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Image, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../hooks/useRedux';
import { useViewUserProfileQuery, useFollowUnfollowUserMutation } from '../../slices/usersApiSlice';
import { useGetUserPostsQuery, useLikeUnlikePostMutation, useAddCommentMutation, useDeleteCommentMutation, useDeletePostMutation, useCreatePostMutation } from '../../slices/postsApiSlice';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { FollowersModal } from '../../components/profile/FollowersModal';
import { CreatePostModal } from '../../components/profile/CreatePostModal';
import Toast from 'react-native-toast-message';
import { formatRelativeTime } from '../../lib/formatDate';

export default function ProfileScreen() {
    const { userInfo } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [viewingUsername, setViewingUsername] = useState<string | null>(null);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
    const [showCommentInput, setShowCommentInput] = useState<Record<string, boolean>>({});

    // Use viewing username or fall back to own username
    const profileUsername = viewingUsername || userInfo?.username;

    // Fetch the profile (could be own or other user)
    const {
        data: userProfile,
        currentData,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useViewUserProfileQuery(profileUsername, {
        skip: !profileUsername,
    });

    // Use currentData if available, otherwise fall back to data
    // This keeps the previous data visible during refetches
    const displayProfile = currentData || userProfile;



    const [followUnfollowUser, { isLoading: isFollowLoading }] =
        useFollowUnfollowUserMutation();

    const [likeUnlikePost] = useLikeUnlikePostMutation();
    const [addComment] = useAddCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [deletePost] = useDeletePostMutation();
    const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();

    // Refetch when username changes
    useEffect(() => {
        if (profileUsername) {
            refetch();
        }
    }, [profileUsername, refetch]);

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
            const result = await followUnfollowUser(userProfile.username).unwrap();
            Toast.show({
                type: 'success',
                text1: result.message || 'Success',
            });
            refetch();
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

    const handleAddComment = async (postId: string) => {
        const comment = commentTexts[postId]?.trim();
        if (!comment) {
            Alert.alert('Error', 'Please enter a comment');
            return;
        }

        try {
            await addComment({ postId, comment }).unwrap();
            setCommentTexts({ ...commentTexts, [postId]: '' });
            setShowCommentInput({ ...showCommentInput, [postId]: false });
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
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
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
                    },
                },
            ]
        );
    };

    const handleDeletePost = async (postId: string) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
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
                    },
                },
            ]
        );
    };

    const handleCreatePost = async (content: string, imageUri: string | null) => {
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
        refetch();
    }, [refetch]);

    // Loading state - show loading screen when initially loading OR when we have no data
    if (isLoading || !displayProfile) {
        return (
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-600 dark:text-gray-400 mt-4">
                    Loading profile...
                </Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center px-6">
                <Ionicons name="person-circle-outline" size={64} color="#9ca3af" />
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                    Profile Not Found
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-center">
                    Unable to load your profile. Please try again.
                </Text>
            </View>
        );
    }

    const isOwnProfile = userInfo?._id === displayProfile._id;
    const isFollowing = displayProfile.followers.some(
        (follower: { _id: string; }) => follower._id === userInfo?._id
    );

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View className="flex-1 bg-gray-50 dark:bg-gray-900">
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                        keyboardShouldPersistTaps="handled"
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                        }
                    >
                        {/* Profile Header with Cover Photo */}
                        <ProfileHeader
                            user={displayProfile}
                            isOwnProfile={isOwnProfile}
                            isFollowing={isFollowing}
                            isFollowLoading={isFollowLoading}
                            onFollowToggle={handleFollowToggle}
                            onShowFollowers={() => setShowFollowersModal(true)}
                            onShowFollowing={() => setShowFollowingModal(true)}
                            onBackPress={viewingUsername ? () => setViewingUsername(null) : undefined}
                        />

                        {/* Posts Section - Full Width */}
                        <View className="py-4">

                            {isPostsLoading ? (
                                <View className="py-8 items-center">
                                    <ActivityIndicator size="small" color="#2563eb" />
                                    <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                        Loading posts...
                                    </Text>
                                </View>
                            ) : postsError ? (
                                <View className="py-8 items-center">
                                    <Text className="text-gray-500 dark:text-gray-400 text-center">
                                        Failed to load posts
                                    </Text>
                                </View>
                            ) : userPosts && userPosts.length > 0 ? (
                                <View>
                                    {userPosts.map((post: any) => {
                                        const isLiked = post.likes?.some((like: any) => like._id === userInfo?._id || like === userInfo?._id);
                                        return (
                                            <View key={post._id} className="bg-white dark:bg-gray-800 shadow-sm mb-3 rounded-2xl">
                                                {/* Post Header with User Info and Delete */}
                                                <View className="flex-row justify-between items-center px-4 p-4">
                                                    <View className="flex-row items-center flex-1">
                                                        <Text className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                                            {post.user?.username || userInfo?.username}
                                                        </Text>
                                                        <Text className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                                                            • {formatRelativeTime(post.createdAt)}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => handleDeletePost(post._id)}
                                                        className="ml-2"
                                                    >
                                                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                                    </TouchableOpacity>
                                                </View>
                                                {/* Post Content - Only show if there's text */}
                                                {post.content && (
                                                    <View className="px-4 pb-3">
                                                        <Text className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                                                            {post.content}
                                                        </Text>
                                                    </View>
                                                )}
                                                {post.image && (
                                                    <View className="w-full mb-3">
                                                        <Image
                                                            source={{ uri: post.image }}
                                                            style={{ width: '100%', aspectRatio: 1 }}
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                )}

                                                {/* Action Buttons */}
                                                <View className="flex-row items-center px-4 pb-3">
                                                    <TouchableOpacity
                                                        onPress={() => handleLikePost(post._id)}
                                                        className="flex-row items-center mr-6"
                                                    >
                                                        <Ionicons
                                                            name={isLiked ? "heart" : "heart-outline"}
                                                            size={22}
                                                            color={isLiked ? "#ef4444" : "#6b7280"}
                                                        />
                                                        <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1.5">
                                                            {post.likes?.length || 0}
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => setShowCommentInput({ ...showCommentInput, [post._id]: !showCommentInput[post._id] })}
                                                        className="flex-row items-center"
                                                    >
                                                        <Ionicons
                                                            name="chatbubble-outline"
                                                            size={20}
                                                            color="#6b7280"
                                                        />
                                                        <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1.5">
                                                            {post.comments?.length || 0}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Comment Input and Comments List - Only show when comment icon is clicked */}
                                                {showCommentInput[post._id] && (
                                                    <View className="px-4 pb-4 pt-3">
                                                        {/* Comment Input */}
                                                        <View className="flex-row items-center mb-3">
                                                            <TextInput
                                                                value={commentTexts[post._id] || ''}
                                                                onChangeText={(text) => setCommentTexts({ ...commentTexts, [post._id]: text })}
                                                                placeholder="Add a comment..."
                                                                placeholderTextColor="#9ca3af"
                                                                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-gray-900 dark:text-gray-100 text-sm"
                                                            />
                                                            <TouchableOpacity
                                                                onPress={() => handleAddComment(post._id)}
                                                                className="ml-2 bg-blue-500 rounded-full w-8 h-8 items-center justify-center"
                                                            >
                                                                <Ionicons name="send" size={16} color="#fff" />
                                                            </TouchableOpacity>
                                                        </View>

                                                        {/* Comments List */}
                                                        {post.comments && post.comments.length > 0 && (
                                                            <View>
                                                                {post.comments.slice(0, 3).map((comment: any, index: number) => {
                                                                    const isOwnComment = comment.user?._id === userInfo?._id;
                                                                    return (
                                                                        <View key={index} className="mb-2">
                                                                            <View className="flex-row items-start justify-between">
                                                                                <View className="flex-1 flex-row items-start">
                                                                                    <Text className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
                                                                                        {comment.user?.username || 'Unknown'}
                                                                                    </Text>
                                                                                    <Text className="text-gray-700 dark:text-gray-300 text-xs ml-2 flex-1">
                                                                                        {comment.comment}
                                                                                    </Text>
                                                                                </View>
                                                                                {isOwnComment && (
                                                                                    <TouchableOpacity
                                                                                        onPress={() => handleDeleteComment(post._id, comment._id)}
                                                                                        className="ml-2"
                                                                                    >
                                                                                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                                                                                    </TouchableOpacity>
                                                                                )}
                                                                            </View>
                                                                        </View>
                                                                    );
                                                                })}
                                                                {post.comments.length > 3 && (
                                                                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        View all {post.comments.length} comments
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            ) : (
                                <View className="py-8 items-center">
                                    <Text className="text-gray-500 dark:text-gray-400 text-center">
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
                        type="followers"
                        users={displayProfile.followers}
                        title="Followers"
                        onUserPress={handleUserPress}
                    />

                    {/* Following Modal */}
                    <FollowersModal
                        isOpen={showFollowingModal}
                        onClose={() => setShowFollowingModal(false)}
                        type="following"
                        users={displayProfile.following}
                        title="Following"
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
                            className="absolute bottom-6 right-6 bg-blue-500 rounded-full w-14 h-14 items-center justify-center shadow-lg"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            <Ionicons name="add" size={32} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </>
    );
}
