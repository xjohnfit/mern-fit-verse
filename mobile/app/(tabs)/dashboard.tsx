// React
import { useState } from "react";

// React Native
import { ScrollView, View, RefreshControl, StatusBar, useColorScheme } from "react-native";

// Expo
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Third-party libraries
import Toast from "react-native-toast-message";

// Hooks
import { useAppSelector } from "../../hooks/useRedux";

// API Slices
import { useGetWorkoutStatsQuery, useGetWorkoutsQuery } from "../../slices/workoutApiSlice";
import { useGetDailyNutritionQuery } from "../../slices/nutritionApiSlice";
import { useGetUserProfileQuery, useGetSuggestedUsersQuery, useFollowUnfollowUserMutation } from "../../slices/usersApiSlice";
import { useGetPostsQuery } from "../../slices/postsApiSlice";

// Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NutritionOverview from "@/components/dashboard/NutritionOverview";
import WorkoutStats from "@/components/dashboard/WorkoutStats";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import SocialStats from "@/components/dashboard/SocialStats";
import SuggestedUsers from "@/components/dashboard/SuggestedUsers";

// Styles
import dashboardStyles from "../../styles/dashboard/dashboardStyles";

export default function HomeScreen() {
    const { userInfo } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

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
            await followUnfollowUser(username).unwrap();
            refetchSuggested();
            refetchProfile();
        } catch (error: any) {
            console.error('Failed to follow user:', error);
            Toast.show({
                type: 'error',
                text1: 'Follow Failed',
                text2: error?.data?.message || 'Failed to follow user',
            });
        }
    };

    const handleUserPress = (username: string) => {
        router.push({
            pathname: '/(tabs)/profile',
            params: { username }
        });
    };

    // Calculate metrics
    const nutritionTotals = {
        calories: nutritionData?.data?.totals?.calories || 0,
        protein: nutritionData?.data?.totals?.protein || 0,
        carbs: nutritionData?.data?.totals?.carbs || 0,
        fats: nutritionData?.data?.totals?.fats || 0,
    };

    const nutritionGoals = currentUserProfile?.nutritionGoals || {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 65,
    };

    const calorieProgress = nutritionGoals.calories > 0
        ? Math.min((nutritionTotals.calories / nutritionGoals.calories) * 100, 100)
        : 0;

    const totalPosts = feedPosts?.length || 0;
    const totalLikes = feedPosts?.reduce((sum: number, post: any) => sum + (post.likes?.length || 0), 0) || 0;
    const followers = currentUserProfile?.followers?.length || 0;
    const following = currentUserProfile?.following?.length || 0;
    const joinDate = currentUserProfile?.createdAt ? new Date(currentUserProfile.createdAt) : new Date();
    const daysActive = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <View style={isDark ? dashboardStyles.containerDark : dashboardStyles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                style={dashboardStyles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Gradient Header */}
                <DashboardHeader
                    userName={userInfo?.name || userInfo?.username || "User"}
                    topInset={insets.top}
                />

                {/* Content Container */}
                <View style={dashboardStyles.contentContainer}>

                    {/* Nutrition Overview */}
                    <NutritionOverview
                        nutritionTotals={nutritionTotals}
                        nutritionGoals={nutritionGoals}
                    />

                    {/* Workout Stats */}
                    <WorkoutStats
                        workoutStats={workoutStats}
                        daysActive={daysActive}
                    />

                    {/* Recent Workouts */}
                    <View style={dashboardStyles.section}>
                        <RecentWorkouts workouts={workouts} isLoading={isLoadingWorkouts} />
                    </View>

                    {/* Social Stats */}
                    <SocialStats
                        totalLikes={totalLikes}
                        followers={followers}
                        totalPosts={totalPosts}
                        daysActive={daysActive}
                    />

                    {/* Suggested Users */}
                    <View style={dashboardStyles.section}>
                        <SuggestedUsers
                            users={suggestedUsers}
                            isLoading={isLoadingSuggested}
                            onFollow={handleFollow}
                            onUserPress={handleUserPress}
                        />
                    </View>

                    {/* Bottom spacing for tab bar */}
                    <View style={dashboardStyles.bottomSpacer} />
                </View>
            </ScrollView>
        </View>
    );
}
