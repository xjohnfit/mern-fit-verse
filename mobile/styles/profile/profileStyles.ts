import { StyleSheet } from 'react-native';

const profileStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#f9fafb',
        },
        loadingContainer: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#f9fafb',
            alignItems: 'center',
            justifyContent: 'center',
        },
        loadingText: {
            color: isDark ? '#9ca3af' : '#4b5563',
            marginTop: 16,
        },
        errorContainer: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#f9fafb',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
        },
        errorTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#f3f4f6' : '#111827',
            marginTop: 16,
            marginBottom: 8,
        },
        errorText: {
            color: isDark ? '#9ca3af' : '#4b5563',
            textAlign: 'center',
        },
        scrollView: {
            flex: 1,
        },
        postsSection: {
            paddingVertical: 16,
            paddingHorizontal: 8,
        },
        loadingPostsContainer: {
            paddingVertical: 32,
            alignItems: 'center',
        },
        loadingPostsText: {
            color: isDark ? '#9ca3af' : '#6b7280',
            marginTop: 8,
            fontSize: 14,
        },
        errorPostsContainer: {
            paddingVertical: 32,
            alignItems: 'center',
        },
        errorPostsText: {
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
        },
        emptyPostsContainer: {
            paddingVertical: 32,
            alignItems: 'center',
        },
        emptyPostsText: {
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
        },
        postCard: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
            marginBottom: 12,
            borderRadius: 16,
        },
        postHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            padding: 16,
        },
        postHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        postUsername: {
            fontWeight: '600',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 14,
        },
        postTime: {
            color: isDark ? '#9ca3af' : '#6b7280',
            fontSize: 12,
            marginLeft: 8,
        },
        deleteButton: {
            marginLeft: 8,
        },
        postContentContainer: {
            paddingHorizontal: 16,
            paddingBottom: 12,
        },
        postContent: {
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 14,
            lineHeight: 20,
        },
        postImageContainer: {
            width: '100%',
            marginBottom: 12,
        },
        postImage: {
            width: '100%',
            aspectRatio: 1,
        },
        postActions: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 12,
        },
        likeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 24,
        },
        likeCount: {
            fontSize: 12,
            fontWeight: '500',
            color: isDark ? '#d1d5db' : '#374151',
            marginLeft: 6,
        },
        commentButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        commentCount: {
            fontSize: 12,
            fontWeight: '500',
            color: isDark ? '#d1d5db' : '#374151',
            marginLeft: 6,
        },
        commentSection: {
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 12,
        },
        commentInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        commentInput: {
            flex: 1,
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
            borderRadius: 9999,
            paddingHorizontal: 16,
            paddingVertical: 8,
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 14,
        },
        sendButton: {
            marginLeft: 8,
            backgroundColor: '#3b82f6',
            borderRadius: 9999,
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        commentItem: {
            marginBottom: 8,
        },
        commentContent: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
        },
        commentLeft: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        commentUsername: {
            fontWeight: '600',
            color: isDark ? '#f3f4f6' : '#111827',
            fontSize: 12,
        },
        commentText: {
            color: isDark ? '#d1d5db' : '#374151',
            fontSize: 12,
            marginLeft: 8,
            flex: 1,
        },
        deleteCommentButton: {
            marginLeft: 8,
        },
        viewAllComments: {
            fontSize: 12,
            color: isDark ? '#9ca3af' : '#6b7280',
            marginTop: 4,
        },
        fab: {
            position: 'absolute',
            bottom: 24,
            right: 24,
            backgroundColor: '#3b82f6',
            borderRadius: 9999,
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        keyboardAvoidingView: {
            flex: 1,
        },
    });

export default profileStyles;
