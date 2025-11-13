import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '@/slices/usersApiSlice';
import { setCredentials } from '@/slices/authSlice';
import { toast } from 'sonner';
import { ArrowRight, Eye, EyeOff, Mail, Lock, LogIn, Chrome, Facebook } from 'lucide-react';

const LoginScreen = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const { isAuthenticated } = useSelector(
        (state: any) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { rememberMe, ...loginData } = formData;
            const res = await login(loginData).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Welcome back! Login successful.');
            navigate('/dashboard');
        } catch (err: string | any) {
            toast.error(err?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className='min-h-screen relative overflow-hidden'>
            {/* Animated Background */}
            <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20'>
                {/* Animated background elements */}
                <div className='absolute top-0 left-0 w-full h-full'>
                    <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-500'></div>
                </div>
            </div>

            {/* Main Content */}
            <div className='relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
                <div className='max-w-md w-full space-y-8'>
                    {/* Header */}
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg'>
                            <LogIn className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3'>
                            Welcome Back
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 text-lg'>
                            Sign in to continue your fitness journey
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className='bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-500'>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Email Field */}
                            <div className='space-y-2'>
                                <label htmlFor='email' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                    Email Address
                                </label>
                                <div className='relative group'>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        required
                                        autoComplete='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                                        placeholder='Enter your email address'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200' />
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className='space-y-2'>
                                <label htmlFor='password' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                    Password
                                </label>
                                <div className='relative group'>
                                    <input
                                        id='password'
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete='current-password'
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                                        placeholder='Enter your password'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Lock className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' />
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                    >
                                        {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className='flex items-center justify-between pt-2'>
                                <div className='flex items-center'>
                                    <input
                                        id='rememberMe'
                                        name='rememberMe'
                                        type='checkbox'
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className='w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 transition-colors duration-200'
                                    />
                                    <label
                                        htmlFor='rememberMe'
                                        className='ml-2 block text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer'>
                                        Remember me
                                    </label>
                                </div>
                                <a
                                    href='#'
                                    className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 hover:underline font-medium'>
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <div className='pt-4'>
                                <button
                                    type='submit'
                                    disabled={isLoading}
                                    className='w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2'
                                >
                                    {isLoading ? (
                                        <>
                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight className='w-5 h-5' />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className='mt-8'>
                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-gray-200 dark:border-gray-600'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium'>
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className='mt-6 grid grid-cols-2 gap-4'>
                            <button className='w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600/50 hover:border-red-300 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group'>
                                <Chrome className='w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200' />
                                <span className='ml-2'>Google</span>
                            </button>
                            <button className='w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700/50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group'>
                                <Facebook className='w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200' />
                                <span className='ml-2'>Facebook</span>
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className='text-center'>
                        <p className='text-gray-600 dark:text-gray-400'>
                            Don't have an account?{' '}
                            <a
                                href='/register'
                                className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-200'>
                                Sign up now
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;