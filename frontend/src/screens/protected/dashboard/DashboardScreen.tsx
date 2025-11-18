// React
import { useState } from "react";

// Third-party libraries
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// Redux slices
import { useGetDailyNutritionQuery } from "@/slices/nutritionApiSlice";
import { useGetPostsQuery, useLikeUnlikePostMutation, useAddCommentMutation } from "@/slices/postsApiSlice";
import { useGetSuggestedUsersQuery, useFollowUnfollowUserMutation, useGetUserProfileQuery } from "@/slices/usersApiSlice";

// Components
import {
  SuggestedUsersList,
  WelcomeHeader,
  PostsFeed,
  QuickStatsCards,
  NutritionOverview,
  MessagesSection,
} from "./components";

const DashboardScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const { data: suggestedUsers, isLoading: isLoadingSuggested, refetch } = useGetSuggestedUsersQuery({});
  const { data: feedPosts, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetPostsQuery({});
  const { data: currentUserProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery({});
  const { data: nutritionData, isLoading: isLoadingNutrition } = useGetDailyNutritionQuery();
  const [followUnfollowUser] = useFollowUnfollowUserMutation();
  const [likeUnlikePost] = useLikeUnlikePostMutation();
  const [addComment] = useAddCommentMutation();

  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string; }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean; }>({});

  const handleFollow = async (username: string) => {
    try {
      const result = await followUnfollowUser(username).unwrap();
      toast.success(result.message);
      refetch(); // Refresh suggested users list
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to follow user');
    }
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/view/${username}`);
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likeUnlikePost(postId).unwrap();
      refetchPosts();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to like post');
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentText = commentTexts[postId]?.trim();
    if (!commentText) return;

    try {
      await addComment({ postId, comment: commentText }).unwrap();
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      refetchPosts();
      toast.success('Comment added successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add comment');
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentTextChange = (postId: string, text: string) => {
    setCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left Sidebar - Suggested Users */}
          <div className="xl:col-span-3">
            <SuggestedUsersList
              suggestedUsers={suggestedUsers}
              isLoading={isLoadingSuggested}
              onFollow={handleFollow}
              onUserClick={handleUserClick}
            />
          </div>

          {/* Main Content - Posts Feed */}
          <div className="xl:col-span-6">
            <div className="space-y-6">
              {/* Welcome Header */}
              <WelcomeHeader userName={userInfo?.name || "User"} />

              {/* Posts Feed */}
              <PostsFeed
                posts={feedPosts}
                isLoading={isLoadingPosts}
                currentUserId={userInfo?._id || ""}
                currentUserName={userInfo?.name || "User"}
                currentUserPhoto={userInfo?.photo}
                commentTexts={commentTexts}
                showComments={showComments}
                onLike={handleLikePost}
                onToggleComments={toggleComments}
                onCommentTextChange={handleCommentTextChange}
                onAddComment={handleAddComment}
                onUserClick={handleUserClick}
                formatRelativeTime={formatRelativeTime}
              />

              {/* Quick Stats Cards */}
              <QuickStatsCards onNavigate={navigate} />
            </div>
          </div>

          {/* Right Sidebar - Nutrition Stats & Messages */}
          <div className="xl:col-span-3">
            <div className="space-y-4">
              {/* Today's Nutrition Overview */}
              <NutritionOverview
                nutritionData={nutritionData}
                isLoading={isLoadingNutrition}
                onNavigate={navigate}
              />

              {/* Messages Section */}
              <MessagesSection
                followedUsers={currentUserProfile?.following}
                isLoading={isLoadingProfile}
                onUserClick={handleUserClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardScreen;