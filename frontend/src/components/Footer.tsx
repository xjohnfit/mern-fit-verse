const Footer = () => {
    return (
        <footer className='w-screen bg-gray-800 text-white min-h-[40vh] sm:min-h-[35vh] lg:h-[40vh] z-20 relative'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6 sm:py-8'>
                {/* Top Section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
                    {/* Brand Section */}
                    <div className='col-span-1 sm:col-span-2 lg:col-span-2 text-center sm:text-left'>
                        <h2 className='text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-linear-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent'>
                            FitVerse
                        </h2>
                        <p className='text-gray-300 text-sm sm:text-base mb-4 max-w-md mx-auto sm:mx-0'>
                            Transform your fitness journey with our
                            comprehensive platform. Track workouts, monitor
                            progress, and achieve your goals.
                        </p>
                        <div className='flex justify-center sm:justify-start space-x-4'>
                            <a
                                href='#'
                                className='text-[#38bdf8] hover:text-[#818cf8] transition-colors duration-300'>
                                <svg
                                    className='w-6 h-6'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                                </svg>
                            </a>
                            <a
                                href='#'
                                className='text-[#818cf8] hover:text-[#c084fc] transition-colors duration-300'>
                                <svg
                                    className='w-6 h-6'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
                                </svg>
                            </a>
                            <a
                                href='#'
                                className='text-[#c084fc] hover:text-[#e879f9] transition-colors duration-300'>
                                <svg
                                    className='w-6 h-6'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.721.097.118.112.221.085.341-.09.381-.295 1.199-.334 1.363-.051.225-.165.271-.381.165-1.521-.708-2.498-2.942-2.498-4.732 0-3.855 2.8-7.391 8.081-7.391 4.249 0 7.552 3.018 7.552 7.054 0 4.204-2.668 7.623-6.349 7.623-1.244 0-2.415-.646-2.813-1.424l-.766 2.92c-.278 1.075-1.03 2.423-1.532 3.247C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z' />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='text-center sm:text-left mt-6 sm:mt-0'>
                        <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#38bdf8]'>
                            Quick Links
                        </h3>
                        <ul className='space-y-1 sm:space-y-2'>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#38bdf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#38bdf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Workouts
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#38bdf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Progress
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#38bdf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Community
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className='text-center sm:text-left mt-6 sm:mt-0'>
                        <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#818cf8]'>
                            Support
                        </h3>
                        <ul className='space-y-1 sm:space-y-2'>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#818cf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#818cf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#818cf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#'
                                    className='text-gray-300 hover:text-[#818cf8] transition-colors duration-300 text-sm sm:text-base'>
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className='border-t border-gray-700 pt-4 sm:pt-6 mt-6 sm:mt-8'>
                    <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
                        <p className='text-gray-400 text-xs sm:text-sm text-center sm:text-left'>
                            © {new Date().getFullYear()} FitVerse. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
