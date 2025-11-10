import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/slices/usersApiSlice';
import { clearCredentials } from '@/slices/authSlice';
import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Menu, X, LayoutDashboard, UtensilsCrossed, Dumbbell } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { toast } from 'sonner';

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
            setIsMobileMenuOpen(false); // Close mobile menu after logout
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

    const avatar = userInfo ? (
        <Avatar className='ml-2'>
            <AvatarImage src={userInfo.photo} />
            <AvatarFallback className='bg-gray-600'>
                {userInfo.name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    ) : null;

    return (
        <>
            <header className='w-screen bg-gray-800 text-white p-2 z-20 relative border-[#38bdf8] shadow-[0_0_10px_#38bdf8,0_0_20px_#818cf8,0_0_30px_#c084fc,0_0_40px_#e879f9,0_0_50px_#22d3ee] hover:shadow-[0_0_15px_#38bdf8,0_0_30px_#818cf8,0_0_45px_#c084fc,0_0_60px_#e879f9,0_0_75px_#22d3ee] transition-all duration-300'>
                <div className='container mx-auto flex justify-between items-center'>
                    <Link to='/' className='flex items-center gap-3'>
                        <img
                            src='/fit-verse-logo-no-bg.png'
                            alt='FitVerse Logo'
                            className='w-20 h-20 object-contain'
                        />
                        <div className='flex flex-col'>
                            <h1 className='text-2xl font-bold'>FitVerse</h1>
                            <p className='text-sm text-gray-300 font-light mt-1'>Your all-in-one fitness app</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden lg:flex space-x-6'>
                        {isAuthenticated ? (
                            <div className='flex items-center gap-5'>
                                <NavigationMenu className='dark' viewport={false}>
                                    <NavigationMenuList className='flex flex-wrap gap-5'>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className={`${navigationMenuTriggerStyle()} bg-gray-700 text-white hover:bg-gray-700/80 hover:shadow-md hover:text-white focus:bg-gray-600 focus:text-white data-active:bg-gray-700 data-[state=open]:bg-gray-700 transition-all duration-300 ease-in-out`}>
                                                <Link to='/dashboard'>Dashboard</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className={`${navigationMenuTriggerStyle()} bg-gray-700 text-white hover:bg-gray-700/80 hover:shadow-md hover:text-white focus:bg-gray-600 focus:text-white data-active:bg-gray-700 data-[state=open]:bg-gray-700 transition-all duration-300 ease-in-out`}>
                                                <Link to={`/profile/view/${userInfo?.username}`}>My Profile</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className={`${navigationMenuTriggerStyle()} bg-gray-700 text-white hover:bg-gray-700/80 hover:shadow-md hover:text-white focus:bg-gray-600 focus:text-white data-active:bg-gray-700 data-[state=open]:bg-gray-700 transition-all duration-300 ease-in-out`}>
                                                <Link to='/food'>Food</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                asChild
                                                className={`${navigationMenuTriggerStyle()} bg-gray-700 text-white hover:bg-gray-700/80 hover:shadow-md hover:text-white focus:bg-gray-600 focus:text-white data-active:bg-gray-700 data-[state=open]:bg-gray-700 transition-all duration-300 ease-in-out`}>
                                                <Link to='/workout'>Workout</Link>
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>

                                {/* Avatar Dropdown - Separate NavigationMenu for proper positioning */}
                                <NavigationMenu className='dark' viewport={false}>
                                    <NavigationMenuList>
                                        <NavigationMenuItem className='relative'>
                                            <NavigationMenuTrigger className='cursor-pointer bg-transparent p-0 h-auto'>
                                                {avatar}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className='bg-gray-800 border-gray-700 absolute right-0 top-full mt-2 z-50 rounded-lg shadow-lg border' style={{ width: '208px' }}>
                                                <ul className='grid gap-1 p-3'>
                                                    <li>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                to='/profile'
                                                                className='flex flex-row items-center gap-3 rounded-md text-white hover:bg-linear-to-r hover:from-gray-700 hover:to-gray-600 hover:shadow-lg hover:scale-105 active:bg-gray-900 active:scale-95 transition-all duration-200 ease-in-out p-3 whitespace-nowrap group'>
                                                                <User className='w-4 h-4 group-hover:text-blue-400 transition-colors duration-200' />
                                                                Edit Profile
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                    <li>
                                                        <NavigationMenuLink asChild>
                                                            <button
                                                                onClick={logoutHandler}
                                                                className='cursor-pointer flex flex-row items-center gap-3 rounded-md text-white hover:bg-gray-700/80 hover:shadow-lg hover:scale-105 active:bg-gray-900 active:scale-95 transition-all duration-200 ease-in-out w-full p-3 text-left whitespace-nowrap group'>
                                                                <LogOut className='w-4 h-4 group-hover:text-red-400 transition-colors duration-200' />
                                                                Logout
                                                            </button>
                                                        </NavigationMenuLink>
                                                    </li>
                                                </ul>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to='/login'
                                    className='bg-linear-to-r from-[#38bdf8] to-[#818cf8] text-white px-4 py-2 rounded-lg hover:from-[#818cf8] hover:to-[#c084fc] transition-all duration-300 font-medium'>
                                    Login
                                </Link>
                                <Link
                                    to='/register'
                                    className='bg-linear-to-r from-[#38bdf8] to-[#818cf8] text-white px-4 py-2 rounded-lg hover:from-[#818cf8] hover:to-[#c084fc] transition-all duration-300 font-medium'>
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Navigation Toggle */}
                    <div className='lg:hidden flex items-center space-x-4'>
                        <button
                            onClick={toggleMobileMenu}
                            className='p-2 rounded-md hover:bg-gray-700 transition-all duration-300'>
                            {isMobileMenuOpen ? (
                                <X className='w-6 h-6' />
                            ) : (
                                <Menu className='w-6 h-6' />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop overlay for closing menu when clicking outside */}
                    <div
                        className='lg:hidden fixed inset-0 z-40'
                        onClick={closeMobileMenu}
                    />
                    <div className='lg:hidden fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl animate-in slide-in-from-top duration-200'>
                        {/* Mobile Menu Content */}
                        <div className='p-4'>
                            {isAuthenticated ? (
                                <div className='space-y-4'>
                                    {/* User Info */}
                                    <div className='flex items-center space-x-3 p-3 bg-gray-700 rounded-lg'>
                                        {avatar}
                                        <div>
                                            <p className='text-white font-medium'>{userInfo?.name}</p>
                                            <p className='text-gray-300 text-sm'>{userInfo?.email}</p>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <nav className='space-y-2'>
                                        <Link
                                            to='/dashboard'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-2 w-full text-left p-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300'>
                                            <LayoutDashboard className='w-4 h-4' />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            to={`/profile/view/${userInfo?.username}`}
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-2 w-full text-left p-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300'>
                                            <LayoutDashboard className='w-4 h-4' />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to='/food'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-2 w-full text-left p-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300'>
                                            <UtensilsCrossed className='w-4 h-4' />
                                            <span>Food</span>
                                        </Link>
                                        <Link
                                            to='/workout'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-2 w-full text-left p-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300'>
                                            <Dumbbell className='w-4 h-4' />
                                            <span>Workout</span>
                                        </Link>
                                        <Link
                                            to='/profile'
                                            onClick={closeMobileMenu}
                                            className='flex items-center space-x-2 w-full text-left p-3 text-white hover:bg-gray-700 rounded-lg transition-all duration-300'>
                                            <User className='w-4 h-4' />
                                            <span>Edit Profile</span>
                                        </Link>
                                    </nav>

                                    {/* Logout Button */}
                                    <button
                                        onClick={logoutHandler}
                                        className='flex items-center space-x-2 w-full text-left p-3 text-white hover:bg-red-600 rounded-lg transition-all duration-300 mt-4'>
                                        <LogOut className='w-4 h-4' />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    <Link
                                        to='/login'
                                        onClick={closeMobileMenu}
                                        className='block w-full text-center bg-linear-to-r from-[#38bdf8] to-[#818cf8] text-white px-4 py-3 rounded-lg hover:from-[#818cf8] hover:to-[#c084fc] transition-all duration-300 font-medium'>
                                        Login
                                    </Link>
                                    <Link
                                        to='/register'
                                        onClick={closeMobileMenu}
                                        className='block w-full text-center bg-linear-to-r from-[#38bdf8] to-[#818cf8] text-white px-4 py-3 rounded-lg hover:from-[#818cf8] hover:to-[#c084fc] transition-all duration-300 font-medium'>
                                        Register
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
