import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, User, Cake } from 'lucide-react-native';
import { formatDateToMMDDYYYY } from '../../lib/formatDate';
import { calculateAge } from '../../lib/calculateAge';
import { UserProfile } from '../../types/profile.types';

interface PersonalInfoCardProps {
    user: UserProfile;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ user }) => {
    return (
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-3">
            <Text className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                Personal Info
            </Text>
            <View className="flex-row flex-wrap">
                {/* Age */}
                <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 rounded-full px-4 py-2 mr-2 mb-2">
                    <Cake color="#3b82f6" size={16} />
                    <Text className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {calculateAge(user.dob)} years
                    </Text>
                </View>

                {/* Gender */}
                <View className="flex-row items-center bg-purple-50 dark:bg-purple-900/20 rounded-full px-4 py-2 mr-2 mb-2">
                    <User color="#8b5cf6" size={16} />
                    <Text className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {user.gender}
                    </Text>
                </View>

                {/* Joined Date */}
                <View className="flex-row items-center bg-pink-50 dark:bg-pink-900/20 rounded-full px-4 py-2 mb-2">
                    <Calendar color="#ec4899" size={16} />
                    <Text className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatDateToMMDDYYYY(user.createdAt)}
                    </Text>
                </View>
            </View>
        </View>
    );
};
