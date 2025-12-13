import { ScrollView, Text, View, RefreshControl, StatusBar, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppSelector } from "../../hooks/useRedux";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import StatsCard from "@/components/dashboard/StatsCard";
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
            const result = await followUnfollowUser(username).unwrap();
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
        <View className="flex-1 bg-white dark:bg-gray-900">
            <StatusBar barStyle="light-content" />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Gradient Header */}
                <LinearGradient
                    colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingHorizontal: 20, paddingBottom: 24 }}
                >
                    <View style={{ paddingTop: insets.top + 16, paddingBottom: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: 56,
                                height: 56,
                                borderRadius: 18,
                                overflow: 'hidden',
                                marginRight: 14,
                                elevation: 4,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                            }}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Ionicons name="home" size={32} color="#fff" />
                                </LinearGradient>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    letterSpacing: 0.5,
                                }}>
                                    Home
                                </Text>
                                <Text style={{
                                    fontSize: 15,
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    marginTop: 4,
                                    fontWeight: '500',
                                }}>
                                    Welcome back, {userInfo?.name || userInfo?.username || "User"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Content Container */}
                <View className="py-6 px-2">

                {/* Nutrition Overview */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="nutrition" size={20} color="#8B5CF6" style={{ marginRight: 8 }} />
                        <Text className="text-xl font-bold text-gray-900 dark:text-white">
                            Today&apos;s Nutrition
                        </Text>
                    </View>
                    <LinearGradient
                        colors={['#3B82F6', '#8B5CF6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 16, padding: 20 }}
                    >
                        {/* Calorie Goal and Progress */}
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="flame" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Calories
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' }}>
                                    {nutritionTotals.calories.toFixed(0)} <Text style={{ fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>/ {nutritionGoals.calories || 2000}</Text>
                                </Text>
                            </View>
                            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' }}>
                                <View style={{ height: '100%', width: `${calorieProgress}%`, backgroundColor: '#FFFFFF', borderRadius: 4 }} />
                            </View>
                        </View>

                        {/* Macros */}
                        <View className="flex-row justify-around items-center">
                            <View className="items-center">
                                <Ionicons name="fitness" size={16} color="rgba(255,255,255,0.9)" style={{ marginBottom: 4 }} />
                                <Text className="text-2xl font-bold text-white">
                                    {nutritionTotals.protein.toFixed(0)}g
                                </Text>
                                <Text className="text-white/80 text-xs mt-1">Protein</Text>
                                <Text className="text-white/60 text-xs">/ {nutritionGoals.protein || 150}g</Text>
                            </View>
                            <View className="items-center">
                                <Ionicons name="flash" size={16} color="rgba(255,255,255,0.9)" style={{ marginBottom: 4 }} />
                                <Text className="text-2xl font-bold text-white">
                                    {nutritionTotals.carbs.toFixed(0)}g
                                </Text>
                                <Text className="text-white/80 text-xs mt-1">Carbs</Text>
                                <Text className="text-white/60 text-xs">/ {nutritionGoals.carbs || 200}g</Text>
                            </View>
                            <View className="items-center">
                                <Ionicons name="water" size={16} color="rgba(255,255,255,0.9)" style={{ marginBottom: 4 }} />
                                <Text className="text-2xl font-bold text-white">
                                    {nutritionTotals.fats.toFixed(0)}g
                                </Text>
                                <Text className="text-white/80 text-xs mt-1">Fats</Text>
                                <Text className="text-white/60 text-xs">/ {nutritionGoals.fats || 65}g</Text>
                            </View>
                        </View>
                    </LinearGradient>
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

                {/* Recent Workouts */}
                <View className="mb-6">
                    <RecentWorkouts workouts={workouts} isLoading={isLoadingWorkouts} />
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
                </View>
            </ScrollView>
        </View>
    );
}
