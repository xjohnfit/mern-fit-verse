import { type FC } from 'react';
import { Ruler, Weight, Target } from 'lucide-react';
import { type UserProfile } from '@/screens/protected/profile/profile.types';

interface FitnessInfoCardProps {
    user: UserProfile;
}

export const FitnessInfoCard: FC<FitnessInfoCardProps> = ({ user }) => {
    return (
        <>
            {/* Fitness Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Fitness Info
                </h2>
                <div className="space-y-3">
                    {user.height ? (
                        <div className="flex items-center space-x-3">
                            <Ruler className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Height
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {user.height} cm
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Ruler className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Height
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Not provided
                                </p>
                            </div>
                        </div>
                    )}

                    {user.weight ? (
                        <div className="flex items-center space-x-3">
                            <Weight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Weight
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {user.weight} {user.weightUnit || 'kg'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Weight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Weight
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Not provided
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fitness Goal Card */}
            {user.goal && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Fitness Goal
                    </h2>
                    <div className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                            {user.goal}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
