import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NutritionOverviewStyles from '../../styles/dashboard/NutritionOverviewStyles';

interface NutritionOverviewProps {
    nutritionTotals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    nutritionGoals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
}

const NutritionOverview: React.FC<NutritionOverviewProps> = ({ nutritionTotals, nutritionGoals }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = NutritionOverviewStyles;

    const calorieProgress = nutritionGoals.calories > 0
        ? Math.min((nutritionTotals.calories / nutritionGoals.calories) * 100, 100)
        : 0;

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name="nutrition" size={20} color="#8B5CF6" style={styles.headerIcon} />
                <Text style={isDark ? styles.sectionTitleDark : styles.sectionTitle}>
                    Today&apos;s Nutrition
                </Text>
            </View>
            <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Calorie Goal and Progress */}
                <View style={styles.calorieContainer}>
                    <View style={styles.calorieHeader}>
                        <View style={styles.calorieLabelContainer}>
                            <Ionicons name="flame" size={18} color="#FFFFFF" style={styles.flameIcon} />
                            <Text style={styles.calorieLabel}>
                                Calories
                            </Text>
                        </View>
                        <Text style={styles.calorieValue}>
                            {nutritionTotals.calories.toFixed(0)} <Text style={styles.calorieGoal}>/ {nutritionGoals.calories || 2000}</Text>
                        </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${calorieProgress}%` }]} />
                    </View>
                </View>

                {/* Macros */}
                <View style={styles.macrosContainer}>
                    <View style={styles.macroItem}>
                        <Ionicons name="fitness" size={16} color="rgba(255,255,255,0.9)" style={styles.macroIcon} />
                        <Text style={styles.macroValue}>
                            {nutritionTotals.protein.toFixed(0)}g
                        </Text>
                        <Text style={styles.macroLabel}>Protein</Text>
                        <Text style={styles.macroGoal}>/ {nutritionGoals.protein || 150}g</Text>
                    </View>
                    <View style={styles.macroItem}>
                        <Ionicons name="flash" size={16} color="rgba(255,255,255,0.9)" style={styles.macroIcon} />
                        <Text style={styles.macroValue}>
                            {nutritionTotals.carbs.toFixed(0)}g
                        </Text>
                        <Text style={styles.macroLabel}>Carbs</Text>
                        <Text style={styles.macroGoal}>/ {nutritionGoals.carbs || 200}g</Text>
                    </View>
                    <View style={styles.macroItem}>
                        <Ionicons name="water" size={16} color="rgba(255,255,255,0.9)" style={styles.macroIcon} />
                        <Text style={styles.macroValue}>
                            {nutritionTotals.fats.toFixed(0)}g
                        </Text>
                        <Text style={styles.macroLabel}>Fats</Text>
                        <Text style={styles.macroGoal}>/ {nutritionGoals.fats || 65}g</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default NutritionOverview;
