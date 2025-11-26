// React
import { useState } from "react";

// Third-party libraries
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// Redux slices
import { useGetDailyNutritionQuery } from "@/slices/nutritionApiSlice";
import { useGetPostsQuery, useLikeUnlikePostMutation, useAddCommentMutation } from "@/slices/postsApiSlice";
import { useGetSuggestedUsersQuery, useFollowUnfollowUserMutation, useGetUserProfileQuery } from "@/slices/usersApiSlice";
import { useGetWorkoutStatsQuery, useGetWorkoutsQuery } from "@/slices/workoutApiSlice";

// UI Components
import { Tabs } from "@/components/ui/tabs";

// Components
import { OverviewTab } from "./components/OverviewTab";
import { CommunityTab } from "./components/CommunityTab";
import { NutritionTab } from "./components/NutritionTab";
import { WorkoutTab } from "./components/WorkoutTab";

const DashboardScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || undefined;
  const { data: suggestedUsers, isLoading: isLoadingSuggested, refetch } = useGetSuggestedUsersQuery({});
  const { data: feedPosts, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetPostsQuery({});
  const { data: currentUserProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery({});
  const { data: nutritionData, isLoading: isLoadingNutrition } = useGetDailyNutritionQuery();
  const { data: workoutStats } = useGetWorkoutStatsQuery({});
  const { data: workouts, isLoading: isLoadingWorkouts } = useGetWorkoutsQuery({});
  const [followUnfollowUser] = useFollowUnfollowUserMutation();
  const [likeUnlikePost] = useLikeUnlikePostMutation();
  const [addComment] = useAddCommentMutation();

  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string; }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean; }>({});

  const handleFollow = async (username: string) => {
    try {
      const result = await followUnfollowUser(username).unwrap();
      toast.success(result.message);
      refetch();
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

  // Calculate user activity metrics
  const totalPosts = feedPosts?.length || 0;
  const totalLikes = feedPosts?.reduce((sum: number, post: any) => sum + (post.likes?.length || 0), 0) || 0;
  const totalComments = feedPosts?.reduce((sum: number, post: any) => sum + (post.comments?.length || 0), 0) || 0;
  const followers = currentUserProfile?.followers?.length || 0;
  const following = currentUserProfile?.following?.length || 0;
  const joinDate = currentUserProfile?.createdAt ? new Date(currentUserProfile.createdAt) : new Date();
  const daysActive = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

  // Always show nutrition data, default to 0 if no data exists
  const nutritionTotals = {
    calories: nutritionData?.data?.totals?.calories || 0,
    protein: nutritionData?.data?.totals?.protein || 0,
    carbs: nutritionData?.data?.totals?.carbs || 0,
    fats: nutritionData?.data?.totals?.fats || 0,
  };

  const tabs = [
    {
      title: "Overview",
      value: "overview",
      content: (
        <OverviewTab
          userInfo={userInfo}
          workoutStats={workoutStats}
          nutritionTotals={nutritionTotals}
          totalPosts={totalPosts}
          totalLikes={totalLikes}
          totalComments={totalComments}
          followers={followers}
          following={following}
          daysActive={daysActive}
        />
      ),
    },
    {
      title: "Workouts",
      value: "workouts",
      content: (
        <WorkoutTab
          workouts={workouts}
          isLoadingWorkouts={isLoadingWorkouts}
          onNavigate={navigate}
        />
      ),
    },
    {
      title: "Community",
      value: "community",
      content: (
        <CommunityTab
          suggestedUsers={suggestedUsers}
          isLoadingSuggested={isLoadingSuggested}
          currentUserProfile={currentUserProfile}
          isLoadingProfile={isLoadingProfile}
          feedPosts={feedPosts}
          isLoadingPosts={isLoadingPosts}
          userInfo={userInfo}
          commentTexts={commentTexts}
          showComments={showComments}
          onFollow={handleFollow}
          onUserClick={handleUserClick}
          onLike={handleLikePost}
          onToggleComments={toggleComments}
          onCommentTextChange={handleCommentTextChange}
          onAddComment={handleAddComment}
          formatRelativeTime={formatRelativeTime}
        />
      ),
    },
    {
      title: "Nutrition",
      value: "nutrition",
      content: (
        <NutritionTab
          nutritionTotals={nutritionTotals}
          nutritionData={nutritionData}
          isLoadingNutrition={isLoadingNutrition}
          onNavigate={navigate}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs
          tabs={tabs}
          containerClassName="mb-8"
          activeTabClassName="bg-linear-to-r from-blue-500 to-purple-600"
          contentClassName="mt-8 relative"
          defaultValue={defaultTab}
        />
      </div>
    </div>
  );
};

export default DashboardScreen;