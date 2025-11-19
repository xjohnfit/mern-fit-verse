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
import { WobbleCard } from "@/components/ui/wobble-card";

// Components
import {
  SuggestedUsersList,
  PostsFeed,
  NutritionOverview,
  MessagesSection,
  WorkoutsHistory,
} from "./components";

// Icons
import {
  Activity,
  Apple,
  Users,
  TrendingUp,
  Dumbbell,
  Calendar,
  Target,
  Flame,
  Clock,
  Award,
  BarChart3,
  Heart
} from "lucide-react";

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

  const hasNutritionData = nutritionData?.data?.totals &&
    (nutritionData.data.totals.calories > 0 ||
      nutritionData.data.totals.protein > 0 ||
      nutritionData.data.totals.carbs > 0 ||
      nutritionData.data.totals.fats > 0);

  // Tab content components
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {userInfo?.name || "User"}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Here's your fitness journey at a glance
        </p>
      </div>

      {/* Workout Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          Workout
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WobbleCard
            containerClassName="bg-linear-to-br from-cyan-500 to-cyan-700"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-xs sm:text-sm mb-1">Total Workouts</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{workoutStats?.totalWorkouts || 0}</p>
                <p className="text-cyan-200 text-xs mt-2">All time record</p>
              </div>
              <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/30" />
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="bg-linear-to-br from-pink-500 to-pink-700"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-xs sm:text-sm mb-1">This Week</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{workoutStats?.workoutsThisWeek || 0}</p>
                <p className="text-pink-200 text-xs mt-2">Keep it up! 💪</p>
              </div>
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/30" />
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="bg-linear-to-br from-teal-500 to-teal-700"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-xs sm:text-sm mb-1">Avg. Per Week</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {daysActive > 0 ? ((workoutStats?.totalWorkouts || 0) / (daysActive / 7)).toFixed(1) : 0}
                </p>
                <p className="text-teal-200 text-xs mt-2">Consistency score</p>
              </div>
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/30" />
            </div>
          </WobbleCard>
        </div>
      </div>

      {/* Nutrition Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Apple className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
          Nutrition
        </h2>
        {hasNutritionData && (
          <WobbleCard
            containerClassName="bg-linear-to-br from-indigo-600 to-purple-600"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">Today's Nutrition</h3>
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    {nutritionData?.data?.totals?.calories?.toFixed(0) || 0}
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    {nutritionData?.data?.totals?.protein?.toFixed(0) || 0}g
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    {nutritionData?.data?.totals?.carbs?.toFixed(0) || 0}g
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                    {nutritionData?.data?.totals?.fats?.toFixed(0) || 0}g
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm">Fats</p>
                </div>
              </div>
            </div>
          </WobbleCard>
        )}
      </div>

      {/* Social Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
          Social
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <WobbleCard
            containerClassName="bg-linear-to-br from-violet-500 to-violet-700"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="text-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 mx-auto mb-2 sm:mb-3" />
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{totalLikes}</p>
              <p className="text-violet-200 text-xs sm:text-sm">Total Likes</p>
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="bg-linear-to-br from-amber-500 to-amber-700"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 mx-auto mb-2 sm:mb-3" />
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{followers}</p>
              <p className="text-amber-200 text-xs sm:text-sm">Followers</p>
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="bg-linear-to-br from-rose-500 to-rose-700"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="text-center">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 mx-auto mb-2 sm:mb-3" />
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{totalPosts}</p>
              <p className="text-rose-200 text-xs sm:text-sm">Posts Shared</p>
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="bg-linear-to-br from-sky-500 to-sky-700"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="text-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white/80 mx-auto mb-2 sm:mb-3" />
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{daysActive}</p>
              <p className="text-sky-200 text-xs sm:text-sm">Days Active</p>
            </div>
          </WobbleCard>
        </div>

        <WobbleCard
          containerClassName="bg-linear-to-br from-emerald-600 to-emerald-800"
          className="py-6 sm:py-10 md:py-20"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">Engagement Overview</h3>
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div>
                <p className="text-emerald-200 text-xs sm:text-sm mb-2">Interaction Rate</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {totalPosts > 0 ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : 0}
                </p>
                <p className="text-emerald-300 text-xs mt-1">per post</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs sm:text-sm mb-2">Total Comments</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{totalComments}</p>
                <p className="text-emerald-300 text-xs mt-1">conversations</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs sm:text-sm mb-2">Following</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{following}</p>
                <p className="text-emerald-300 text-xs mt-1">connections</p>
              </div>
            </div>
          </div>
        </WobbleCard>
      </div>

      {/* Statistics Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
          Statistics
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {workoutStats?.totalWorkouts >= 1 && (
              <div className="text-center p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl sm:text-3xl mb-2">🏆</div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">First Workout</p>
              </div>
            )}
            {workoutStats?.totalWorkouts >= 10 && (
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl mb-2">💪</div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">10 Workouts</p>
              </div>
            )}
            {workoutStats?.totalWorkouts >= 50 && (
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl mb-2">🔥</div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">50 Workouts!</p>
              </div>
            )}
            {followers >= 5 && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl mb-2">🌟</div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">5 Followers</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ); const CommunityTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Community</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suggested Users */}
        <div className="lg:col-span-2">
          <SuggestedUsersList
            suggestedUsers={suggestedUsers}
            isLoading={isLoadingSuggested}
            onFollow={handleFollow}
            onUserClick={handleUserClick}
          />
        </div>

        {/* Messages Section */}
        <div className="lg:col-span-1">
          <MessagesSection
            followedUsers={currentUserProfile?.following}
            isLoading={isLoadingProfile}
            onUserClick={handleUserClick}
          />
        </div>
      </div>

      {/* Community Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Latest Posts</h3>
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
      </div>
    </div>
  );

  const NutritionTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Nutrition Tracking</h2>

      {hasNutritionData ? (
        <>
          {/* Today's Macros */}
          <WobbleCard
            containerClassName="bg-linear-to-br from-orange-600 to-red-600"
            className="py-6 sm:py-10 md:py-20"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Today's Intake</h3>
                <Flame className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/80" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <p className="text-orange-200 text-xs sm:text-sm mb-2">Calories</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {nutritionData?.data?.totals?.calories?.toFixed(0) || 0}
                  </p>
                  <p className="text-orange-300 text-xs mt-1">kcal</p>
                </div>
                <div>
                  <p className="text-orange-200 text-xs sm:text-sm mb-2">Protein</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {nutritionData?.data?.totals?.protein?.toFixed(0) || 0}
                  </p>
                  <p className="text-orange-300 text-xs mt-1">grams</p>
                </div>
                <div>
                  <p className="text-orange-200 text-xs sm:text-sm mb-2">Carbs</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {nutritionData?.data?.totals?.carbs?.toFixed(0) || 0}
                  </p>
                  <p className="text-orange-300 text-xs mt-1">grams</p>
                </div>
                <div>
                  <p className="text-orange-200 text-xs sm:text-sm mb-2">Fats</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {nutritionData?.data?.totals?.fats?.toFixed(0) || 0}
                  </p>
                  <p className="text-orange-300 text-xs mt-1">grams</p>
                </div>
              </div>
            </div>
          </WobbleCard>

          {/* Detailed Nutrition Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <NutritionOverview
              nutritionData={nutritionData}
              isLoading={isLoadingNutrition}
              onNavigate={navigate}
            />
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <Apple className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Nutrition Data Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your meals to see your nutrition overview
          </p>
          <button
            onClick={() => navigate("/nutrition")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Track Nutrition
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div onClick={() => navigate("/nutrition")} className="cursor-pointer">
          <WobbleCard
            containerClassName="bg-linear-to-br from-green-500 to-green-700"
            className="py-4 sm:py-6 md:py-10"
          >
            <div className="text-center">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 mx-auto mb-2 sm:mb-3" />
              <p className="text-white font-semibold text-sm sm:text-base">Set Goals</p>
            </div>
          </WobbleCard>
        </div>

        <div onClick={() => navigate("/nutrition")} className="cursor-pointer">
          <WobbleCard
            containerClassName="bg-linear-to-br from-blue-500 to-blue-700"
            className="py-4 sm:py-6 md:py-10"
          >
            <div className="text-center">
              <Apple className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 mx-auto mb-2 sm:mb-3" />
              <p className="text-white font-semibold text-sm sm:text-base">Log Meal</p>
            </div>
          </WobbleCard>
        </div>

        <div onClick={() => navigate("/nutrition")} className="cursor-pointer">
          <WobbleCard
            containerClassName="bg-linear-to-br from-purple-500 to-purple-700"
            className="py-4 sm:py-6 md:py-10"
          >
            <div className="text-center">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 mx-auto mb-2 sm:mb-3" />
              <p className="text-white font-semibold text-sm sm:text-base">View History</p>
            </div>
          </WobbleCard>
        </div>
      </div>
    </div>
  );

  const WorkoutsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Workout History</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {workouts?.length || 0} workout{(workouts?.length || 0) !== 1 ? 's' : ''} completed
          </p>
        </div>
        <button
          onClick={() => navigate("/workout")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <Dumbbell className="w-4 h-4" />
          <span className="hidden sm:inline">New Workout</span>
        </button>
      </div>

      <WorkoutsHistory workouts={workouts} isLoading={isLoadingWorkouts} />
    </div>
  );

  const tabs = [
    {
      title: "Overview",
      value: "overview",
      content: <OverviewTab />,
    },
    {
      title: "Workouts",
      value: "workouts",
      content: <WorkoutsTab />,
    },
    {
      title: "Community",
      value: "community",
      content: <CommunityTab />,
    },
    {
      title: "Nutrition",
      value: "nutrition",
      content: <NutritionTab />,
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

export default DashboardScreen;;