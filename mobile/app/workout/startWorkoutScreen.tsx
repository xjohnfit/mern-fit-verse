import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    Image,
    useColorScheme,
    ActivityIndicator,
    AppState,
    Platform,
    type AppStateStatus,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { useAudioPlayer, AudioSource, setAudioModeAsync } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { useGetExercisesQuery } from '@/slices/exerciseApiSlice';
import type { Exercise as ApiExercise } from '@/slices/exerciseApiSlice';
import { useGetTemplateByIdQuery } from '@/slices/workoutTemplateApiSlice';
import { useCreateWorkoutMutation, useGetWorkoutsQuery } from '@/slices/workoutApiSlice';
import type { WorkoutExercise, WorkoutSet } from '@/types/workout.types';
import createStyles from '@/styles/workout/startWorkoutStyles';

// Configure notification handler - this determines how notifications are presented when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
    }),
});

type Exercise = Omit<ApiExercise, 'instructions'> & { instructions: string | string[]; };

const StartWorkoutScreen = () => {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = createStyles(isDark);
    const params = useLocalSearchParams();
    const templateIdFromUrl = params.templateId as string | undefined;

    // User info for weight unit and rest timer
    const { userInfo } = useSelector((state: any) => state.auth);
    const weightUnit = userInfo?.weightUnit || 'lbs';
    const defaultRestTimer = (userInfo?.restTimer || 120) * 1000; // Convert seconds to milliseconds

    // Initialize templateId from URL or AsyncStorage
    const [templateId, setTemplateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Queries and mutations
    const { data: exercisesData, isLoading: exercisesLoading } = useGetExercisesQuery();
    const { data: templateData } = useGetTemplateByIdQuery(templateId!, {
        skip: !templateId,
    });
    const { data: workoutsData } = useGetWorkoutsQuery({});
    const [createWorkout, { isLoading: isSaving }] = useCreateWorkoutMutation();

    // Refs
    const isFinishingRef = useRef(false);
    const templateLoadedRef = useRef<string | null>(null); // Track which template was loaded
    const bellSound = useAudioPlayer(require('../../assets/sounds/bell.wav') as AudioSource);
    const appState = useRef(AppState.currentState);
    const restTimerNotificationId = useRef<string | null>(null);
    const workoutTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const restTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
    const [showExerciseSearch, setShowExerciseSearch] = useState(false);
    const [activeRestTimer, setActiveRestTimer] = useState<{
        exerciseId: string;
        setId: string;
        startTime: number;
    } | null>(null);
    const [isRestoringTimer, setIsRestoringTimer] = useState(true);

    // Timer state
    const [workoutStartTime, setWorkoutStartTime] = useState(Date.now());
    const [pausedTime, setPausedTime] = useState(0);
    const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [workoutTime, setWorkoutTime] = useState(0);

    // Restore rest timer immediately on mount (before other initialization)
    useEffect(() => {
        const restoreTimer = async () => {
            try {
                const savedRestTimer = await AsyncStorage.getItem('workout_active_rest_timer');
                if (savedRestTimer) {
                    const timerData = JSON.parse(savedRestTimer);
                    const elapsed = Date.now() - timerData.startTime;
                    const remaining = defaultRestTimer - elapsed;

                    if (remaining > 0) {
                        setActiveRestTimer(timerData);
                    } else {
                        await AsyncStorage.removeItem('workout_active_rest_timer');
                    }
                }
            } catch (error) {
                console.error('Failed to restore timer', error);
            } finally {
                setIsRestoringTimer(false);
            }
        };

        restoreTimer();
    }, [defaultRestTimer]);

    // Initialize workout state from AsyncStorage
    useEffect(() => {
        const initializeWorkout = async () => {
            try {
                const savedTemplateId = await AsyncStorage.getItem('workout_template_id');
                const savedStartTime = await AsyncStorage.getItem('workout_start_time');
                const savedExercises = await AsyncStorage.getItem('workout_exercises');
                const savedPausedTime = await AsyncStorage.getItem('workout_paused_time');
                const savedPauseStart = await AsyncStorage.getItem('workout_pause_start');
                const savedTimerRunning = await AsyncStorage.getItem('workout_timer_running');

                // Set template ID
                if (templateIdFromUrl) {
                    await AsyncStorage.setItem('workout_template_id', templateIdFromUrl);
                    setTemplateId(templateIdFromUrl);
                } else if (savedTemplateId) {
                    setTemplateId(savedTemplateId);
                }

                // Set the start time
                if (savedStartTime) {
                    setWorkoutStartTime(parseInt(savedStartTime));
                } else {
                    const startTime = Date.now();
                    await AsyncStorage.setItem('workout_start_time', startTime.toString());
                    await AsyncStorage.setItem('workout_timer_running', 'true');
                    setWorkoutStartTime(startTime);
                }

                // Set paused time
                let paused = savedPausedTime ? parseInt(savedPausedTime) : 0;
                if (savedPauseStart) {
                    const pauseStart = parseInt(savedPauseStart);
                    const additionalPause = Date.now() - pauseStart;
                    paused += additionalPause;
                    await AsyncStorage.setItem('workout_paused_time', paused.toString());
                    await AsyncStorage.removeItem('workout_pause_start');
                }
                setPausedTime(paused);

                // Set timer running state
                const running = savedTimerRunning ? savedTimerRunning === 'true' : true;
                setIsTimerRunning(running);

                // Load saved exercises only if not loading a new template
                if (savedExercises && !templateIdFromUrl) {
                    try {
                        const parsed = JSON.parse(savedExercises);
                        setSelectedExercises(parsed);
                        setIsLoading(false);
                    } catch (e) {
                        console.error('Failed to parse saved exercises', e);
                        setIsLoading(false);
                    }
                } else if (templateIdFromUrl) {
                    // Clear saved exercises when loading a new template
                    await AsyncStorage.removeItem('workout_exercises');
                    await AsyncStorage.removeItem('workout_active_rest_timer');
                    // Keep loading true until the template loads
                } else {
                    // No saved exercises and no template-freestyle workout
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to initialize workout', error);
                setIsLoading(false);
            }
        };

        initializeWorkout();
    }, [templateIdFromUrl]);

    // Configure audio to play even in silent mode
    useEffect(() => {
        const configureAudio = async () => {
            try {
                await setAudioModeAsync({
                    playsInSilentMode: true,
                });
            } catch (error) {
                console.error('Failed to configure audio mode:', error);
            }
        };
        configureAudio();
    }, []);

    // Request notification permissions and setup channel
    useEffect(() => {
        const setupNotifications = async () => {
            try {
                // Request permissions
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    console.warn('Notification permissions not granted');
                    Alert.alert('Notifications Required', 'Please enable notifications in your device settings to receive rest timer alerts.');
                    return;
                }

                console.log('Notification permissions granted');

                // iOS-specific notification reminder
                if (Platform.OS === 'ios') {
                    console.log('iOS: Make sure device is not in silent mode for notification sounds to play');
                }

                // Setup Android notification channel
                if (Platform.OS === 'android') {
                    await Notifications.setNotificationChannelAsync('workout-timer', {
                        name: 'Workout Timer',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        sound: 'default',
                        enableVibrate: true,
                        showBadge: true,
                    });
                }

                // For iOS, set notification categories to allow sound in background
                if (Platform.OS === 'ios') {
                    await Notifications.setNotificationCategoryAsync('workout-timer', [
                        {
                            identifier: 'TIMER_COMPLETE',
                            buttonTitle: 'OK',
                            options: {
                                opensAppToForeground: true,
                            },
                        },
                    ], {
                        allowInCarPlay: true,
                        allowAnnouncement: true,
                    });
                    console.log('iOS notification category configured');
                }
            } catch (error) {
                console.error('Error setting up notifications:', error);
            }
        };

        setupNotifications();
    }, []);

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            try {
                if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                    // App has come to foreground - recalculate timers based on timestamps
                    console.log('App came to foreground');

                    // Recalculate workout time
                    if (isTimerRunning) {
                        const elapsed = Math.floor((Date.now() - workoutStartTime - pausedTime) / 1000);
                        setWorkoutTime(elapsed);
                    }

                    // Recalculate rest timer if active
                    if (activeRestTimer) {
                        const elapsed = Date.now() - activeRestTimer.startTime;
                        const restDuration = defaultRestTimer;
                        const remaining = restDuration - elapsed;

                        if (remaining <= 0) {
                            // Timer has finished while in background
                            try {
                                playBellSound();
                            } catch (err) {
                                console.error('Error playing bell sound:', err);
                            }
                            setActiveRestTimer(null);
                            setSelectedExercises((prev) =>
                                prev.map((ex) => {
                                    if (ex.id !== activeRestTimer.exerciseId) return ex;
                                    return {
                                        ...ex,
                                        sets: ex.sets.map((set) =>
                                            set.id === activeRestTimer.setId ? { ...set, restTimeRemaining: 0 } : set
                                        ),
                                    };
                                })
                            );
                        }
                    }

                    // Cancel any pending rest timer notifications
                    if (restTimerNotificationId.current) {
                        Notifications.cancelScheduledNotificationAsync(restTimerNotificationId.current)
                            .then(() => {
                                restTimerNotificationId.current = null;
                            })
                            .catch((err) => console.error('Error canceling notification:', err));
                    }
                } else if (nextAppState.match(/inactive|background/)) {
                    // App has gone to background
                    console.log('App went to background');

                    // Schedule notification for rest timer if active (only if not already scheduled)
                    if (activeRestTimer && !restTimerNotificationId.current) {
                        const elapsed = Date.now() - activeRestTimer.startTime;
                        const restDuration = defaultRestTimer;
                        const remaining = restDuration - elapsed;
                        console.log('Rest timer active, remaining seconds:', Math.ceil(remaining / 1000));

                        if (remaining > 0) {
                            const secondsToWait = Math.max(1, Math.ceil(remaining / 1000));
                            console.log('Scheduling notification for', secondsToWait, 'seconds');

                            Notifications.scheduleNotificationAsync({
                                content: {
                                    title: '⏰ Rest Timer Complete!',
                                    body: 'Time to start your next set!',
                                    sound: true,
                                    priority: Notifications.AndroidNotificationPriority.MAX,
                                    data: { playSound: true },
                                },
                                trigger: {
                                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                                    seconds: secondsToWait,
                                    channelId: Platform.OS === 'android' ? 'workout-timer' : undefined,
                                },
                            })
                                .then((notificationId) => {
                                    restTimerNotificationId.current = notificationId;
                                    console.log('Notification scheduled:', notificationId);
                                })
                                .catch((error) => {
                                    console.error('Error scheduling notification:', error);
                                });
                        }
                    }
                }

                appState.current = nextAppState;
            } catch (error) {
                console.error('Error in app state change handler:', error);
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [activeRestTimer, isTimerRunning, workoutStartTime, pausedTime, defaultRestTimer]);

    // Workout timer effect - uses timestamp-based calculation instead of increments
    useEffect(() => {
        if (workoutTimerIntervalRef.current) {
            clearInterval(workoutTimerIntervalRef.current);
            workoutTimerIntervalRef.current = null;
        }

        if (isTimerRunning) {
            // Immediately calculate current time
            const elapsed = Math.floor((Date.now() - workoutStartTime - pausedTime) / 1000);
            setWorkoutTime(elapsed);

            // Update every 100ms for smooth display
            workoutTimerIntervalRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - workoutStartTime - pausedTime) / 1000);
                setWorkoutTime(elapsed);
            }, 100);
        }

        return () => {
            if (workoutTimerIntervalRef.current) {
                clearInterval(workoutTimerIntervalRef.current);
                workoutTimerIntervalRef.current = null;
            }
        };
    }, [isTimerRunning, workoutStartTime, pausedTime]);

    // Save timer state
    useEffect(() => {
        if (isFinishingRef.current) return;

        const saveTimerState = async () => {
            try {
                await AsyncStorage.setItem('workout_timer_running', isTimerRunning.toString());

                if (!isTimerRunning && pauseStartTime === null) {
                    const newPauseStart = Date.now();
                    setPauseStartTime(newPauseStart);
                    await AsyncStorage.setItem('workout_pause_start', newPauseStart.toString());
                } else if (isTimerRunning && pauseStartTime !== null) {
                    const pauseDuration = Date.now() - pauseStartTime;
                    const newPausedTime = pausedTime + pauseDuration;
                    setPausedTime(newPausedTime);
                    await AsyncStorage.setItem('workout_paused_time', newPausedTime.toString());
                    setPauseStartTime(null);
                    await AsyncStorage.removeItem('workout_pause_start');
                }
            } catch (error) {
                console.error('Failed to save timer state', error);
            }
        };

        saveTimerState();
    }, [isTimerRunning, pauseStartTime, pausedTime]);

    // Save selected exercises
    useEffect(() => {
        if (isFinishingRef.current || isLoading) return;

        const saveExercises = async () => {
            try {
                await AsyncStorage.setItem('workout_exercises', JSON.stringify(selectedExercises));
            } catch (error) {
                console.error('Failed to save exercises', error);
            }
        };

        saveExercises();
    }, [selectedExercises, isLoading]);

    // Load template exercises only when starting from a template URL
    useEffect(() => {
        // Only load template if we have a template from URL and haven't loaded this specific template yet
        if (templateIdFromUrl && templateData?.data && templateLoadedRef.current !== templateIdFromUrl && exercisesData) {
            templateLoadedRef.current = templateIdFromUrl;

            const template = templateData.data;
            const exercises = exercisesData;

            const templateExercises: WorkoutExercise[] = [];

            for (const templateExercise of template.exercises) {
                const exerciseData = exercises.find((ex) => ex.id === templateExercise.exerciseId);
                if (!exerciseData) continue;

                const workoutSets: WorkoutSet[] = templateExercise.sets.map((templateSet: any, index: number) => {
                    // Get last weight for this set, fallback to template target weight
                    const lastPerf = getLastPerformance(exerciseData.id, index + 1);
                    const weight = lastPerf?.weight || templateSet.targetWeight || 0;

                    return {
                        id: `${exerciseData.id}-set-${index + 1}`,
                        setNumber: index + 1,
                        completed: false,
                        weight: weight,
                        reps: templateSet.targetReps || 0,
                        restTimeRemaining: defaultRestTimer,
                    };
                });

                templateExercises.push({
                    id: exerciseData.id,
                    name: exerciseData.name,
                    description: exerciseData.description,
                    instructions: Array.isArray(exerciseData.instructions) ? exerciseData.instructions : [exerciseData.instructions],
                    image: exerciseData.image,
                    category: exerciseData.category,
                    sets: workoutSets,
                });
            }

            if (templateExercises.length > 0) {
                setSelectedExercises(templateExercises);
                AsyncStorage.setItem('workout_template_name', template.name);
            }
            setIsLoading(false);
        }
    }, [templateData, exercisesData, templateIdFromUrl, defaultRestTimer]);

    // Rest timer effect - uses timestamp-based calculation and schedules notifications
    useEffect(() => {
        if (restTimerIntervalRef.current) {
            clearInterval(restTimerIntervalRef.current);
            restTimerIntervalRef.current = null;
        }

        if (!activeRestTimer) {
            // Cancel any pending notifications when timer is cleared
            if (restTimerNotificationId.current) {
                Notifications.cancelScheduledNotificationAsync(restTimerNotificationId.current)
                    .catch(err => console.error('Error canceling notification:', err));
                restTimerNotificationId.current = null;
            }
            // Clear saved rest timer from storage
            AsyncStorage.removeItem('workout_active_rest_timer').catch(console.error);
            return;
        }

        const restDuration: number = defaultRestTimer;

        // Calculate initial remaining time
        const initialElapsed = Date.now() - activeRestTimer.startTime;
        const initialRemaining = restDuration - initialElapsed;

        // If already expired, complete immediately
        if (initialRemaining <= 0) {
            playBellSound();
            setActiveRestTimer(null);
            setSelectedExercises((prev) =>
                prev.map((ex) => {
                    if (ex.id !== activeRestTimer.exerciseId) return ex;
                    return {
                        ...ex,
                        sets: ex.sets.map((set) =>
                            set.id === activeRestTimer.setId ? { ...set, restTimeRemaining: 0 } : set
                        ),
                    };
                })
            );
            return;
        }

        // Update UI every 16ms (~60fps) using timestamp-based calculation
        restTimerIntervalRef.current = setInterval(() => {
            try {
                const elapsed = Date.now() - activeRestTimer.startTime;
                const remaining = restDuration - elapsed;

                if (remaining <= 0) {
                    playBellSound();
                    setActiveRestTimer(null);
                    setSelectedExercises((prev) =>
                        prev.map((ex) => {
                            if (ex.id !== activeRestTimer.exerciseId) return ex;
                            return {
                                ...ex,
                                sets: ex.sets.map((set) =>
                                    set.id === activeRestTimer.setId ? { ...set, restTimeRemaining: 0 } : set
                                ),
                            };
                        })
                    );

                    if (restTimerIntervalRef.current) {
                        clearInterval(restTimerIntervalRef.current);
                        restTimerIntervalRef.current = null;
                    }
                } else {
                    setSelectedExercises((prev) =>
                        prev.map((ex) => {
                            if (ex.id !== activeRestTimer.exerciseId) return ex;
                            return {
                                ...ex,
                                sets: ex.sets.map((set) =>
                                    set.id === activeRestTimer.setId ? { ...set, restTimeRemaining: remaining } : set
                                ),
                            };
                        })
                    );
                }
            } catch (error) {
                console.error('Error in rest timer interval:', error);
                if (restTimerIntervalRef.current) {
                    clearInterval(restTimerIntervalRef.current);
                    restTimerIntervalRef.current = null;
                }
            }
        }, 16);

        return () => {
            if (restTimerIntervalRef.current) {
                clearInterval(restTimerIntervalRef.current);
                restTimerIntervalRef.current = null;
            }
        };
    }, [activeRestTimer, defaultRestTimer]);

    // Save active rest timer whenever it changes
    useEffect(() => {
        const saveRestTimer = async () => {
            if (activeRestTimer) {
                try {
                    await AsyncStorage.setItem('workout_active_rest_timer', JSON.stringify(activeRestTimer));
                } catch (error) {
                    console.error('Failed to save rest timer', error);
                }
            } else {
                try {
                    await AsyncStorage.removeItem('workout_active_rest_timer');
                } catch (error) {
                    console.error('Failed to remove rest timer', error);
                }
            }
        };

        saveRestTimer();
    }, [activeRestTimer]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const playBellSound = async () => {
        try {
            console.log('playBellSound called, bellSound exists:', !!bellSound);
            if (bellSound && typeof bellSound.play === 'function') {
                // Reset to start and play
                bellSound.volume = 1.0;
                await bellSound.seekTo(0);
                await bellSound.play();
                console.log('Bell sound played successfully');
            } else {
                console.log('Bell sound player not available');
            }
        } catch (error) {
            console.error('Error playing bell sound:', error);
        }
    };

    // Get last performance for an exercise
    const getLastPerformance = (exerciseId: string, setNumber: number) => {
        if (!workoutsData) return null;

        // Sort workouts by date (most recent first)
        const sortedWorkouts = [...workoutsData].sort((a: any, b: any) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );

        // Find the most recent workout that contains this exercise
        for (const workout of sortedWorkouts) {
            const exercise = workout.exercises?.find((ex: any) => ex.exerciseId === exerciseId);
            if (exercise && exercise.sets && exercise.sets[setNumber - 1]) {
                const set = exercise.sets[setNumber - 1];
                return {
                    weight: set.weight,
                    reps: set.reps,
                };
            }
        }

        return null;
    };

    const filteredExercises = exercisesData?.filter(
        (exercise) =>
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddExercise = (exercise: Exercise) => {
        if (selectedExercises.find((ex) => ex.id === exercise.id)) {
            return;
        }

        // Get last performance to pre-fill weights
        const getLastWeight = (setNum: number) => {
            const lastPerf = getLastPerformance(exercise.id, setNum);
            return lastPerf?.weight || 0;
        };

        const workoutExercise: WorkoutExercise = {
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            instructions: Array.isArray(exercise.instructions) ? exercise.instructions : [exercise.instructions],
            image: exercise.image,
            category: exercise.category,
            sets: [
                {
                    id: `${exercise.id}-set-1`,
                    setNumber: 1,
                    completed: false,
                    restTimeRemaining: userInfo?.restTimer || 120,
                    weight: getLastWeight(1),
                    reps: 0,
                },
                {
                    id: `${exercise.id}-set-2`,
                    setNumber: 2,
                    completed: false,
                    restTimeRemaining: userInfo?.restTimer || 120,
                    weight: getLastWeight(2),
                    reps: 0,
                },
                {
                    id: `${exercise.id}-set-3`,
                    setNumber: 3,
                    completed: false,
                    restTimeRemaining: userInfo?.restTimer || 120,
                    weight: getLastWeight(3),
                    reps: 0,
                },
                {
                    id: `${exercise.id}-set-4`,
                    setNumber: 4,
                    completed: false,
                    restTimeRemaining: userInfo?.restTimer || 120,
                    weight: getLastWeight(4),
                    reps: 0,
                },
            ],
        };

        setSelectedExercises([...selectedExercises, workoutExercise]);
        setShowExerciseSearch(false);
        setSearchTerm('');
    };

    const handleAddSet = (exerciseId: string) => {
        setSelectedExercises((prev) =>
            prev.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                const newSetNumber = ex.sets.length + 1;
                return {
                    ...ex,
                    sets: [
                        ...ex.sets,
                        {
                            id: `${exerciseId}-set-${newSetNumber}`,
                            setNumber: newSetNumber,
                            completed: false,
                            restTimeRemaining: userInfo?.restTimer || 120,
                            weight: 0,
                            reps: 0,
                        },
                    ],
                };
            })
        );
    };

    const handleCompleteSet = (exerciseId: string, setId: string) => {
        const currentExercise = selectedExercises.find((ex) => ex.id === exerciseId);
        if (!currentExercise) return;

        const setIndex = currentExercise.sets.findIndex((s) => s.id === setId);
        if (setIndex === -1) return;

        const isCompleting = !currentExercise.sets[setIndex].completed;

        setSelectedExercises((prev) => {
            return prev.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                return {
                    ...ex,
                    sets: ex.sets.map((set) =>
                        set.id === setId ? { ...set, completed: !set.completed } : set
                    ),
                };
            });
        });

        if (isCompleting) {
            const currentExerciseIndex = selectedExercises.findIndex((ex) => ex.id === exerciseId);
            const updatedCurrentExercise = {
                ...currentExercise,
                sets: currentExercise.sets.map((set) =>
                    set.id === setId ? { ...set, completed: true } : set
                ),
            };

            const nextIncompleteSetInExercise = updatedCurrentExercise.sets.find(
                (s, idx) => idx > setIndex && !s.completed
            );

            if (nextIncompleteSetInExercise) {
                const newTimer = {
                    exerciseId,
                    setId: nextIncompleteSetInExercise.id,
                    startTime: Date.now(),
                };
                console.log('Starting rest timer:', newTimer);
                setActiveRestTimer(newTimer);
                // Save to AsyncStorage for persistence
                AsyncStorage.setItem('workout_active_rest_timer', JSON.stringify(newTimer)).catch(console.error);
            } else {
                for (let i = currentExerciseIndex + 1; i < selectedExercises.length; i++) {
                    const nextExercise = selectedExercises[i];
                    const firstIncompleteSet = nextExercise.sets.find((s) => !s.completed);
                    if (firstIncompleteSet) {
                        const newTimer = {
                            exerciseId: nextExercise.id,
                            setId: firstIncompleteSet.id,
                            startTime: Date.now(),
                        };
                        console.log('Starting rest timer for next exercise:', newTimer);
                        setActiveRestTimer(newTimer);
                        // Save to AsyncStorage for persistence
                        AsyncStorage.setItem('workout_active_rest_timer', JSON.stringify(newTimer)).catch(console.error);
                        break;
                    }
                }
            }
        }
    };

    const handleRemoveExercise = (exerciseId: string) => {
        setSelectedExercises(selectedExercises.filter((ex) => ex.id !== exerciseId));
    };

    const handleRemoveSet = (exerciseId: string, setId: string) => {
        setSelectedExercises((prev) =>
            prev.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                const updatedSets = ex.sets.filter((s) => s.id !== setId);
                return {
                    ...ex,
                    sets: updatedSets.map((set, index) => ({
                        ...set,
                        setNumber: index + 1,
                        id: `${exerciseId}-set-${index + 1}`,
                    })),
                };
            })
        );
    };

    const handleUpdateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
        setSelectedExercises((prev) =>
            prev.map((ex) => {
                if (ex.id !== exerciseId) return ex;
                return {
                    ...ex,
                    sets: ex.sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set)),
                };
            })
        );
    };

    const handleFinishWorkout = () => {
        Alert.alert(
            'Finish Workout',
            'Are you sure you want to finish and save this workout?',
            [
                {
                    text: 'Keep Working Out',
                    style: 'cancel',
                },
                {
                    text: 'Finish',
                    style: 'default',
                    onPress: confirmFinishWorkout,
                },
            ]
        );
    };

    const confirmFinishWorkout = async () => {
        isFinishingRef.current = true;
        setIsTimerRunning(false);

        // Clear all timers and notifications
        if (workoutTimerIntervalRef.current) {
            clearInterval(workoutTimerIntervalRef.current);
            workoutTimerIntervalRef.current = null;
        }
        if (restTimerIntervalRef.current) {
            clearInterval(restTimerIntervalRef.current);
            restTimerIntervalRef.current = null;
        }
        if (restTimerNotificationId.current) {
            await Notifications.cancelScheduledNotificationAsync(restTimerNotificationId.current);
            restTimerNotificationId.current = null;
        }

        // Cancel all pending notifications for this workout
        await Notifications.cancelAllScheduledNotificationsAsync();

        const hasCompletedSet = selectedExercises.some((exercise) => exercise.sets.some((set) => set.completed));

        if (selectedExercises.length === 0 || !hasCompletedSet) {
            await clearWorkoutData();
            router.replace('/workout');
            return;
        }

        try {
            const savedTemplateName = await AsyncStorage.getItem('workout_template_name');
            const finalTemplateName = templateData?.data?.name || savedTemplateName || 'Template Workout';

            const workoutData = {
                workoutType: templateId ? 'template' : 'freestyle',
                templateId: templateId || undefined,
                templateName: templateId ? finalTemplateName : undefined,
                duration: workoutTime,
                exercises: selectedExercises.map((exercise) => ({
                    exerciseId: exercise.id,
                    exerciseName: exercise.name,
                    sets: exercise.sets.map((set) => ({
                        setNumber: set.setNumber,
                        weight: set.weight || 0,
                        reps: set.reps || 0,
                        completed: set.completed,
                    })),
                })),
                completedAt: new Date().toISOString(),
            };

            await createWorkout(workoutData).unwrap();

            await clearWorkoutData();

            // Navigate to workout summary with data
            router.replace({
                pathname: '/workout/workoutSummary',
                params: {
                    workoutData: JSON.stringify(workoutData),
                    duration: workoutTime.toString(),
                    templateName: finalTemplateName,
                    workoutType: workoutData.workoutType,
                },
            });
        } catch (error: any) {
            console.error('Failed to save workout:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to save workout',
            });

            await clearWorkoutData();
            router.replace('/workout');
        }
    };

    const clearWorkoutData = async () => {
        const keys = [
            'workout_timer_running',
            'workout_exercises',
            'workout_start_time',
            'workout_paused_time',
            'workout_pause_start',
            'workout_template_id',
            'workout_template_name',
            'workout_active_rest_timer',
        ];
        await AsyncStorage.multiRemove(keys);
    };

    const handleCancelWorkout = () => {
        Alert.alert('Cancel Workout', 'Are you sure you want to cancel this workout? All progress will be lost.', [
            {
                text: 'Keep Working Out',
                style: 'cancel',
            },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    isFinishingRef.current = true;
                    setIsTimerRunning(false);

                    // Clear all timers and notifications
                    if (workoutTimerIntervalRef.current) {
                        clearInterval(workoutTimerIntervalRef.current);
                        workoutTimerIntervalRef.current = null;
                    }
                    if (restTimerIntervalRef.current) {
                        clearInterval(restTimerIntervalRef.current);
                        restTimerIntervalRef.current = null;
                    }
                    if (restTimerNotificationId.current) {
                        await Notifications.cancelScheduledNotificationAsync(restTimerNotificationId.current);
                        restTimerNotificationId.current = null;
                    }

                    // Cancel all pending notifications for this workout
                    await Notifications.cancelAllScheduledNotificationsAsync();

                    await clearWorkoutData();
                    router.replace('/workout');
                },
            },
        ]);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clear interval refs on unmount
            if (workoutTimerIntervalRef.current) {
                clearInterval(workoutTimerIntervalRef.current);
            }
            if (restTimerIntervalRef.current) {
                clearInterval(restTimerIntervalRef.current);
            }
        };
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Timer Header */}
            <LinearGradient colors={['#3b82f6', '#2563eb']} style={[styles.timerHeader, { paddingTop: insets.top + 12 }]}>
                <View style={styles.timerContainer}>
                    <View style={styles.timerLeft}>
                        <View style={styles.timerIconContainer}>
                            <Ionicons name="timer-outline" size={24} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.timerLabel}>Workout Duration</Text>
                            <Text style={styles.timerValue}>{formatTime(workoutTime)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.pauseButton}
                        onPress={() => setIsTimerRunning(!isTimerRunning)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={isTimerRunning ? 'pause' : 'play'} size={20} color="#fff" />
                        <Text style={styles.pauseButtonText}>{isTimerRunning ? 'Pause' : 'Resume'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Header Actions */}
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelWorkout} activeOpacity={0.7}>
                            <Ionicons name="close" size={20} color="#ef4444" />
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.finishButton, isSaving && styles.finishButtonDisabled]}
                            onPress={handleFinishWorkout}
                            activeOpacity={0.7}
                            disabled={isSaving}
                        >
                            <Ionicons name="checkmark" size={20} color="#fff" />
                            <Text style={styles.finishButtonText}>Finish</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {templateData?.data?.name || (templateId ? 'Loading...' : 'Freestyle Workout')}
                    </Text>
                    <Text style={styles.subtitle}>
                        {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} added
                    </Text>
                </View>
                {/* Add Exercise Button */}
                {!showExerciseSearch && (
                    <TouchableOpacity
                        style={styles.addExerciseButton}
                        onPress={() => setShowExerciseSearch(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
                        <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
                    </TouchableOpacity>
                )}

                {/* Exercise List */}
                {selectedExercises.map((exercise, exerciseIndex) => (
                    <View key={exercise.id} style={styles.exerciseCard}>
                        {/* Exercise Header */}
                        <View style={styles.exerciseHeader}>
                            <View style={styles.exerciseHeaderLeft}>
                                <View style={styles.exerciseNumber}>
                                    <Text style={styles.exerciseNumberText}>{exerciseIndex + 1}</Text>
                                </View>
                                {exercise.image && (
                                    <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
                                )}
                                <View style={styles.exerciseInfo}>
                                    <Text style={styles.exerciseName} numberOfLines={1}>
                                        {exercise.name}
                                    </Text>
                                    <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveExercise(exercise.id)} activeOpacity={0.7}>
                                <Ionicons name="close-circle" size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </View>

                        {/* Sets List */}
                        <View style={styles.setsContainer}>
                            {exercise.sets.map((set, setIndex) => (
                                <View
                                    key={set.id}
                                    style={[
                                        styles.setRow,
                                        set.completed && styles.setRowCompleted,
                                        activeRestTimer?.setId === set.id && styles.setRowResting,
                                    ]}
                                >
                                    {/* Rest Progress Bar */}
                                    {activeRestTimer?.setId === set.id && set.restTimeRemaining !== undefined && (
                                        <View
                                            style={[
                                                styles.restProgressBar,
                                                { width: `${(set.restTimeRemaining / defaultRestTimer) * 100}%` },
                                            ]}
                                        />
                                    )}

                                    <View style={styles.setRowContent}>
                                        <TouchableOpacity
                                            style={[styles.checkButton, set.completed && styles.checkButtonCompleted]}
                                            onPress={() => handleCompleteSet(exercise.id, set.id)}
                                            activeOpacity={0.7}
                                        >
                                            {set.completed ? (
                                                <Ionicons name="checkmark" size={18} color="#fff" />
                                            ) : (
                                                <Text style={styles.setNumberInCheckbox}>{set.setNumber}</Text>
                                            )}
                                        </TouchableOpacity>

                                        {(() => {
                                            const lastPerf = getLastPerformance(exercise.id, set.setNumber);
                                            return lastPerf ? (
                                                <View style={styles.lastPerformanceContainer}>
                                                    <Text style={styles.lastPerformanceLabel}>Last</Text>
                                                    <Text style={styles.lastPerformanceText}>
                                                        {lastPerf.weight} × {lastPerf.reps}
                                                    </Text>
                                                </View>
                                            ) : <View style={styles.lastPerformancePlaceholder} />;
                                        })()}

                                        <View style={styles.inputGroup}>
                                            <TextInput
                                                style={[styles.input, styles.inputWeight]}
                                                value={set.weight?.toString() || ''}
                                                onChangeText={(text) =>
                                                    handleUpdateSet(exercise.id, set.id, 'weight', parseFloat(text) || 0)
                                                }
                                                keyboardType="numeric"
                                                placeholder="0"
                                                placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                                                editable={!set.completed}
                                                selectTextOnFocus
                                            />
                                            <Text style={styles.inputLabel}>{weightUnit}</Text>
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <TextInput
                                                style={[styles.input, styles.inputReps]}
                                                value={set.reps?.toString() || ''}
                                                onChangeText={(text) =>
                                                    handleUpdateSet(exercise.id, set.id, 'reps', parseInt(text) || 0)
                                                }
                                                keyboardType="numeric"
                                                placeholder="0"
                                                placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                                                editable={!set.completed}
                                                selectTextOnFocus
                                            />
                                            <Text style={styles.inputLabel}>reps</Text>
                                        </View>

                                        {!set.completed && exercise.sets.length > 1 ? (
                                            <TouchableOpacity
                                                onPress={() => handleRemoveSet(exercise.id, set.id)}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name="close-circle" size={20} color="#ef4444" />
                                            </TouchableOpacity>
                                        ) : <View style={styles.deleteIconPlaceholder} />}
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Add Set Button */}
                        <TouchableOpacity
                            style={styles.addSetButton}
                            onPress={() => handleAddSet(exercise.id)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="add" size={18} color="#3b82f6" />
                            <Text style={styles.addSetButtonText}>Add Set</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Empty State */}
                {selectedExercises.length === 0 && !showExerciseSearch && (
                    <View style={styles.emptyState}>
                        <Ionicons name="barbell-outline" size={64} color={isDark ? '#475569' : '#9ca3af'} />
                        <Text style={styles.emptyStateTitle}>No Exercises Yet</Text>
                        <Text style={styles.emptyStateText}>Click &quot;Add Exercise&quot; to start building your workout</Text>
                    </View>
                )}
            </ScrollView>

            {/* Exercise Search Modal */}
            <Modal visible={showExerciseSearch} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Exercise</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowExerciseSearch(false);
                                    setSearchTerm('');
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={24} color={isDark ? '#e2e8f0' : '#374151'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color={isDark ? '#64748b' : '#9ca3af'} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search exercises..."
                                placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                                autoFocus
                            />
                        </View>

                        <ScrollView style={styles.exerciseList}>
                            {exercisesLoading ? (
                                <View style={styles.loadingState}>
                                    <ActivityIndicator size="large" color="#3b82f6" />
                                    <Text style={styles.loadingText}>Loading exercises...</Text>
                                </View>
                            ) : filteredExercises && filteredExercises.length > 0 ? (
                                filteredExercises.map((exercise) => (
                                    <TouchableOpacity
                                        key={exercise.id}
                                        style={styles.exerciseListItem}
                                        onPress={() => handleAddExercise(exercise)}
                                        activeOpacity={0.7}
                                    >
                                        {exercise.image && (
                                            <Image source={{ uri: exercise.image }} style={styles.exerciseListImage} />
                                        )}
                                        <View style={styles.exerciseListInfo}>
                                            <Text style={styles.exerciseListName} numberOfLines={1}>
                                                {exercise.name}
                                            </Text>
                                            <Text style={styles.exerciseListCategory}>{exercise.category}</Text>
                                        </View>
                                        <Ionicons name="add-circle" size={24} color="#3b82f6" />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.emptySearchState}>
                                    <Ionicons name="search-outline" size={48} color={isDark ? '#475569' : '#9ca3af'} />
                                    <Text style={styles.emptySearchText}>
                                        {searchTerm ? 'No exercises found' : 'Start typing to search'}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default StartWorkoutScreen;
