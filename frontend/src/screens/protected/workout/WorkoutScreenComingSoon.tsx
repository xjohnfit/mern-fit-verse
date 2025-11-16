import { Dumbbell, Target, TrendingUp, Clock, Star, Calendar, Users, CheckCircle } from 'lucide-react';

const WorkoutScreen = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 min-h-screen flex items-center justify-center">
                <div className="max-w-4xl mx-auto text-center w-full">

                    {/* Hero Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-full mb-6 sm:mb-8 shadow-lg shadow-blue-500/25 animate-bounce">
                        <Dumbbell className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
                        Workout Hub
                    </h1>

                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-full text-white font-semibold text-base sm:text-lg mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                        <span>Coming Soon</span>
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                    </div>

                    {/* Description */}
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                        We're crafting an amazing workout experience for you! Get ready for personalized training plans,
                        exercise tracking, and progress analytics that will transform your fitness journey.
                    </p>

                    {/* Features Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 px-2 sm:px-0">
                        {[
                            {
                                icon: Target,
                                title: "Smart Goals",
                                description: "AI-powered goal setting and tracking"
                            },
                            {
                                icon: TrendingUp,
                                title: "Progress Analytics",
                                description: "Detailed workout performance metrics"
                            },
                            {
                                icon: Clock,
                                title: "Workout Timer",
                                description: "Built-in rest and exercise timers"
                            },
                            {
                                icon: Users,
                                title: "Community",
                                description: "Share workouts with friends"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group w-full"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-lg mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* What to Expect */}
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl mb-8 sm:mb-12 mx-2 sm:mx-0">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">What to Expect</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {[
                                "Personalized workout plans based on your goals",
                                "Exercise library with detailed instructions and videos",
                                "Real-time form feedback and suggestions",
                                "Progress tracking with visual analytics",
                                "Social features to connect with workout buddies",
                                "Integration with popular fitness devices"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start gap-3 text-left">
                                    <CheckCircle className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-linear-to-r from-[#38bdf8]/10 to-[#818cf8]/10 dark:from-[#38bdf8]/20 dark:to-[#818cf8]/20 rounded-2xl p-4 sm:p-8 border border-blue-200/50 dark:border-blue-700/50 mx-2 sm:mx-0">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#38bdf8]" />
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Launch Timeline</h3>
                        </div>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4">
                            We're working hard to bring you the best workout experience. Expected launch:
                        </p>
                        <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                            Q1 2026
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkoutScreen;