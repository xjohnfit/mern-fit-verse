import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard,
    Heart,
    Sparkles,
    BookOpen,
} from 'lucide-react';

const Footer = () => {
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    return (
        <footer className='w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8 justify-items-center lg:justify-items-start'>
                    {/* Brand Section */}
                    <div className='col-span-1 lg:col-span-1 text-center lg:text-left'>
                        <Link
                            to='/'
                            className='inline-block mb-3 sm:mb-4 group'
                        >
                            <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300'>
                                FitVerse
                            </h2>
                        </Link>
                        <p className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 max-w-xs leading-relaxed mx-auto lg:mx-0'>
                            A modern social fitness platform where your journey meets community. Track, share, and achieve your fitness goals together.
                        </p>
                    </div>

                    {/* Categories Container - Platform, Features, Resources in a row on mobile */}
                    <div className='col-span-1 lg:col-span-3 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full text-center lg:text-left'>
                        {/* Platform Links */}
                        <div>
                            <h3 className='text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center gap-2 justify-center lg:justify-start'>
                                <LayoutDashboard className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                Platform
                            </h3>
                            <ul className='space-y-1.5 sm:space-y-2 flex flex-col items-center lg:items-start'>
                                <li>
                                    <Link
                                        to='/'
                                        className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm flex items-center gap-2 group'
                                    >
                                        Home
                                    </Link>
                                </li>
                                {isAuthenticated ? (
                                    <>
                                        <li>
                                            <Link
                                                to='/dashboard'
                                                className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm flex items-center gap-2 group'
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to='/nutrition'
                                                className='text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 text-xs sm:text-sm flex items-center gap-2 group'
                                            >
                                                Nutrition
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to='/workout'
                                                className='text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 text-xs sm:text-sm flex items-center gap-2 group'
                                            >
                                                Workout
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to='/settings'
                                                className='text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 text-xs sm:text-sm flex items-center gap-2 group'
                                            >
                                                Settings
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link
                                                to='/login'
                                                className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm'
                                            >
                                                Sign In
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to='/register'
                                                className='text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 text-xs sm:text-sm'
                                            >
                                                Get Started
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className='text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center gap-2 justify-center lg:justify-start'>
                                <Sparkles className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                Features
                            </h3>
                            <ul className='space-y-1.5 sm:space-y-2 flex flex-col items-center lg:items-start'>
                                <li>
                                    <span className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm'>
                                        Social Feed
                                    </span>
                                </li>
                                <li>
                                    <span className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm'>
                                        Nutrition Tracking
                                    </span>
                                </li>
                                <li>
                                    <span className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm'>
                                        Workout Logs
                                    </span>
                                </li>
                                <li>
                                    <span className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm'>
                                        Progress Analytics
                                    </span>
                                </li>
                                <li>
                                    <span className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm'>
                                        Community Support
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Resources & Legal */}
                        <div>
                            <h3 className='text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center gap-2 justify-center lg:justify-start'>
                                <BookOpen className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                Resources
                            </h3>
                            <ul className='space-y-1.5 sm:space-y-2 flex flex-col items-center lg:items-start'>
                                <li>
                                    <a
                                        href='https://github.com/xjohnfit/mern-fit-verse/blob/main/CONTRIBUTING.md'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm'
                                    >
                                        Contributing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='https://github.com/xjohnfit/mern-fit-verse/issues'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm'
                                    >
                                        Report Bug
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        to='/privacy-policy'
                                        className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm'
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/terms-of-service'
                                        className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-xs sm:text-sm'
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className='border-t border-gray-200 dark:border-gray-800 pt-4 sm:pt-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4'>
                        <p className='text-gray-600 dark:text-gray-400 text-[10px] xs:text-xs sm:text-sm text-center sm:text-left'>
                            © {new Date().getFullYear()} FitVerse. Built with{' '}
                            <Heart className='inline w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 fill-current' />{' '}
                            by{' '}
                            <a
                                href='https://codewithxjohn.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
                            >
                                John
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
