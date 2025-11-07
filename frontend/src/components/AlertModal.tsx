import { useEffect } from 'react';

const AlertModal = ({ setAlertVisible }: { setAlertVisible: (visible: boolean) => void; }) => {

    const closeModal = () => {
        setAlertVisible(false);
    };

    // Handle escape key press to close modal
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 w-screen h-screen bg-black/50 flex justify-center items-center z-50"
            onClick={closeModal}
        >
            <div
                className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Experimental Website</h2>
                </div>
                <p className="mb-6 text-gray-700">
                    Welcome to FitVerse! Please note that this website is currently in experimental phase.
                    Some features may not work as expected and the site is under active development.
                    Thank you for your understanding!
                </p>
                <div className="flex justify-end">
                    <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AlertModal;