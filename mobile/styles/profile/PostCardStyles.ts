import { StyleSheet } from 'react-native';

const postCardStyles = (isDark: boolean) =>
    StyleSheet.create({
        postCard: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        postHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        postHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        postUsername: {
            fontSize: 15,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#1F2937',
            marginRight: 6,
        },
        postTime: {
            fontSize: 13,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        deleteButton: {
            padding: 4,
        },
        postContentContainer: {
            marginBottom: 12,
        },
        postContent: {
            fontSize: 15,
            lineHeight: 22,
            color: isDark ? '#E5E7EB' : '#374151',
        },
        postImageContainer: {
            width: '100%',
            aspectRatio: 1,
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 12,
        },
        postImage: {
            width: '100%',
            height: '100%',
        },
        postActions: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
        },
        likeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 20,
        },
        likeCount: {
            marginLeft: 6,
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
        commentButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        commentCount: {
            marginLeft: 6,
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
        commentSection: {
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
        },
        commentInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        commentInput: {
            flex: 1,
            backgroundColor: isDark ? '#374151' : '#F3F4F6',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            fontSize: 14,
            color: isDark ? '#F9FAFB' : '#1F2937',
            marginRight: 8,
        },
        sendButton: {
            backgroundColor: '#3B82F6',
            borderRadius: 20,
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
        },
        commentItem: {
            marginBottom: 8,
        },
        commentContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        commentLeft: {
            flex: 1,
        },
        commentUsername: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#1F2937',
            marginBottom: 2,
        },
        commentText: {
            fontSize: 14,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 20,
        },
        deleteCommentButton: {
            padding: 4,
            marginLeft: 8,
        },
        viewAllComments: {
            fontSize: 13,
            color: '#3B82F6',
            marginTop: 8,
            fontWeight: '600',
        },
    });

export default postCardStyles;
