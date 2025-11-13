import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/slices/usersApiSlice';
import { clearCredentials } from '@/slices/authSlice';
import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Menu, X, LayoutDashboard, UtensilsCrossed, Dumbbell, Settings, Home, Search } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';

function Header() {
    const { isAuthenticated, userInfo } = useSelector(
        (state: any) => state.auth
    );
    const [logoutApiCall] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(clearCredentials());
            toast.success('Logged out successfully');
            navigate('/');
            setIsMobileMenuOpen(false);
        } catch (err: string | any) {
            toast.error(
                `Logout failed: ${err?.data?.message || err?.message || 'Unknown error'
                }`
            );
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const avatar = userInfo ? (
        <Avatar className='w-10 h-10 ring-2 ring-blue-500/20 dark:ring-blue-400/30 transition-all duration-300 hover:ring-blue-500/40 dark:hover:ring-blue-400/50'>
            <AvatarImage src={userInfo.photo} alt={userInfo.name} />
            <AvatarFallback className='bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm'>
                {getInitials(userInfo.name)}
            </AvatarFallback>
        </Avatar>
    ) : null;

    return (
        <>
            <header className='sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        {/* Logo Section */}
                        <Link to='/' className='flex items-center space-x-3 group shrink-0'>
                            <div className='relative'>
                                <div className='w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-105'>
                                    <img
                                        src='/fit-verse-logo-no-bg.png'
                                        alt='FitVerse Logo'
                                        className='w-full h-full object-contain'
                                    />
                                </div>
                            </div>
                            <div className='hidden sm:block'>
                                <h1 className='text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent'>
                                    FitVerse
                                </h1>
                                <p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
                                    Transform Your Journey
                                </p>
                            </div>
                        </Link>

                        {/* Search Bar - Desktop Only */}
                        <div className='hidden lg:flex flex-1 max-w-md mx-8 justify-end'>
                            <div className='relative w-full max-w-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Search className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                                </div>
                                <input
                                    type='text'
                                    placeholder='Search users, workouts, nutrition...'
                                    className='w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200'
                                />
                            </div>
                        </div>

                        {/* Mobile Search Bar */}
                        <div className='flex-1 mx-4 lg:hidden'>
                            <div className='relative max-w-sm'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Search className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                                </div>
                                <input
                                    type='text'
                                    placeholder='Search...'
                                    className='w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200'
                                />
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className='hidden lg:flex items-center space-x-1'>
                            {isAuthenticated ? (
                                <div className='flex items-center space-x-1'>
                                    <Link
                                        to='/dashboard'
                                        className='flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium group'
                                    >
                                        <LayoutDashboard className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
                                        <span>Dashboard</span>
                                    </Link>

                                    <Link
                                        to={`/profile/view/${userInfo?.username}`}
                                        className='flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 font-medium group'
                                    >
                                        <User className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
                                        <span>Profile</span>
                                    </Link>

                                    <Link
                                        to='/food'
                                        className='flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 font-medium group'
                                    >
                                        <UtensilsCrossed className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
                                        <span>Nutrition</span>
                                    </Link>

                                    <Link
                                        to='/workout'
                                        className='flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 font-medium group'
                                    >
                                        <Dumbbell className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
                                        <span>Workout</span>
                                    </Link>

                                    {/* User Menu */}
                                    <NavigationMenu>
                                        <NavigationMenuList>
                                            <NavigationMenuItem>
                                                <NavigationMenuTrigger className='h-auto p-2 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-lg hover:scale-105 rounded-xl border-0 transition-all duration-300 ease-in-out'>
                                                    {avatar}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent className='min-w-60 p-2'>
                                                    <div className='space-y-1'>
                                                        <div className='px-3 py-2 border-b border-gray-200 dark:border-gray-700'>
                                                            <p className='font-semibold text-gray-900 dark:text-gray-100'>
                                                                {userInfo?.name}
                                                            </p>
                                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                                {userInfo?.email}
                                                            </p>
                                                        </div>

                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                to='/profile'
                                                                className='flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group'
                                                            >
                                                                <Settings className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
                                                                <span className='font-medium'>Settings</span>
                                                            </Link>
                                                        </NavigationMenuLink>

                                                        <NavigationMenuLink asChild>
                                                            <button
                                                                onClick={logoutHandler}
                                                                className='flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group'
                                                            >
                                                                <LogOut className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' />
                                                                <span className='font-medium'>Sign Out</span>
                                                            </button>
                                                        </NavigationMenuLink>
                                                    </div>
                                                </NavigationMenuContent>
                                            </NavigationMenuItem>
                                        </NavigationMenuList>
                                    </NavigationMenu>

                                    <div className='ml-3 pl-3 border-l border-gray-300 dark:border-gray-600'>
                                        <ThemeToggle />
                                    </div>
                                </div>
                            ) : (
                                <div className='flex items-center space-x-3'>
                                    <Link
                                        to='/'
                                        className='flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium'
                                    >
                                        <Home className='w-4 h-4' />
                                        <span>Home</span>
                                    </Link>

                                    <Link
                                        to='/login'
                                        className='px-4 py-2 rounded-xl text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium'
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        to='/register'
                                        className='px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
                                    >
                                        Get Started
                                    </Link>

                                    <div className='ml-3 pl-3 border-l border-gray-300 dark:border-gray-600'>
                                        <ThemeToggle />
                                    </div>
                                </div>
                            )}
                        </nav>

                        {/* Mobile Navigation Toggle */}
                        <div className='lg:hidden flex items-center space-x-3'>
                            <ThemeToggle />
                            <button
                                onClick={toggleMobileMenu}
                                className='p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'
                            >
                                {isMobileMenuOpen ? (
                                    <X className='w-6 h-6' />
                                ) : (
                                    <Menu className='w-6 h-6' />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className='lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm'
                        onClick={closeMobileMenu}
                    />

                    <div className='lg:hidden fixed top-16 right-4 left-4 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 max-h-[calc(100vh-6rem)] overflow-y-auto'>
                        <div className='p-6'>
                            {isAuthenticated ? (
                                <div className='space-y-6'>
                                    {/* User Info Card */}
                                    <div className='flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl'>
                                        {avatar}
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-semibold text-gray-900 dark:text-gray-100 truncate'>
                                                {userInfo?.name}
                                            </p>
                                            <p className='text-sm text-gray-600 dark:text-gray-400 truncate'>
                                                {userInfo?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <nav className='space-y-2'>
                                        <Link
                                            to='/dashboard'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-3 w-full p-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group'
                                        >
                                            <LayoutDashboard className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
                                            <span className='font-medium'>Dashboard</span>
                                        </Link>

                                        <Link
                                            to={`/profile/view/${userInfo?.username}`}
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-3 w-full p-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-200 group'
                                        >
                                            <User className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
                                            <span className='font-medium'>My Profile</span>
                                        </Link>

                                        <Link
                                            to='/food'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-3 w-full p-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200 group'
                                        >
                                            <UtensilsCrossed className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
                                            <span className='font-medium'>Nutrition</span>
                                        </Link>

                                        <Link
                                            to='/workout'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-3 w-full p-3 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-200 group'
                                        >
                                            <Dumbbell className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
                                            <span className='font-medium'>Workout</span>
                                        </Link>

                                        <Link
                                            to='/profile'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-3 w-full p-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group'
                                        >
                                            <Settings className='w-5 h-5 group-hover:scale-110 transition-transform duration-200' />
                                            <span className='font-medium'>Settings</span>
                                        </Link>
                                    </nav>

                                    {/* Logout Button */}
                                    <button
                                        onClick={logoutHandler}
                                        className='flex items-center justify-center space-x-2 w-full p-3 text-white bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
                                    >
                                        <LogOut className='w-5 h-5' />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    <Link
                                        to='/'
                                        onClick={closeMobileMenu}
                                        className='flex items-center space-x-3 w-full p-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200'
                                    >
                                        <Home className='w-5 h-5' />
                                        <span className='font-medium'>Home</span>
                                    </Link>

                                    <Link
                                        to='/login'
                                        onClick={closeMobileMenu}
                                        className='block w-full text-center px-4 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl font-medium transition-all duration-200'
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        to='/register'
                                        onClick={closeMobileMenu}
                                        className='block w-full text-center px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200'
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Header;