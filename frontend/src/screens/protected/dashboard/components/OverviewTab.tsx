// Icons
import {
    Activity,
    Apple,
    Users,
    TrendingUp,
    Dumbbell,
    Calendar,
    Clock,
    Award,
    BarChart3,
    Heart
} from "lucide-react";

// UI Components
import { WobbleCard } from "@/components/ui/wobble-card";

interface OverviewTabProps {
    userInfo: any;
    workoutStats: any;
    nutritionTotals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    followers: number;
    following: number;
    daysActive: number;
}

export const OverviewTab = ({
    userInfo,
    workoutStats,
    nutritionTotals,
    totalPosts,
    totalLikes,
    totalComments,
    followers,
    following,
    daysActive
}: OverviewTabProps) => {
    return (
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
                <WobbleCard
                    containerClassName="bg-linear-to-br from-indigo-600 to-purple-600"
                    className="py-6 sm:py-10 md:py-20"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-2 sm:gap-4">
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                                    {nutritionTotals.calories.toFixed(0)}
                                </p>
                                <p className="text-white/70 text-xs sm:text-sm">Calories</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                                    {nutritionTotals.protein.toFixed(0)}g
                                </p>
                                <p className="text-white/70 text-xs sm:text-sm">Protein</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                                    {nutritionTotals.carbs.toFixed(0)}g
                                </p>
                                <p className="text-white/70 text-xs sm:text-sm">Carbs</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                                    {nutritionTotals.fats.toFixed(0)}g
                                </p>
                                <p className="text-white/70 text-xs sm:text-sm">Fats</p>
                            </div>
                        </div>
                    </div>
                </WobbleCard>
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
    );
};
