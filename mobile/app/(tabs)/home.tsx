import { ScrollView, Text, View, RefreshControl } from "react-native";
import { useAppSelector } from "../../hooks/useRedux";
import { useRouter } from "expo-router";
import { useState } from "react";
import SafeScreen from "@/components/layout/SafeScreen";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import SuggestedUsers from "@/components/dashboard/SuggestedUsers";
import { Ionicons } from "@expo/vector-icons";
import { useGetWorkoutStatsQuery, useGetWorkoutsQuery } from "../../slices/workoutApiSlice";
import { useGetDailyNutritionQuery } from "../../slices/nutritionApiSlice";
import { useGetUserProfileQuery, useGetSuggestedUsersQuery, useFollowUnfollowUserMutation } from "../../slices/usersApiSlice";
import { useGetPostsQuery } from "../../slices/postsApiSlice";

export default function HomeScreen() {
    const { userInfo } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // Fetch data
    const { data: workoutStats, refetch: refetchWorkoutStats } = useGetWorkoutStatsQuery({});
    const { data: workouts, isLoading: isLoadingWorkouts, refetch: refetchWorkouts } = useGetWorkoutsQuery({});
    const { data: nutritionData, refetch: refetchNutrition } = useGetDailyNutritionQuery();
    const { data: currentUserProfile, refetch: refetchProfile } = useGetUserProfileQuery({});
    const { data: suggestedUsers, isLoading: isLoadingSuggested, refetch: refetchSuggested } = useGetSuggestedUsersQuery({});
    const { data: feedPosts, refetch: refetchPosts } = useGetPostsQuery({});
    const [followUnfollowUser] = useFollowUnfollowUserMutation();

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            refetchWorkoutStats(),
            refetchWorkouts(),
            refetchNutrition(),
            refetchProfile(),
            refetchSuggested(),
            refetchPosts(),
        ]);
        setRefreshing(false);
    };

    const handleFollow = async (username: string) => {
        try {
            const result = await followUnfollowUser(username).unwrap();
            refetchSuggested();
        } catch (error: any) {
            console.error('Failed to follow user:', error);
        }
    };

    const handleUserPress = (username: string) => {
        // Navigate to user profile when implemented
        console.log('Navigate to user profile:', username);
    };

    // Calculate metrics
    const nutritionTotals = {
        calories: nutritionData?.data?.totals?.calories || 0,
        protein: nutritionData?.data?.totals?.protein || 0,
        carbs: nutritionData?.data?.totals?.carbs || 0,
        fats: nutritionData?.data?.totals?.fats || 0,
    };

    const totalPosts = feedPosts?.length || 0;
    const totalLikes = feedPosts?.reduce((sum: number, post: any) => sum + (post.likes?.length || 0), 0) || 0;
    const followers = currentUserProfile?.followers?.length || 0;
    const following = currentUserProfile?.following?.length || 0;
    const joinDate = currentUserProfile?.createdAt ? new Date(currentUserProfile.createdAt) : new Date();
    const daysActive = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <SafeScreen>
            <ScrollView
                className="flex-1 py-6 px-2"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Welcome Header */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {" "}
                        </Text>
                        <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {userInfo?.name || userInfo?.username || "User"}
                        </Text>
                    </View>
                    <Text className="text-base text-gray-600 dark:text-gray-400">
                        Here's your fitness journey at a glance
                    </Text>
                </View>

                {/* Workout Stats */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="barbell" size={20} color="#10B981" style={{ marginRight: 8 }} />
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">
                            Workout Stats
                        </Text>
                    </View>
                    <View className="flex-row gap-3 mb-3">
                        <StatsCard
                            icon="barbell"
                            iconColor="#fff"
                            bgColor="#06B6D4"
                            label="Total Workouts"
                            value={workoutStats?.totalWorkouts || 0}
                            subtitle="All time"
                            className="flex-1"
                        />
                        <StatsCard
                            icon="calendar-outline"
                            iconColor="#fff"
                            bgColor="#EC4899"
                            label="This Week"
                            value={workoutStats?.workoutsThisWeek || 0}
                            subtitle="Keep it up! 💪"
                            className="flex-1"
                        />
                    </View>
                    <StatsCard
                        icon="trending-up"
                        iconColor="#fff"
                        bgColor="#14B8A6"
                        label="Avg. Per Week"
                        value={daysActive > 0 ? ((workoutStats?.totalWorkouts || 0) / (daysActive / 7)).toFixed(1) : 0}
                        subtitle="Consistency score"
                    />
                </View>

                {/* Nutrition Overview */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="nutrition" size={20} color="#8B5CF6" style={{ marginRight: 8 }} />
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">
                            Today's Nutrition
                        </Text>
                    </View>
                    <View className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4">
                        <View className="flex-row justify-around">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-white">
                                    {nutritionTotals.calories.toFixed(0)}
                                </Text>
                                <Text className="text-white/70 text-xs mt-1">Calories</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-white">
                                    {nutritionTotals.protein.toFixed(0)}g
                                </Text>
                                <Text className="text-white/70 text-xs mt-1">Protein</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-white">
                                    {nutritionTotals.carbs.toFixed(0)}g
                                </Text>
                                <Text className="text-white/70 text-xs mt-1">Carbs</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-white">
                                    {nutritionTotals.fats.toFixed(0)}g
                                </Text>
                                <Text className="text-white/70 text-xs mt-1">Fats</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Social Stats */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="people" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">
                            Social
                        </Text>
                    </View>
                    <View className="flex-row gap-3 mb-3">
                        <StatsCard
                            icon="heart"
                            iconColor="#fff"
                            bgColor="#8B5CF6"
                            label="Total Likes"
                            value={totalLikes}
                            className="flex-1"
                        />
                        <StatsCard
                            icon="people"
                            iconColor="#fff"
                            bgColor="#F59E0B"
                            label="Followers"
                            value={followers}
                            className="flex-1"
                        />
                    </View>
                    <View className="flex-row gap-3">
                        <StatsCard
                            icon="pulse"
                            iconColor="#fff"
                            bgColor="#F43F5E"
                            label="Posts"
                            value={totalPosts}
                            className="flex-1"
                        />
                        <StatsCard
                            icon="time"
                            iconColor="#fff"
                            bgColor="#0EA5E9"
                            label="Days Active"
                            value={daysActive}
                            className="flex-1"
                        />
                    </View>
                </View>

                {/* Recent Workouts */}
                <View className="mb-6">
                    <RecentWorkouts workouts={workouts} isLoading={isLoadingWorkouts} />
                </View>

                {/* Suggested Users */}
                <View className="mb-6">
                    <SuggestedUsers
                        users={suggestedUsers}
                        isLoading={isLoadingSuggested}
                        onFollow={handleFollow}
                        onUserPress={handleUserPress}
                    />
                </View>

                {/* Bottom spacing for tab bar */}
                <View className="h-8" />
            </ScrollView>
        </SafeScreen>
    );
}
