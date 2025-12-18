import { Button } from '@/components/ui/button';
import AlertModal from '@/components/modals/AlertModal';
import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import {
    Dumbbell,
    Apple,
    Users,
    BarChart3,
    Target,
    Zap,
    TrendingUp,
    Award,
    Sparkles,
    ArrowRight,
    Check,
    Play
} from 'lucide-react';

const HomeScreen = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const heroRef = useRef(null);

    useEffect(() => {
        const hasSeenAlert = sessionStorage.getItem('hasSeenExperimentalWarning');

        if (!hasSeenAlert) {
            setAlertVisible(true);
            sessionStorage.setItem('hasSeenExperimentalWarning', 'true');
        }
    }, []);

    const features = [
        {
            icon: Dumbbell,
            title: "Smart Workout Tracking",
            description: "Log exercises with precision. Track sets, reps, weight, and progress over time.",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: Apple,
            title: "Nutrition Database",
            description: "Access 500,000+ foods. Track macros, calories, and hit your nutrition goals.",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: BarChart3,
            title: "Progress Analytics",
            description: "Visualize your transformation with beautiful charts and insights.",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: Users,
            title: "Social Community",
            description: "Connect with friends, share progress, and stay motivated together.",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: Target,
            title: "Goal Setting",
            description: "Set personalized goals and track your journey to success.",
            gradient: "from-indigo-500 to-blue-500"
        },
        {
            icon: Zap,
            title: "Real-time Sync",
            description: "All your data synced instantly across all devices.",
            gradient: "from-yellow-500 to-orange-500"
        }
    ];

    const stats = [
        { value: "10K+", label: "Active Users", icon: Users },
        { value: "500K+", label: "Foods Tracked", icon: Apple },
        { value: "100K+", label: "Workouts Logged", icon: Dumbbell },
        { value: "95%", label: "Satisfaction", icon: Award }
    ];

    const benefits = [
        "500,000+ food database",
        "Custom workout templates",
        "Progress photos & tracking",
        "Social community features",
        "Real-time notifications",
        "Cross-device sync"
    ];

    return (
        <>
            <AlertModal
                isOpen={alertVisible}
                onClose={() => setAlertVisible(false)}
                title="Welcome to FitVerse!"
                message="FitVerse is currently in an experimental phase. While we strive to provide a seamless experience, you may encounter occasional bugs or incomplete features. We appreciate your understanding and encourage you to provide feedback to help us improve!"
                variant="info"
                showCancel={false}
            />

            <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white overflow-hidden">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-l from-pink-500/5 to-purple-500/5 dark:from-pink-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [0, -90, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Hero Section */}
                <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 py-20">
                    <div className="max-w-7xl mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 mb-8"
                            >
                                <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-white">Your Complete Fitness Platform</span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
                            >
                                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    Transform Your
                                </span>
                                <br />
                                <span className="text-gray-900 dark:text-white">Fitness Journey</span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
                            >
                                Track workouts, monitor nutrition, connect with friends, and achieve your goals with the most comprehensive fitness platform.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            >
                                {!isAuthenticated ? (
                                    <>
                                        <Link to="/register">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-lg shadow-purple-500/30 dark:shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/50 dark:hover:shadow-purple-500/60 transition-all duration-300">
                                                    Start Free Today
                                                    <ArrowRight className="ml-2 w-5 h-5" />
                                                </Button>
                                            </motion.div>
                                        </Link>
                                        <Link to="/login">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button size="lg" variant="outline" className="border-2 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 backdrop-blur-sm px-10 py-7 text-lg font-semibold rounded-full">
                                                    Sign In
                                                </Button>
                                            </motion.div>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/dashboard">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-lg shadow-purple-500/30 dark:shadow-purple-500/50">
                                                    Go to Dashboard
                                                    <ArrowRight className="ml-2 w-5 h-5" />
                                                </Button>
                                            </motion.div>
                                        </Link>
                                        <Link to="/workout">
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button size="lg" variant="outline" className="border-2 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 px-10 py-7 text-lg font-semibold rounded-full">
                                                    Start Workout
                                                    <Play className="ml-2 w-5 h-5" />
                                                </Button>
                                            </motion.div>
                                        </Link>
                                    </>
                                )}
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span>First year free</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span>No Credit Card</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span>10K+ Active Users</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Quick Features Grid */}
                        <motion.div
                            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {[
                                { icon: Dumbbell, label: "Track Workouts", color: "from-blue-500 to-cyan-500", desc: "Log every rep & set" },
                                { icon: Apple, label: "Monitor Nutrition", color: "from-green-500 to-emerald-500", desc: "500K+ food database" },
                                { icon: TrendingUp, label: "See Progress", color: "from-purple-500 to-pink-500", desc: "Visual analytics" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="group p-5 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-500/20 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <item.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{item.label}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Mobile App CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="mt-6 p-8 rounded-3xl bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border-2 border-blue-200 dark:border-blue-400/40 relative overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-blue-500/20"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-purple-400/20 to-pink-400/20 dark:from-purple-400/10 dark:to-pink-400/10 rounded-full blur-3xl" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex-1 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/30 border border-blue-300 dark:border-blue-400/50 mb-3">
                                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">COMING SOON</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                        <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                            FitVerse Mobile App
                                        </span>
                                    </h3>
                                    <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                                        Track your fitness journey on the go with our powerful mobile app
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                        <motion.a
                                            href="#"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => e.preventDefault()}
                                            className="inline-block"
                                        >
                                            <img src="/app-store.png" alt="Download on App Store" className="h-12 object-contain" />
                                        </motion.a>
                                        <motion.a
                                            href="#"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => e.preventDefault()}
                                            className="inline-block"
                                        >
                                            <img src="/google-play.png" alt="Get it on Google Play" className="h-12 object-contain" />
                                        </motion.a>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                                        <Sparkles className="w-12 h-12 text-white animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative py-24 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="group relative p-8 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-center hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-500/20 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300" />
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <stat.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="text-5xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative py-24 px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                                <span className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    Everything You Need
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Powerful features designed to help you reach your fitness goals faster
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.08 }}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="group relative p-6 rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-500/20 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300" />
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="relative py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative p-10 md:p-14 rounded-3xl bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden shadow-2xl"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="text-center mb-10">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4"
                                    >
                                        <Award className="w-5 h-5 text-white" />
                                        <span className="text-sm font-bold text-white uppercase tracking-wider">Premium Features</span>
                                    </motion.div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white">
                                        Why Choose FitVerse?
                                    </h2>
                                    <p className="text-lg text-white/90 max-w-2xl mx-auto">
                                        Everything you need in one powerful platform
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.08 }}
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                                <Check className="w-5 h-5 text-white font-bold" />
                                            </div>
                                            <span className="text-base font-medium text-white">{benefit}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Final CTA */}
                {!isAuthenticated && (
                    <section className="relative py-32 px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                                    Ready to <span className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Transform?</span>
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                                    Join thousands of fitness enthusiasts achieving their goals with FitVerse
                                </p>
                                <Link to="/register">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-8 text-xl font-semibold rounded-full shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50 hover:shadow-purple-500/50 dark:hover:shadow-purple-500/60">
                                            Start Your Journey Free
                                            <ArrowRight className="ml-2 w-6 h-6" />
                                        </Button>
                                    </motion.div>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-500 mt-6 text-sm">
                                    No credit card required • Free forever
                                </p>
                            </motion.div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default HomeScreen;
