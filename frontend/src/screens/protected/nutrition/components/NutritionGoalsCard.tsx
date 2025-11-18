import { Target, Edit2, Save } from 'lucide-react';

interface GoalValues {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
}

interface DailyNutritionData {
    data: {
        totals: {
            protein: number;
            carbs: number;
            fats: number;
            calories: number;
        };
    };
}

interface NutritionGoalsCardProps {
    isEditingGoals: boolean;
    setIsEditingGoals: (value: boolean) => void;
    goalValues: GoalValues;
    handleGoalChange: (field: string, value: string) => void;
    handleSaveGoals: () => void;
    dailyNutritionData?: DailyNutritionData;
}

export const NutritionGoalsCard = ({
    isEditingGoals,
    setIsEditingGoals,
    goalValues,
    handleGoalChange,
    handleSaveGoals,
    dailyNutritionData
}: NutritionGoalsCardProps) => {
    const goals = [
        { label: 'Calories', field: 'calories', unit: 'kcal', color: 'bg-blue-500' },
        { label: 'Protein', field: 'protein', unit: 'g', color: 'bg-green-500' },
        { label: 'Carbs', field: 'carbs', unit: 'g', color: 'bg-red-500' },
        { label: 'Fats', field: 'fats', unit: 'g', color: 'bg-yellow-500' }
    ];

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl h-full">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="hidden sm:inline">Current Goals</span>
                    <span className="sm:hidden">Goals</span>
                </h3>
                {!isEditingGoals ? (
                    <button
                        onClick={() => setIsEditingGoals(true)}
                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                    >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit Goals</span>
                        <span className="sm:hidden">Edit</span>
                    </button>
                ) : (
                    <button
                        onClick={handleSaveGoals}
                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                        <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                        Save
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {goals.map((goal) => {
                    // Calculate calories from macros to match the chart
                    let consumed = dailyNutritionData?.data?.totals?.[goal.field as keyof typeof dailyNutritionData.data.totals] || 0;
                    if (goal.field === 'calories') {
                        const proteinTotal = dailyNutritionData?.data?.totals?.protein || 0;
                        const carbsTotal = dailyNutritionData?.data?.totals?.carbs || 0;
                        const fatsTotal = dailyNutritionData?.data?.totals?.fats || 0;
                        consumed = (proteinTotal * 4) + (carbsTotal * 4) + (fatsTotal * 9);
                    }
                    const goalValue = Number(goalValues[goal.field as keyof typeof goalValues]) || 0;
                    const percentage = goalValue > 0 ? Math.min((consumed / goalValue) * 100, 100) : 0;

                    return (
                        <div key={goal.field} className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {goal.label}
                                </label>
                                {!isEditingGoals && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {consumed.toFixed(goal.field === 'calories' ? 0 : 1)} / {goalValues[goal.field as keyof typeof goalValues] || '—'} {goal.unit}
                                    </span>
                                )}
                            </div>

                            {isEditingGoals ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <input
                                        type="text"
                                        value={goalValues[goal.field as keyof typeof goalValues]}
                                        onChange={(e) => handleGoalChange(goal.field, e.target.value)}
                                        placeholder={`Enter ${goal.label.toLowerCase()}`}
                                        disabled={goal.field === 'calories'}
                                        className={`flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${goal.field === 'calories' ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : ''}`}
                                    />
                                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 min-w-8 sm:min-w-10">{goal.unit}</span>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 sm:h-3 overflow-hidden">
                                        <div
                                            className={`h-full ${goal.color} transition-all duration-500 ease-out rounded-full`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>

                                    {/* Percentage indicator */}
                                    {goalValue > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] sm:text-xs font-medium ${percentage >= 100
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-gray-600 dark:text-gray-400'}`}
                                            >
                                                {percentage.toFixed(0)}% of goal
                                            </span>
                                            {percentage >= 100 && (
                                                <span className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-semibold">
                                                    Goal reached! 🎉
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
