import { WavyBackground } from '@/components/ui/wavy-background';

const HomeScreen = () => {
    return (
        <WavyBackground>
            <p className='text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center'>
                Welcome to FitVerse
            </p>
            <p className='text-base md:text-lg mt-4 text-white font-normal inter-var text-center'>
                Your ultimate fitness companion for tracking workouts, monitoring progress, and achieving your health goals.
            </p>
        </WavyBackground>
    );
};
export default HomeScreen;
