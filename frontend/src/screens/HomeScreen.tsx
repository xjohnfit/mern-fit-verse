import { Button } from '@/components/ui/button';
import AlertModal from '@/components/modals/AlertModal';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import {
    Dumbbell,
    Target,
    TrendingUp,
    Users,
    ArrowRight,
    Play,
    Apple,
    Bell,
    Heart,
    MessageCircle,
    BarChart3,
    Utensils,
    Calendar,
    Shield,
    Zap,
    Image,
    Cloud,
    Activity
} from 'lucide-react';

const HomeScreen = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const { isAuthenticated, userInfo } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const hasSeenAlert = sessionStorage.getItem('hasSeenExperimentalWarning');

        if (!hasSeenAlert) {
            // Show the modal for the first time visiting the home route
            setAlertVisible(true);
            // Mark that the user has now seen the alert (cleared when tab/browser closes)
            sessionStorage.setItem('hasSeenExperimentalWarning', 'true');
        }
    }, []);

    const features = [
        {
            icon: Dumbbell,
            title: "Workout Tracking",
            description: "Log workouts with comprehensive exercise library, track sets, reps, and weights with detailed history."
        },
        {
            icon: Apple,
            title: "Nutrition Tracking",
            description: "Access 500,000+ foods via FatSecret API with custom meal categories and daily calorie tracking."
        },
        {
            icon: Users,
            title: "Social Community",
            description: "Connect with fitness enthusiasts, share posts with images, follow friends, and stay motivated together."
        },
        {
            icon: TrendingUp,
            title: "Progress Analytics",
            description: "Visualize your fitness journey with interactive charts, workout stats, and nutrition insights."
        },
        {
            icon: Bell,
            title: "Real-time Notifications",
            description: "Stay updated with likes, comments, follows, and community interactions instantly."
        },
        {
            icon: Target,
            title: "Personalized Goals",
            description: "Set custom fitness objectives, track weight progress, and achieve milestones at your own pace."
        },
        {
            icon: Image,
            title: "Media Sharing",
            description: "Upload and share progress photos with Cloudinary integration for optimized image delivery."
        },
        {
            icon: Shield,
            title: "Secure Platform",
            description: "Enterprise-grade JWT authentication, encrypted passwords, and HTTP-only cookies for safety."
        }
    ];

    const testimonials = [
        {
            quote: "FitVerse combines social networking with fitness tracking perfectly. The nutrition feature with 500k+ foods is incredible! I've lost 20 pounds and gained so much confidence.",
            name: "Sarah Johnson",
            designation: "Fitness Enthusiast • Lost 20 lbs",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
        },
        {
            quote: "The workout logging is so detailed and the social feed keeps me motivated. Love seeing everyone's progress! The community here is incredibly supportive and inspiring.",
            name: "Mike Chen",
            designation: "CrossFit Athlete • 2 Years Active",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
        },
        {
            quote: "Custom meal categories and real-time notifications make this the best fitness app I've used. Highly recommended! The analytics help me track my macros perfectly.",
            name: "Emily Davis",
            designation: "Nutritionist • Marathon Runner",
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop"
        }
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

            {/* Spotlight Background Container */}
            <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-indigo-50 dark:bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
                {/* Animated Spotlight Effects */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-100/30 via-purple-100/30 to-slate-100/50 dark:bg-linear-to-br dark:from-blue-900/20 dark:via-purple-900/20 dark:to-slate-900/40"></div>

                {/* Main Spotlight */}
                {/* Main Spotlight */}
                <div className="absolute top-[-50%] left-[50%] w-[800px] h-[800px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,rgba(37,99,235,0.15)_40%,rgba(59,130,246,0.03)_70%,transparent_100%)] dark:bg-[radial-gradient(circle,rgba(59,130,246,0.5)_0%,rgba(129,140,248,0.3)_40%,rgba(59,130,246,0.08)_70%,transparent_100%)] rounded-full blur-3xl spotlight-glow"></div>

                {/* Secondary Spotlights */}
                <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,rgba(126,34,206,0.08)_50%,transparent_100%)] dark:bg-[radial-gradient(circle,rgba(147,51,234,0.35)_0%,rgba(168,85,247,0.2)_50%,transparent_100%)] rounded-full blur-2xl spotlight-secondary"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,rgba(8,145,178,0.05)_50%,transparent_100%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.25)_0%,rgba(34,211,238,0.12)_50%,transparent_100%)] rounded-full blur-2xl spotlight-tertiary"></div>

                {/* Secondary Spotlights */}
                <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,rgba(126,34,206,0.08)_50%,transparent_100%)] dark:bg-[radial-gradient(circle,rgba(147,51,234,0.25)_0%,rgba(126,34,206,0.1)_50%,transparent_100%)] rounded-full blur-2xl spotlight-secondary"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,rgba(8,145,178,0.05)_50%,transparent_100%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.2)_0%,rgba(8,145,178,0.08)_50%,transparent_100%)] rounded-full blur-2xl spotlight-tertiary"></div>

                {/* Additional floating particles */}
                <div className="absolute top-[30%] left-[80%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(192,132,252,0.25)_0%,transparent_70%)] rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-[40%] right-[85%] w-[150px] h-[150px] bg-[radial-gradient(circle,rgba(34,197,94,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(52,211,153,0.2)_0%,transparent_70%)] rounded-full blur-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}></div>

                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-60 dark:opacity-100"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                        maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)'
                    }}
                ></div>

                {/* Content Container */}
                <div className="relative z-10 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            {isAuthenticated ? (
                                <div className="flex justify-center items-center mb-6">
                                    <TypewriterEffectSmooth
                                        words={[
                                            { text: "Welcome" },
                                            { text: "back," },
                                            { text: `${userInfo?.name?.split(' ')[0]}!`, className: "text-blue-500 dark:text-blue-400" }
                                        ]}
                                        className="text-3xl md:text-5xl lg:text-7xl"
                                    />
                                </div>
                            ) : (
                                <h1 className='text-3xl md:text-5xl lg:text-7xl text-gray-900 dark:text-white font-bold inter-var mb-6 max-w-4xl mx-auto'>
                                    Welcome to FitVerse
                                </h1>
                            )}
                            <p className='text-lg md:text-xl mt-4 text-gray-700 dark:text-white/90 font-normal inter-var max-w-3xl mx-auto mb-8'>
                                {isAuthenticated
                                    ? "Track workouts, log nutrition, share your journey, and connect with a supportive fitness community—all in one place."
                                    : "Your complete social fitness platform for tracking workouts, monitoring nutrition, sharing progress, and connecting with a motivated community."
                                }
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {isAuthenticated ? (
                                    <>
                                        <Button asChild size="lg" className="bg-linear-to-r from-[#38bdf8] to-[#818cf8] hover:from-[#818cf8] hover:to-[#c084fc] text-white border-none text-lg px-8 py-4 h-auto">
                                            <Link to="/dashboard" className="flex items-center gap-2">
                                                <Dumbbell className="w-5 h-5" />
                                                Go to Dashboard
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-white/30 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white bg-transparent text-lg px-8 py-4 h-auto">
                                            <Link to={`/profile/view/${userInfo?.username}`} className="flex items-center gap-2">
                                                <Target className="w-5 h-5" />
                                                View Profile
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button asChild size="lg" className="bg-linear-to-r from-[#38bdf8] to-[#818cf8] hover:from-[#818cf8] hover:to-[#c084fc] text-white border-none text-lg px-8 py-4 h-auto">
                                            <Link to="/register" className="flex items-center gap-2">
                                                <Play className="w-5 h-5" />
                                                Start Your Journey
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="border-gray-300 dark:border-white/30 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white bg-transparent text-lg px-8 py-4 h-auto">
                                            <Link to="/login" className="flex items-center gap-2">
                                                Already have an account? Sign In
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className="feature-card rounded-xl p-6 hover:scale-105 transition-all duration-300 group">
                                        <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-lg mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-gray-800 dark:text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 dark:text-white/80 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Platform Highlights Section - New */}
                        <div className="section-card rounded-xl p-8 mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                                🌟 Platform Highlights
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-lg flex items-center justify-center">
                                        <Utensils className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">FatSecret API Integration</h4>
                                        <p className="text-gray-600 dark:text-white/70 text-sm">Access to 500,000+ verified food items with detailed nutritional information</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-[#818cf8] to-[#c084fc] rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Custom Meal Categories</h4>
                                        <p className="text-gray-600 dark:text-white/70 text-sm">Create up to 3 personalized meal categories beyond standard meals</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-[#c084fc] to-[#e879f9] rounded-lg flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Social Feed</h4>
                                        <p className="text-gray-600 dark:text-white/70 text-sm">Share posts with images, like, comment, and engage with your community</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-lg flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Workout Library</h4>
                                        <p className="text-gray-600 dark:text-white/70 text-sm">Complete exercise database with detailed logging and history tracking</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-[#818cf8] to-[#c084fc] rounded-lg flex items-center justify-center">
                                        <Cloud className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Cloudinary Integration</h4>
                                        <p className="text-gray-600 dark:text-white/70 text-sm">Optimized image storage and delivery for profile photos and posts</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-[#c084fc] to-[#e879f9] rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Visual Analytics</h4>
                                        <p className="text-gray-600 dark:text-white/70 text-sm">Interactive charts with Recharts for tracking progress and trends</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                            <div className="stat-card text-center">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">10K+</div>
                                <div className="text-gray-600 dark:text-white/70">Active Users</div>
                            </div>
                            <div className="stat-card text-center">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">50K+</div>
                                <div className="text-gray-600 dark:text-white/70">Workouts Completed</div>
                            </div>
                            <div className="stat-card text-center">
                                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
                                <div className="text-gray-600 dark:text-white/70">User Satisfaction</div>
                            </div>
                        </div>

                        {/* Testimonials Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
                                What Our Users Say
                            </h2>
                            <p className="text-center text-gray-600 dark:text-white/70 mb-8 max-w-2xl mx-auto">
                                Real stories from real members who transformed their fitness journey with FitVerse
                            </p>
                            <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
                        </div>

                        {/* Quick Start Guide for New Users */}
                        {!isAuthenticated && (
                            <div className="section-card rounded-xl p-8 mb-16">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                                    Get Started in 3 Easy Steps
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-full text-white font-bold text-2xl mb-4 mx-auto shadow-lg shadow-blue-500/30">
                                            1
                                        </div>
                                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Create Account</h3>
                                        <p className="text-gray-600 dark:text-white/70">Sign up with your email, set your profile, and join the FitVerse community</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-[#818cf8] to-[#c084fc] rounded-full text-white font-bold text-2xl mb-4 mx-auto shadow-lg shadow-purple-500/30">
                                            2
                                        </div>
                                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Track Progress</h3>
                                        <p className="text-gray-600 dark:text-white/70">Log workouts, track nutrition from 500k+ foods, and monitor your daily progress</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-16 h-16 bg-linear-to-r from-[#c084fc] to-[#e879f9] rounded-full text-white font-bold text-2xl mb-4 mx-auto shadow-lg shadow-pink-500/30">
                                            3
                                        </div>
                                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2">Connect & Share</h3>
                                        <p className="text-gray-600 dark:text-white/70">Follow friends, share your journey with photos, and stay motivated together</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features List for Authenticated Users */}
                        {isAuthenticated && (
                            <div className="section-card rounded-xl p-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                                    Your Complete Fitness Hub
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <Dumbbell className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Workout Tracking</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Log exercises, sets, reps, and weight</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <Apple className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Nutrition Database</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">500,000+ foods with FatSecret API</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <Calendar className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Custom Meal Categories</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Create up to 3 personalized categories</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <Users className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Follow System</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Connect with friends and community</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <MessageCircle className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Social Feed</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Share posts, photos, likes, and comments</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <Bell className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Real-time Notifications</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Stay updated on all interactions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <BarChart3 className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Progress Analytics</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Interactive charts and visualizations</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <Image className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Media Sharing</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Upload photos via Cloudinary</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-900 dark:text-white">
                                        <Zap className="w-5 h-5 text-[#38bdf8] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold">Dark Mode Support</p>
                                            <p className="text-sm text-gray-600 dark:text-white/70">Seamless theme switching</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default HomeScreen;
