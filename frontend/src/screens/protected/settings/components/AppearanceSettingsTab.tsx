import ThemeSettingsSection from '@/screens/protected/settings/components/ThemeSettingsSection';

const AppearanceSettingsTab = () => {
    return (
        <div className='space-y-6'>
            <div className='bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 p-6'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
                    Theme & Appearance
                </h3>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>
                    Customize how FitVerse looks and feels
                </p>
                <ThemeSettingsSection />
            </div>
        </div>
    );
};

export default AppearanceSettingsTab;
