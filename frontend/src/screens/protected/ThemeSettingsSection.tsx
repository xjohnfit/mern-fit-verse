import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Palette, Users, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ThemeSettingsSection = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved preferences from localStorage
        const savedReducedMotion = localStorage.getItem('fitverse-reduced-motion');

        if (savedReducedMotion) {
            setReducedMotion(JSON.parse(savedReducedMotion));
            document.documentElement.style.setProperty('--animation-duration', JSON.parse(savedReducedMotion) ? '0s' : '0.3s');
        }
    }, []);

    const handleReducedMotionToggle = () => {
        const newValue = !reducedMotion;
        setReducedMotion(newValue);
        localStorage.setItem('fitverse-reduced-motion', JSON.stringify(newValue));
        document.documentElement.style.setProperty('--animation-duration', newValue ? '0s' : '0.3s');
        toast.success(`Animations ${newValue ? 'disabled' : 'enabled'}`);
    };

    if (!mounted) {
        return null;
    }

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes in low light' },
        { value: 'system', label: 'System', icon: Monitor, description: 'Matches your device settings' }
    ];

    return (
        <div className='space-y-4'>
            <div className='flex items-center space-x-3 mb-6'>
                <div className='p-2 bg-linear-to-r from-purple-500 to-indigo-500 rounded-lg'>
                    <Palette className='w-5 h-5 text-white' />
                </div>
                <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>Theme Settings</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Customize your visual experience</p>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {themeOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = theme === option.value;

                    return (
                        <button
                            key={option.value}
                            type='button'
                            onClick={() => setTheme(option.value)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:scale-105 ${isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className='flex items-center space-x-3'>
                                <div className={`p-2 rounded-lg transition-colors ${isSelected
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-500'
                                    }`}>
                                    <IconComponent className='w-5 h-5' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center space-x-2'>
                                        <h4 className={`font-semibold ${isSelected
                                            ? 'text-blue-700 dark:text-blue-300'
                                            : 'text-gray-900 dark:text-gray-100'
                                            }`}>
                                            {option.label}
                                        </h4>
                                        {isSelected && (
                                            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                        )}
                                    </div>
                                    <p className={`text-xs mt-1 ${isSelected
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {option.description}
                                    </p>
                                </div>
                            </div>

                            {/* Selection indicator */}
                            {isSelected && (
                                <div className='absolute top-2 right-2'>
                                    <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Accessibility Options */}
            <div className='mt-6 space-y-4'>
                <h4 className='text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2'>
                    <Users className='w-4 h-4' />
                    <span>Accessibility</span>
                </h4>
                <div className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600'>
                    <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                            <h5 className='font-medium text-gray-900 dark:text-gray-100'>Reduce Motion</h5>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                                Minimize animations and transitions for a calmer experience
                            </p>
                        </div>
                        <button
                            type='button'
                            onClick={handleReducedMotionToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 ${reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className='mt-6 space-y-4'>
                <h4 className='text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2'>
                    <Lock className='w-4 h-4' />
                    <span>Data & Privacy</span>
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <button
                        type='button'
                        onClick={() => {
                            localStorage.removeItem('fitverse-reduced-motion');
                            toast.success('Theme preferences reset successfully!');
                            window.location.reload();
                        }}
                        className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 text-left group hover:bg-orange-50 dark:hover:bg-orange-900/10'
                    >
                        <div className='flex items-center space-x-3'>
                            <div className='p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors'>
                                <svg className='w-4 h-4 text-orange-600 dark:text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                                </svg>
                            </div>
                            <div>
                                <h5 className='font-medium text-gray-900 dark:text-gray-100'>Reset Preferences</h5>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                                    Clear all saved theme settings
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        type='button'
                        onClick={() => {
                            const themeData = {
                                theme,
                                reducedMotion,
                                exportedAt: new Date().toISOString()
                            };
                            const dataStr = JSON.stringify(themeData, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'fitverse-theme-preferences.json';
                            link.click();
                            URL.revokeObjectURL(url);
                            toast.success('Theme preferences exported successfully!');
                        }}
                        className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 text-left group hover:bg-blue-50 dark:hover:bg-blue-900/10'
                    >
                        <div className='flex items-center space-x-3'>
                            <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors'>
                                <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                            </div>
                            <div>
                                <h5 className='font-medium text-gray-900 dark:text-gray-100'>Export Settings</h5>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                                    Download your preferences
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Theme preview or additional info */}
            <div className='mt-4 p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-200/50 dark:border-blue-500/20'>
                <div className='flex items-start space-x-3'>
                    <div className='p-1 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg mt-1'>
                        <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                    </div>
                    <div>
                        <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                            Current theme: <span className='capitalize'>{theme}</span>
                        </p>
                        <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                            All changes are saved automatically and synced across your devices.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSettingsSection;