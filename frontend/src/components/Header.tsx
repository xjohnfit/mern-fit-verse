import { Link } from 'react-router';

function Header() {
    return (
        <header className='w-screen bg-gray-800 text-white p-4 z-20 relative border-[#38bdf8] shadow-[0_0_10px_#38bdf8,0_0_20px_#818cf8,0_0_30px_#c084fc,0_0_40px_#e879f9,0_0_50px_#22d3ee] hover:shadow-[0_0_15px_#38bdf8,0_0_30px_#818cf8,0_0_45px_#c084fc,0_0_60px_#e879f9,0_0_75px_#22d3ee] transition-all duration-300'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link to='/'><h1 className='text-2xl font-bold'>FitVerse</h1></Link>
                <nav className='flex space-x-6'>
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
                </nav>
            </div>
        </header>
    );
}

export default Header;
