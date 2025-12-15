// React
import React, { useState } from 'react';

// React Native
import { View, Text, Image, TouchableOpacity, TextInput, Alert, useColorScheme } from 'react-native';

// Expo
import { Ionicons } from '@expo/vector-icons';

// Utils
import { formatRelativeTime } from '../../lib/formatDate';

// Styles
import postCardStyles from '@/styles/profile/PostCardStyles';

interface PostCardProps {
    post: any;
    currentUserId: string;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    onAddComment: (postId: string, comment: string) => void;
    onDeleteComment: (postId: string, commentId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    currentUserId,
    onLike,
    onDelete,
    onAddComment,
    onDeleteComment,
}) => {
    const [commentText, setCommentText] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = postCardStyles(isDark);

    const isLiked = post.likes?.some(
        (like: any) => like._id === currentUserId || like === currentUserId
    );
    const isPostOwner = post.user?._id === currentUserId || post.user === currentUserId;

    const handleAddComment = () => {
        const comment = commentText.trim();
        if (!comment) {
            Alert.alert('Error', 'Please enter a comment');
            return;
        }
        onAddComment(post._id, comment);
        setCommentText('');
        setShowCommentInput(false);
    };

    const handleDeleteComment = (commentId: string) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDeleteComment(post._id, commentId),
                },
            ]
        );
    };

    const handleDeletePost = () => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onDelete(post._id),
                },
            ]
        );
    };

    return (
        <View style={styles.postCard}>
            {/* Post Header with User Info and Delete */}
            <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                    <Text style={styles.postUsername}>
                        {post.user?.username || 'Unknown'}
                    </Text>
                    <Text style={styles.postTime}>
                        • {formatRelativeTime(post.createdAt)}
                    </Text>
                </View>
                {isPostOwner && (
                    <TouchableOpacity onPress={handleDeletePost} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Post Content - Only show if there's text */}
            {post.content && (
                <View style={styles.postContentContainer}>
                    <Text style={styles.postContent}>{post.content}</Text>
                </View>
            )}

            {/* Post Image */}
            {post.image && (
                <View style={styles.postImageContainer}>
                    <Image
                        source={{ uri: post.image }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.postActions}>
                <TouchableOpacity onPress={() => onLike(post._id)} style={styles.likeButton}>
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isLiked ? '#ef4444' : '#6b7280'}
                    />
                    <Text style={styles.likeCount}>{post.likes?.length || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setShowCommentInput(!showCommentInput)}
                    style={styles.commentButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                    <Text style={styles.commentCount}>{post.comments?.length || 0}</Text>
                </TouchableOpacity>
            </View>

            {/* Comment Input and Comments List */}
            {showCommentInput && (
                <View style={styles.commentSection}>
                    {/* Comment Input */}
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            value={commentText}
                            onChangeText={setCommentText}
                            placeholder="Add a comment..."
                            placeholderTextColor="#9ca3af"
                            style={styles.commentInput}
                        />
                        <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
                            <Ionicons name="send" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Comments List */}
                    {post.comments && post.comments.length > 0 && (
                        <View>
                            {post.comments.slice(0, 3).map((comment: any, index: number) => {
                                const isOwnComment = comment.user?._id === currentUserId;
                                return (
                                    <View key={index} style={styles.commentItem}>
                                        <View style={styles.commentContent}>
                                            <View style={styles.commentLeft}>
                                                <Text style={styles.commentUsername}>
                                                    {comment.user?.username || 'Unknown'}
                                                </Text>
                                                <Text style={styles.commentText}>
                                                    {comment.comment}
                                                </Text>
                                            </View>
                                            {isOwnComment && (
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteComment(comment._id)}
                                                    style={styles.deleteCommentButton}>
                                                    <Ionicons
                                                        name="trash-outline"
                                                        size={16}
                                                        color="#ef4444"
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                            {post.comments.length > 3 && (
                                <Text style={styles.viewAllComments}>
                                    View all {post.comments.length} comments
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};
