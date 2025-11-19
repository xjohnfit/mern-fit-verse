/**
 * Convert weight from pounds to kilograms
 * @param lbs - Weight in pounds
 * @returns Weight in kilograms (rounded to 2 decimal places)
 */
export const lbsToKg = (lbs: number): number => {
    return Math.round(lbs * 0.453592 * 100) / 100;
};

/**
 * Convert weight from kilograms to pounds
 * @param kg - Weight in kilograms
 * @returns Weight in pounds (rounded to 2 decimal places)
 */
export const kgToLbs = (kg: number): number => {
    return Math.round(kg * 2.20462 * 100) / 100;
};

/**
 * Convert workout weights based on user's preferred unit
 * Workouts are stored in lbs by default, so we convert to kg if user prefers kg
 * @param workout - Workout object with exercises and sets
 * @param userWeightUnit - User's preferred weight unit ('kg' or 'lbs')
 * @returns Workout with converted weights
 */
export const convertWorkoutWeights = (
    workout: any,
    userWeightUnit: string
): any => {
    // If user prefers lbs, no conversion needed (workouts stored in lbs)
    if (userWeightUnit === 'lbs') {
        return workout;
    }

    // Convert from lbs to kg
    const workoutCopy = JSON.parse(JSON.stringify(workout));

    if (workoutCopy.exercises && Array.isArray(workoutCopy.exercises)) {
        workoutCopy.exercises.forEach((exercise: any) => {
            if (exercise.sets && Array.isArray(exercise.sets)) {
                exercise.sets.forEach((set: any) => {
                    if (set.weight) {
                        set.weight = lbsToKg(set.weight);
                    }
                });
            }
        });
    }

    return workoutCopy;
};

/**
 * Convert workout weights from user's unit to lbs for storage
 * @param workout - Workout object with exercises and sets
 * @param userWeightUnit - User's preferred weight unit ('kg' or 'lbs')
 * @returns Workout with weights converted to lbs for storage
 */
export const convertWorkoutWeightsForStorage = (
    workout: any,
    userWeightUnit: string
): any => {
    // If user is already using lbs, no conversion needed
    if (userWeightUnit === 'lbs') {
        return workout;
    }

    // Convert from kg to lbs for storage
    const workoutCopy = JSON.parse(JSON.stringify(workout));

    if (workoutCopy.exercises && Array.isArray(workoutCopy.exercises)) {
        workoutCopy.exercises.forEach((exercise: any) => {
            if (exercise.sets && Array.isArray(exercise.sets)) {
                exercise.sets.forEach((set: any) => {
                    if (set.weight) {
                        set.weight = kgToLbs(set.weight);
                    }
                });
            }
        });
    }

    return workoutCopy;
};
