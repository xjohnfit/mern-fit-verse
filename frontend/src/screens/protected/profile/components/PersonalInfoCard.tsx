import { type FC } from 'react';
import { Calendar, User, Cake } from 'lucide-react';
import { formatDateToMMDDYYYY } from '@/lib/formatDate';
import { calculateAge } from '@/lib/calculateAge';
import { type UserProfile } from '@/screens/protected/profile/types';

interface PersonalInfoCardProps {
    user: UserProfile;
}

export const PersonalInfoCard: FC<PersonalInfoCardProps> = ({ user }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Personal Info
            </h2>
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <Cake className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {calculateAge(user.dob)} years
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {user.gender}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDateToMMDDYYYY(user.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
