import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DayNavigatorProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export const DayNavigator = ({ currentDate, onDateChange }: DayNavigatorProps) => {
    const handlePreviousDay = () => {
        const previousDay = new Date(currentDate);
        previousDay.setDate(previousDay.getDate() - 1);
        onDateChange(previousDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        onDateChange(nextDay);
    };

    const handleToday = () => {
        onDateChange(new Date());
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time parts for comparison
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);

        if (compareDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (compareDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
            });
        }
    };

    const isToday = () => {
        const today = new Date();
        return currentDate.toDateString() === today.toDateString();
    };

    return (
        <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            {/* Previous Day Button */}
            <button
                onClick={handlePreviousDay}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                aria-label="Previous day"
            >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Current Date Display */}
            <div className="flex flex-col items-center gap-1 min-w-[140px] sm:min-w-[200px]">
                <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span>{formatDate(currentDate)}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
            </div>

            {/* Next Day / Today Button */}
            {!isToday() ? (
                <div className="flex gap-2">
                    <button
                        onClick={handleToday}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                        aria-label="Go to today"
                    >
                        Today
                    </button>
                    <button
                        onClick={handleNextDay}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        aria-label="Next day"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleNextDay}
                    disabled
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-not-allowed opacity-50"
                    aria-label="Next day (disabled)"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};
