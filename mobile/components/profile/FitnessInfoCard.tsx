import React from 'react';
import { View, Text } from 'react-native';
import { Ruler, Weight, Target } from 'lucide-react-native';
import { UserProfile } from '../../types/profile.types';

interface FitnessInfoCardProps {
    user: UserProfile;
}

export const FitnessInfoCard: React.FC<FitnessInfoCardProps> = ({ user }) => {
    return (
        <>
            {/* Fitness Info Card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-3">
                <Text className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Fitness Info
                </Text>
                <View className="flex-row flex-wrap">
                    {/* Height */}
                    <View className="flex-row items-center bg-green-50 dark:bg-green-900/20 rounded-full px-4 py-2 mr-2 mb-2">
                        <Ruler color="#10b981" size={16} />
                        {user.height ? (
                            <Text className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.height} cm
                            </Text>
                        ) : (
                            <Text className="ml-2 text-sm text-gray-400 dark:text-gray-500">
                                No height
                            </Text>
                        )}
                    </View>

                    {/* Weight */}
                    <View className="flex-row items-center bg-orange-50 dark:bg-orange-900/20 rounded-full px-4 py-2 mb-2">
                        <Weight color="#f59e0b" size={16} />
                        {user.weight ? (
                            <Text className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.weight} {user.weightUnit || 'kg'}
                            </Text>
                        ) : (
                            <Text className="ml-2 text-sm text-gray-400 dark:text-gray-500">
                                No weight
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Fitness Goal Card */}
            {user.goal && (
                <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-3 border border-blue-100 dark:border-blue-800">
                    <View className="flex-row items-center mb-2">
                        <Target color="#8b5cf6" size={18} />
                        <Text className="ml-2 text-base font-bold text-gray-900 dark:text-gray-100">
                            Fitness Goal
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {user.goal}
                    </Text>
                </View>
            )}
        </>
    );
};
