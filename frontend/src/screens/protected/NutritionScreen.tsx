import { UtensilsCrossed, Target, BarChart3, Camera, Star, Calendar, Users, CheckCircle } from 'lucide-react';

const NutritionScreen = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-400/10 dark:bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/10 dark:bg-teal-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 min-h-screen flex items-center justify-center">
                <div className="max-w-4xl mx-auto text-center w-full">

                    {/* Hero Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-r from-green-500 to-emerald-500 rounded-full mb-6 sm:mb-8 shadow-lg shadow-green-500/25 animate-bounce">
                        <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
                        Nutrition Hub
                    </h1>

                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-linear-to-r from-green-500 to-emerald-500 rounded-full text-white font-semibold text-base sm:text-lg mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                        <span>Coming Soon</span>
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                    </div>

                    {/* Description */}
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                        We're cooking up an incredible nutrition tracking experience! Get ready for meal planning,
                        calorie tracking, and personalized nutrition insights that will fuel your fitness goals.
                    </p>

                    {/* Features Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 px-2 sm:px-0">
                        {[
                            {
                                icon: Target,
                                title: "Macro Tracking",
                                description: "Track proteins, carbs, and fats effortlessly"
                            },
                            {
                                icon: BarChart3,
                                title: "Nutrition Analytics",
                                description: "Detailed insights into your eating habits"
                            },
                            {
                                icon: Camera,
                                title: "Food Scanner",
                                description: "Scan barcodes and log meals instantly"
                            },
                            {
                                icon: Users,
                                title: "Meal Sharing",
                                description: "Share recipes and meal plans with friends"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group w-full"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-lg mb-4 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
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
                                "Personalized meal plans based on your fitness goals",
                                "Comprehensive food database with nutritional info",
                                "Smart barcode scanning for quick meal logging",
                                "Macro and micronutrient tracking with visual charts",
                                "Recipe sharing and meal prep suggestions",
                                "Integration with popular fitness and health apps"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start gap-3 text-left">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-linear-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-2xl p-4 sm:p-8 border border-green-200/50 dark:border-green-700/50 mx-2 sm:mx-0">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Launch Timeline</h3>
                        </div>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4">
                            We're perfecting the nutrition experience to help you reach your goals. Expected launch:
                        </p>
                        <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                            Q1 2026
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NutritionScreen;