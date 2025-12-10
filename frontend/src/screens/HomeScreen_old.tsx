import { Button } from '@/components/ui/button';
import AlertModal from '@/components/modals/AlertModal';
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials';
import { HeroParallax } from '@/components/ui/hero-parallax';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import {
    Dumbbell,
    Apple,
    Users,
    MessageCircle,
    BarChart3,
    Calendar,
    Bell,
    Target,
    Zap,
    Image as ImageIcon,
    Shield,
    TrendingUp,
    Heart,
    Award,
    Activity
} from 'lucide-react';

const HomeScreen = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const hasSeenAlert = sessionStorage.getItem('hasSeenExperimentalWarning');

        if (!hasSeenAlert) {
            setAlertVisible(true);
            sessionStorage.setItem('hasSeenExperimentalWarning', 'true');
        }
    }, []);

    // Feature showcase products for HeroParallax
    const products = [
        {
            title: "Comprehensive Workout Tracking",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "500K+ Food Database",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
        },
        {
            title: "Social Fitness Community",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Advanced Analytics",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Custom Meal Planning",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Progress Photos & Media",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Real-time Notifications",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop"
        },
        {
            title: "Personalized Goals",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop"
        },
        {
            title: "Exercise Library",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop"
        },
        {
            title: "Macro Tracking",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=2064&auto=format&fit=crop"
        },
        {
            title: "Workout Templates",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Community Feed",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Weight Progress",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Calorie Counter",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1467453678174-768ec283a940?q=80&w=2044&auto=format&fit=crop"
        },
        {
            title: "Achievement Badges",
            link: "#",
            thumbnail: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const features = [
        {
            icon: Dumbbell,
            title: "Smart Workout Logger",
            description: "Track every rep, set, and weight with our comprehensive exercise library and workout history."
        },
        {
            icon: Apple,
            title: "Nutrition Intelligence",
            description: "Access 500,000+ foods with detailed macros, create custom meal categories, and hit your targets."
        },
        {
            icon: Users,
            title: "Social Motivation",
            description: "Share progress, connect with friends, and stay inspired by a community of achievers."
        },
        {
            icon: BarChart3,
            title: "Visual Analytics",
            description: "Beautiful charts and insights to visualize your transformation and celebrate milestones."
        },
        {
            icon: Bell,
            title: "Instant Updates",
            description: "Real-time notifications keep you connected with your fitness community 24/7."
        },
        {
            icon: Target,
            title: "Goal Setting",
            description: "Define personalized objectives and track your journey with precision and clarity."
        }
    ];

    const testimonials = [
        {
            quote: "FitVerse transformed my approach to fitness. The social aspect keeps me accountable, and the nutrition tracking is incredibly detailed. Down 30 pounds and feeling amazing!",
            name: "Sarah Johnson",
            designation: "Fitness Enthusiast • Lost 30 lbs",
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
        },
        {
            quote: "Best fitness platform I've ever used. The workout logging is so intuitive, and seeing my friends' progress motivates me every day. The community here is unmatched!",
            name: "Mike Chen",
            designation: "CrossFit Athlete • 2 Years Active",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
        },
        {
            quote: "The analytics and custom meal categories changed everything for me. I can finally track my macros accurately and stay consistent with my fitness goals. Highly recommended!",
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



                        {/* Mobile App Section */}
                        <div className="text-center mb-16">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                                Download FitVerse Mobile
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <a
                                    href="#"
                                    className="transition-transform hover:scale-110 duration-300"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <img src="/app-store.png" alt="Download on the App Store" className="h-14 sm:h-16" />
                                </a>
                                <a
                                    href="#"
                                    className="transition-transform hover:scale-110 duration-300"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <img src="/google-play.png" alt="Get it on Google Play" className="h-14 sm:h-16" />
                                </a>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-white/50 mt-6">
                                Coming Soon
                            </p>
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
