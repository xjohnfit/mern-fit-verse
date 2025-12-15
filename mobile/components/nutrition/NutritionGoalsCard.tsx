import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import createStyles from '@/styles/nutrition/NutritionGoalsCardStyles';

interface NutritionGoalsCardProps {
    dateLabel: string;
    isEditingGoals: boolean;
    setIsEditingGoals: (value: boolean) => void;
    goalValues: {
        calories: string;
        protein: string;
        carbs: string;
        fats: string;
    };
    setGoalValues: (values: any) => void;
    handleSaveGoals: () => void;
    isUpdatingGoals: boolean;
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    goals: {
        calories?: number;
        protein?: number;
        carbs?: number;
        fats?: number;
    };
}

const NutritionGoalsCard: React.FC<NutritionGoalsCardProps> = ({
    dateLabel,
    isEditingGoals,
    setIsEditingGoals,
    goalValues,
    setGoalValues,
    handleSaveGoals,
    isUpdatingGoals,
    totals,
    goals,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = createStyles(isDark);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="stats-chart" size={24} color="#10b981" />
                    </View>
                    <Text style={styles.headerTitle}>{dateLabel} Progress</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setIsEditingGoals(!isEditingGoals)}
                    style={styles.settingsButton}
                >
                    <Ionicons name={isEditingGoals ? 'close' : 'settings-outline'} size={22} color="#10b981" />
                </TouchableOpacity>
            </View>

            {isEditingGoals ? (
                <View>
                    {/* Calculated Calories (Read-only) */}
                    <View style={styles.calculatedCaloriesContainer}>
                        <View>
                            <Text style={styles.calculatedCaloriesLabel}>Calories Goal</Text>
                            <Text style={styles.calculatedCaloriesValue}>
                                {(() => {
                                    const protein = Number(goalValues.protein) || 0;
                                    const carbs = Number(goalValues.carbs) || 0;
                                    const fats = Number(goalValues.fats) || 0;
                                    return protein * 4 + carbs * 4 + fats * 9;
                                })()}{' '}
                                cal
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.macroInfoText}>Protein = 4 cal/g</Text>
                            <Text style={styles.macroInfoText}>Carbs = 4 cal/g</Text>
                            <Text style={styles.macroInfoText}>Fats = 9 cal/g</Text>
                        </View>
                    </View>

                    {/* Editable Macros */}
                    {['protein', 'carbs', 'fats'].map((key) => (
                        <View key={key} style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{key} Goal (g)</Text>
                            <TextInput
                                value={goalValues[key as keyof typeof goalValues]}
                                onChangeText={(text) => setGoalValues({ ...goalValues, [key]: text })}
                                keyboardType="numeric"
                                placeholder={`Enter ${key} goal`}
                                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                style={styles.input}
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        onPress={handleSaveGoals}
                        disabled={isUpdatingGoals}
                        style={styles.saveButton}
                    >
                        {isUpdatingGoals ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Goals</Text>
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    {/* Calories */}
                    <View style={styles.caloriesContainer}>
                        <View style={styles.caloriesHeader}>
                            <View style={styles.caloriesLabelContainer}>
                                <Ionicons name="flame" size={18} color="#3B82F6" style={{ marginRight: 6 }} />
                                <Text style={styles.caloriesLabel}>Calories</Text>
                            </View>
                            <Text style={styles.caloriesValue}>
                                {totals.calories} <Text style={styles.caloriesGoal}>/ {goals.calories || 2000}</Text>
                            </Text>
                        </View>
                        <View style={styles.progressBarBackground}>
                            <LinearGradient
                                colors={['#3B82F6', '#60A5FA']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height: '100%',
                                    width: `${Math.min((totals.calories / (goals.calories || 2000)) * 100, 100)}%`,
                                }}
                            />
                        </View>
                    </View>

                    {/* Macros */}
                    <View style={styles.macrosContainer}>
                        {[
                            { key: 'protein', label: 'Protein', color: '#10B981', icon: 'fitness' as const, goal: goals.protein || 150 },
                            { key: 'carbs', label: 'Carbs', color: '#EF4444', icon: 'flash' as const, goal: goals.carbs || 200 },
                            { key: 'fats', label: 'Fats', color: '#F59E0B', icon: 'water' as const, goal: goals.fats || 65 },
                        ].map((macro) => {
                            const currentValue = Number(totals[macro.key as keyof typeof totals]);
                            const percentage = Math.min((currentValue / macro.goal) * 100, 100);

                            return (
                                <View key={macro.key} style={styles.macroRow}>
                                    <View
                                        style={[
                                            styles.macroIconContainer,
                                            { backgroundColor: `${macro.color}20` },
                                        ]}
                                    >
                                        <Ionicons name={macro.icon} size={18} color={macro.color} />
                                    </View>
                                    <View
                                        style={[
                                            styles.macroBarContainer,
                                            { borderColor: `${macro.color}30` },
                                        ]}
                                    >
                                        <View style={styles.macroBarBackground} />
                                        <LinearGradient
                                            colors={[`${macro.color}30`, `${macro.color}20`]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                width: `${percentage}%`,
                                                overflow: 'hidden',
                                            }}
                                        />
                                        <View style={styles.macroBarContent}>
                                            <Text style={styles.macroLabel}>{macro.label}</Text>
                                            <Text style={[styles.macroValue, { color: macro.color }]}>
                                                {currentValue.toFixed(1).replace(/\.0$/, '')}g{' '}
                                                <Text style={styles.macroGoal}>/ {macro.goal}g</Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
};

export default NutritionGoalsCard;
