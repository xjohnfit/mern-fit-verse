import { WavyBackground } from '@/components/ui/wavy-background';
import AlertModal from '@/components/AlertModal';
import { useEffect, useState } from 'react';

const HomeScreen = () => {
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        const hasSeenAlert = localStorage.getItem('hasSeenExperimentalWarning');

        if (!hasSeenAlert) {
            // Show the modal for the first time visiting the home route
            setAlertVisible(true);
            // Mark that the user has now seen the alert
            localStorage.setItem('hasSeenExperimentalWarning', 'true');
        }
    }, []);

    return (
        <>
            {alertVisible && <AlertModal setAlertVisible={setAlertVisible} />}
            <WavyBackground>
                <p className='text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center'>
                    Welcome to FitVerse
                </p>
                <p className='text-base md:text-lg mt-4 text-white font-normal inter-var text-center'>
                    Your ultimate fitness companion for tracking workouts, monitoring progress, and achieving your health goals.
                </p>
            </WavyBackground>
        </>
    );
};
export default HomeScreen;
