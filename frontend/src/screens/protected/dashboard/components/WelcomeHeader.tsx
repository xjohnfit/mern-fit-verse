// React
import { type FC } from "react";

interface WelcomeHeaderProps {
    userName: string;
}

export const WelcomeHeader: FC<WelcomeHeaderProps> = ({ userName }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome back, {userName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
                Stay up to date with your fitness community
            </p>
        </div>
    );
};
