import { Button } from '@/components/ui/button';
import AlertModal from '@/components/AlertModal';
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
    Star,
    CheckCircle
} from 'lucide-react';

const HomeScreen = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const { isAuthenticated, userInfo } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const hasSeenAlert = localStorage.getItem('hasSeenExperimentalWarning');

        if (!hasSeenAlert) {
            // Show the modal for the first time visiting the home route
            setAlertVisible(true);
            // Mark that the user has now seen the alert
            localStorage.setItem('hasSeenExperimentalWarning', 'true');
        }
    }, []);

    const features = [
        {
            icon: Dumbbell,
            title: "Workout Tracking",
            description: "Log your workouts, track sets, reps, and weights with our intuitive interface."
        },
        {
            icon: Target,
            title: "Goal Setting",
            description: "Set personalized fitness goals and track your progress towards achieving them."
        },
        {
            icon: TrendingUp,
            title: "Progress Analytics",
            description: "Visualize your fitness journey with detailed charts and performance metrics."
        },
        {
            icon: Users,
            title: "Community Support",
            description: "Connect with like-minded fitness enthusiasts and share your achievements."
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            comment: "FitVerse transformed my fitness routine. I've never been more motivated!",
            rating: 5
        },
        {
            name: "Mike Chen",
            comment: "The progress tracking features are amazing. I can see my improvements daily.",
            rating: 5
        },
        {
            name: "Emily Davis",
            comment: "User-friendly interface and great workout suggestions. Highly recommended!",
            rating: 5
        }
    ];

    return (
        <>
            {alertVisible && <AlertModal setAlertVisible={setAlertVisible} />}

            {/* Spotlight Background Container */}
            <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
                {/* Animated Spotlight Effects */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/20 via-purple-900/20 to-slate-900/40"></div>

                {/* Main Spotlight */}
                <div className="absolute top-[-50%] left-[50%] w-[800px] h-[800px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(59,130,246,0.4)_0%,rgba(37,99,235,0.2)_40%,rgba(59,130,246,0.05)_70%,transparent_100%)] rounded-full blur-3xl spotlight-glow"></div>

                {/* Secondary Spotlights */}
                <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(147,51,234,0.25)_0%,rgba(126,34,206,0.1)_50%,transparent_100%)] rounded-full blur-2xl spotlight-secondary"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.2)_0%,rgba(8,145,178,0.08)_50%,transparent_100%)] rounded-full blur-2xl spotlight-tertiary"></div>

                {/* Additional floating particles */}
                <div className="absolute top-[30%] left-[80%] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-[40%] right-[85%] w-[150px] h-[150px] bg-[radial-gradient(circle,rgba(34,197,94,0.1)_0%,transparent_70%)] rounded-full blur-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}></div>

                {/* Grid Pattern Overlay */}
                <div
                    className="absolute inset-0"
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
                            <h1 className='text-3xl md:text-5xl lg:text-7xl text-white font-bold inter-var mb-6 max-w-4xl mx-auto'>
                                {isAuthenticated ? `Welcome back, ${userInfo?.name?.split(' ')[0]}!` : 'Welcome to FitVerse'}
                            </h1>
                            <p className='text-lg md:text-xl mt-4 text-white/90 font-normal inter-var max-w-3xl mx-auto mb-8'>
                                Your ultimate fitness companion for tracking workouts, monitoring progress, and achieving your health goals.
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
                                        <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent text-lg px-8 py-4 h-auto">
                                            <Link to="/profile" className="flex items-center gap-2">
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
                                        <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent text-lg px-8 py-4 h-auto">
                                            <Link to="/login" className="flex items-center gap-2">
                                                Already have an account? Sign In
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className="glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 group">
                                        <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-lg mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                        <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
                                <div className="text-white/70">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                                <div className="text-white/70">Workouts Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
                                <div className="text-white/70">User Satisfaction</div>
                            </div>
                        </div>

                        {/* Testimonials Section */}
                        {!isAuthenticated && (
                            <div className="mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                                    What Our Users Say
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {testimonials.map((testimonial, index) => (
                                        <div key={index} className="glass-card rounded-xl p-6 transition-all duration-300 hover:scale-105">
                                            <div className="flex items-center gap-1 mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-[#38bdf8] text-[#38bdf8]" />
                                                ))}
                                            </div>
                                            <p className="text-white/80 mb-4 italic">"{testimonial.comment}"</p>
                                            <div className="text-white font-semibold">{testimonial.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Start Guide for New Users */}
                        {!isAuthenticated && (
                            <div className="glass-card rounded-xl p-8 mb-16">
                                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                                    Get Started in 3 Easy Steps
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-[#38bdf8] to-[#818cf8] rounded-full text-white font-bold text-xl mb-4 mx-auto">
                                            1
                                        </div>
                                        <h3 className="text-white font-semibold text-lg mb-2">Sign Up</h3>
                                        <p className="text-white/70">Create your free FitVerse account in seconds</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-[#818cf8] to-[#c084fc] rounded-full text-white font-bold text-xl mb-4 mx-auto">
                                            2
                                        </div>
                                        <h3 className="text-white font-semibold text-lg mb-2">Set Goals</h3>
                                        <p className="text-white/70">Define your fitness objectives and preferences</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-[#c084fc] to-[#e879f9] rounded-full text-white font-bold text-xl mb-4 mx-auto">
                                            3
                                        </div>
                                        <h3 className="text-white font-semibold text-lg mb-2">Start Training</h3>
                                        <p className="text-white/70">Begin your fitness journey with personalized workouts</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features List for Authenticated Users */}
                        {isAuthenticated && (
                            <div className="glass-card rounded-xl p-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                                    Your Fitness Hub Awaits
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle className="w-5 h-5 text-[#38bdf8]" />
                                        <span>Track your daily workouts and exercises</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle className="w-5 h-5 text-[#38bdf8]" />
                                        <span>Monitor your fitness progress over time</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle className="w-5 h-5 text-[#38bdf8]" />
                                        <span>Set and achieve personalized goals</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white">
                                        <CheckCircle className="w-5 h-5 text-[#38bdf8]" />
                                        <span>Access your data from anywhere</span>
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
