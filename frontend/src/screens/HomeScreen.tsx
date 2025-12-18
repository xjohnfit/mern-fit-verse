import { Button } from '@/components/ui/button';
import AlertModal from '@/components/modals/AlertModal';
import { motion, useScroll, useTransform } from 'motion/react';
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
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

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

            <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white overflow-hidden">
                {/* Animated Background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
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
                        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-pink-500/5 to-purple-500/5 dark:from-pink-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
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
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
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
                                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-lg shadow-purple-500/30 dark:shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/50 dark:hover:shadow-purple-500/60 transition-all duration-300">
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
                                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 text-lg font-semibold rounded-full shadow-lg shadow-purple-500/30 dark:shadow-purple-500/50">
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

                        {/* Floating Cards and Mobile App Section */}
                        <motion.div
                            className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
                        >
                            {/* Left Column - Stacked Feature Cards */}
                            <div className="flex flex-col gap-6">
                                {[
                                    { icon: Dumbbell, label: "Track Workouts", color: "from-blue-500 to-cyan-500" },
                                    { icon: Apple, label: "Monitor Nutrition", color: "from-green-500 to-emerald-500" },
                                    { icon: TrendingUp, label: "See Progress", color: "from-purple-500 to-pink-500" }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                        className="p-6 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-sm dark:shadow-none transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.label}</h3>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right Column - Mobile App Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="h-full p-10 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-pink-500/30 border border-gray-400 dark:border-white/40 flex flex-col justify-center items-center text-center shadow-lg dark:shadow-xl dark:shadow-purple-500/30"
                            >
                                <div className="mb-8">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                            Take FitVerse Everywhere
                                        </span>
                                    </h2>
                                    <p className="text-lg text-gray-800 dark:text-gray-200 max-w-md mx-auto font-medium">
                                        Download our mobile app and track your fitness journey on the go
                                    </p>
                                </div>
                                <div className="">
                                    <motion.a
                                        href="#"
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => e.preventDefault()}
                                        className="block"
                                    >
                                        <img src="/app-store.png" alt="Download on App Store" className="h-20 w-full object-contain transition-shadow" />
                                    </motion.a>
                                    <motion.a
                                        href="#"
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => e.preventDefault()}
                                        className="block"
                                    >
                                        <img src="/google-play.png" alt="Get it on Google Play" className="h-20 w-full object-contain transition-shadow" />
                                    </motion.a>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-8 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                                    Coming Soon • Beta Testing
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <stat.icon className="w-8 h-8 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                                    <div className="text-4xl sm:text-5xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="relative py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    Everything You Need
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Powerful features designed to help you reach your fitness goals faster
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                        className="group relative p-8 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 shadow-sm dark:shadow-none transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300" />
                                        <div className="relative">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="relative py-20 px-4">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-grid-white/10" />
                            <div className="relative z-10">
                                <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-white">
                                    Why Choose FitVerse?
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-lg text-white">{benefit}</span>
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
                                    Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Transform?</span>
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                                    Join thousands of fitness enthusiasts achieving their goals with FitVerse
                                </p>
                                <Link to="/register">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-8 text-xl font-semibold rounded-full shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/50 hover:shadow-purple-500/50 dark:hover:shadow-purple-500/60">
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
