import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/slices/usersApiSlice';
import { clearCredentials } from '@/slices/authSlice';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';
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

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(clearCredentials());
            toast.success('Logged out successfully');
            navigate('/');
        } catch (err: string | any) {
            toast.error(
                `Logout failed: ${
                    err?.data?.message || err?.message || 'Unknown error'
                }`
            );
        }
    };

    const avatar = userInfo ? (
        <Avatar className='ml-2'>
            <AvatarImage src={userInfo.photo} />
            <AvatarFallback className='bg-gray-600'>
                {userInfo.name.charAt(0)}
            </AvatarFallback>
        </Avatar>
    ) : null;

    return (
        <header className='w-screen bg-gray-800 text-white p-4 z-20 relative border-[#38bdf8] shadow-[0_0_10px_#38bdf8,0_0_20px_#818cf8,0_0_30px_#c084fc,0_0_40px_#e879f9,0_0_50px_#22d3ee] hover:shadow-[0_0_15px_#38bdf8,0_0_30px_#818cf8,0_0_45px_#c084fc,0_0_60px_#e879f9,0_0_75px_#22d3ee] transition-all duration-300'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link to='/'>
                    <h1 className='text-2xl font-bold'>FitVerse</h1>
                </Link>
                <nav className='flex space-x-6'>
                    {isAuthenticated ? (
                        <NavigationMenu className='dark'>
                            <NavigationMenuList className='flex flex-wrap gap-10'>
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
                                <NavigationMenuItem className='block'>
                                    <NavigationMenuTrigger className='cursor-pointer bg-transparent'>
                                        {avatar}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className='bg-gray-800 border-gray-700'>
                                        <ul className='grid w-[200px] gap-2 p-2'>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        to='/profile'
                                                        className='flex flex-row items-center gap-2 rounded-md text-white hover:bg-gray-900/70 hover:shadow-lg active:bg-gray-900 transition-all duration-300 ease-in-out'>
                                                        <User className='w-4 h-4' />
                                                        Profile
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <button
                                                        onClick={logoutHandler}
                                                        className='cursor-pointer flex flex-row items-center gap-2 rounded-md text-white hover:bg-gray-900/70 hover:shadow-lg active:bg-gray-900 transition-all duration-300 ease-in-out w-full p-3 text-left'>
                                                        <LogOut className='w-4 h-4' />
                                                        Logout
                                                    </button>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
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
            </div>
        </header>
    );
}

export default Header;
