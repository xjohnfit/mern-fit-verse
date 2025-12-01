// React
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";

// Third-party libraries
import { Search, Dumbbell, Plus, ArrowLeft, X, Timer, Play, Pause, Check } from "lucide-react";
import { toast } from "sonner";

// Redux slices
import { useGetExercisesQuery } from "@/slices/exerciseApiSlice";
import { useCreateWorkoutMutation } from "@/slices/workoutApiSlice";
import {
    useGetTemplateByIdQuery,
    type WorkoutTemplateExercise,
    type WorkoutTemplateSet
} from "@/slices/workoutTemplateApiSlice";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/AlertModal";

// Types
import type { Exercise, WorkoutSet, WorkoutExercise } from "@/screens/protected/workout/workout.types";

const StartWorkoutScreen = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const templateIdFromUrl = searchParams.get('templateId');

    // Initialize and persist templateId
    const [templateId] = useState<string | null>(() => {
        const savedTemplateId = sessionStorage.getItem("workout_template_id");
        if (templateIdFromUrl) {
            sessionStorage.setItem("workout_template_id", templateIdFromUrl);
            return templateIdFromUrl;
        }
        return savedTemplateId;
    });

    const { data: exercises, isLoading } = useGetExercisesQuery();
    const { data: template } = useGetTemplateByIdQuery(templateId!, {
        skip: !templateId,
    });
    const [createWorkout] = useCreateWorkoutMutation();
    const toastShownRef = useRef<Set<string>>(new Set());
    const isFinishingRef = useRef(false);
    const templateLoadedRef = useRef(false);
    const { userInfo } = useSelector((state: any) => state.auth);
    const weightUnit = userInfo?.weightUnit || 'lbs';

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(() => {
        const saved = sessionStorage.getItem("workout_exercises");
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            // Ensure all exercises have sets array
            return parsed.map((ex: any) => ({
                ...ex,
                sets: ex.sets || [{
                    id: `${ex.id}-set-1`,
                    setNumber: 1,
                    completed: false,
                    restTimeRemaining: 120
                }]
            }));
        } catch {
            return [];
        }
    });
    const [showExerciseSearch, setShowExerciseSearch] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [activeRestTimer, setActiveRestTimer] = useState<{ exerciseId: string; setId: string; startTime: number; } | null>(null);

    // Initialize workout start time
    const [workoutStartTime] = useState(() => {
        const savedStartTime = sessionStorage.getItem("workout_start_time");
        if (!savedStartTime) {
            const startTime = Date.now();
            sessionStorage.setItem("workout_start_time", startTime.toString());
            sessionStorage.setItem("workout_timer_running", "true");
            return startTime;
        }
        return parseInt(savedStartTime);
    });

    // Initialize paused time
    const [pausedTime, setPausedTime] = useState(() => {
        const savedPausedTime = sessionStorage.getItem("workout_paused_time");
        const savedPauseStart = sessionStorage.getItem("workout_pause_start");

        let paused = savedPausedTime ? parseInt(savedPausedTime) : 0;

        // Handle pause start time from previous session
        if (savedPauseStart) {
            const pauseStart = parseInt(savedPauseStart);
            const additionalPause = Date.now() - pauseStart;
            paused += additionalPause;
            sessionStorage.setItem("workout_paused_time", paused.toString());
            sessionStorage.removeItem("workout_pause_start");
        }

        return paused;
    });

    // Initialize pause start time
    const [pauseStartTime, setPauseStartTime] = useState<number | null>(() => {
        // Always return null since we handled it in pausedTime initialization
        return null;
    });

    // Initialize timer running state
    const [isTimerRunning, setIsTimerRunning] = useState(() => {
        const savedRunning = sessionStorage.getItem("workout_timer_running");
        return savedRunning ? savedRunning === "true" : true;
    });

    // Initialize workout time based on elapsed time
    const [workoutTime, setWorkoutTime] = useState(() => {
        const savedStartTime = sessionStorage.getItem("workout_start_time");
        const savedPausedTime = sessionStorage.getItem("workout_paused_time");
        if (savedStartTime) {
            const startTime = parseInt(savedStartTime);
            const paused = savedPausedTime ? parseInt(savedPausedTime) : 0;
            return Math.floor((Date.now() - startTime - paused) / 1000);
        }
        return 0;
    });

    // Timer effect - uses timestamp-based calculation
    useEffect(() => {
        let interval: number;
        if (isTimerRunning) {
            interval = window.setInterval(() => {
                const elapsed = Math.floor((Date.now() - workoutStartTime - pausedTime) / 1000);
                setWorkoutTime(elapsed);
            }, 100); // Update more frequently for accuracy
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, workoutStartTime, pausedTime]);

    // Save timer running state and handle pause/resume
    useEffect(() => {
        // Don't save to sessionStorage if we're finishing the workout
        if (isFinishingRef.current) return;

        sessionStorage.setItem("workout_timer_running", isTimerRunning.toString());

        if (!isTimerRunning && pauseStartTime === null) {
            // Just paused
            const newPauseStart = Date.now();
            setPauseStartTime(newPauseStart);
            sessionStorage.setItem("workout_pause_start", newPauseStart.toString());
        } else if (isTimerRunning && pauseStartTime !== null) {
            // Just resumed
            const pauseDuration = Date.now() - pauseStartTime;
            const newPausedTime = pausedTime + pauseDuration;
            setPausedTime(newPausedTime);
            sessionStorage.setItem("workout_paused_time", newPausedTime.toString());
            setPauseStartTime(null);
            sessionStorage.removeItem("workout_pause_start");
        }
    }, [isTimerRunning]);

    // Save selected exercises
    useEffect(() => {
        // Don't save to sessionStorage if we're finishing the workout
        if (isFinishingRef.current) return;
        sessionStorage.setItem("workout_exercises", JSON.stringify(selectedExercises));
    }, [selectedExercises]);

    // Load template exercises if templateId is provided
    useEffect(() => {
        if (template?.data && !templateLoadedRef.current && exercises) {
            templateLoadedRef.current = true;

            const templateData = template.data;

            // Convert template exercises to workout exercises
            const templateExercises: WorkoutExercise[] = templateData.exercises.map((templateExercise: WorkoutTemplateExercise) => {
                // Find the full exercise data
                const exerciseData = exercises.find(ex => ex.id === templateExercise.exerciseId);

                if (!exerciseData) return null;

                // Create workout sets from template sets
                const workoutSets: WorkoutSet[] = templateExercise.sets.map((templateSet: WorkoutTemplateSet, index: number) => ({
                    id: `${exerciseData.id}-set-${index + 1}`,
                    setNumber: index + 1,
                    completed: false,
                    weight: templateSet.targetWeight || 0,
                    reps: templateSet.targetReps,
                }));

                return {
                    id: exerciseData.id,
                    name: exerciseData.name,
                    description: exerciseData.description,
                    instructions: exerciseData.instructions,
                    image: exerciseData.image,
                    category: exerciseData.category,
                    sets: workoutSets,
                };
            }).filter(Boolean) as WorkoutExercise[];

            if (templateExercises.length > 0) {
                setSelectedExercises(templateExercises);
                // Save template name to sessionStorage
                sessionStorage.setItem("workout_template_name", templateData.name);
                toast.success(`Loaded template: ${templateData.name}`);
            }
        }
    }, [template, exercises]);

    // Rest timer effect - uses timestamp-based calculation
    useEffect(() => {
        if (!activeRestTimer) return;

        const interval = window.setInterval(() => {
            const elapsed = Math.floor((Date.now() - activeRestTimer.startTime) / 1000);
            const restDuration = 120; // 2 minutes in seconds
            const remaining = restDuration - elapsed;

            if (remaining <= 0) {
                setActiveRestTimer(null);
                const toastKey = `rest-complete-${activeRestTimer.setId}`;
                if (!toastShownRef.current.has(toastKey)) {
                    toastShownRef.current.add(toastKey);
                    toast.success("Rest time complete!");
                    setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
                }
                // Update the set's rest time to 0
                setSelectedExercises(prev => prev.map(ex => {
                    if (ex.id !== activeRestTimer.exerciseId) return ex;
                    return {
                        ...ex,
                        sets: ex.sets.map(set =>
                            set.id === activeRestTimer.setId
                                ? { ...set, restTimeRemaining: 0 }
                                : set
                        )
                    };
                }));
            } else {
                // Update the rest time remaining
                setSelectedExercises(prev => prev.map(ex => {
                    if (ex.id !== activeRestTimer.exerciseId) return ex;
                    return {
                        ...ex,
                        sets: ex.sets.map(set =>
                            set.id === activeRestTimer.setId
                                ? { ...set, restTimeRemaining: remaining }
                                : set
                        )
                    };
                }));
            }
        }, 100); // Update more frequently for accuracy

        return () => clearInterval(interval);
    }, [activeRestTimer]);

    // Format time as HH:MM:SS
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Filter exercises based on search
    const filteredExercises = exercises?.filter((exercise) => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleAddExercise = (exercise: Exercise) => {
        if (selectedExercises.find(ex => ex.id === exercise.id)) {
            const toastKey = `duplicate-${exercise.id}`;
            if (!toastShownRef.current.has(toastKey)) {
                toastShownRef.current.add(toastKey);
                toast.info("Exercise already added to workout");
                setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
            }
            return;
        }
        const workoutExercise: WorkoutExercise = {
            ...exercise,
            sets: [
                {
                    id: `${exercise.id}-set-1`,
                    setNumber: 1,
                    completed: false,
                    restTimeRemaining: 120,
                    weight: 0,
                    reps: 0
                },
                {
                    id: `${exercise.id}-set-2`,
                    setNumber: 2,
                    completed: false,
                    restTimeRemaining: 120,
                    weight: 0,
                    reps: 0
                },
                {
                    id: `${exercise.id}-set-3`,
                    setNumber: 3,
                    completed: false,
                    restTimeRemaining: 120,
                    weight: 0,
                    reps: 0
                },
                {
                    id: `${exercise.id}-set-4`,
                    setNumber: 4,
                    completed: false,
                    restTimeRemaining: 120,
                    weight: 0,
                    reps: 0
                }
            ]
        };
        setSelectedExercises([...selectedExercises, workoutExercise]);
        const toastKey = `added-${exercise.id}`;
        if (!toastShownRef.current.has(toastKey)) {
            toastShownRef.current.add(toastKey);
            toast.success(`${exercise.name} added to workout`);
            setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
        }
        setShowExerciseSearch(false);
        setSearchTerm("");
    };

    const handleAddSet = (exerciseId: string) => {
        setSelectedExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            const newSetNumber = ex.sets.length + 1;
            return {
                ...ex,
                sets: [...ex.sets, {
                    id: `${exerciseId}-set-${newSetNumber}`,
                    setNumber: newSetNumber,
                    completed: false,
                    restTimeRemaining: 120,
                    weight: 0,
                    reps: 0
                }]
            };
        }));
        const toastKey = `set-added-${exerciseId}-${Date.now()}`;
        if (!toastShownRef.current.has(toastKey)) {
            toastShownRef.current.add(toastKey);
            toast.success("Set added");
            setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
        }
    };

    const handleCompleteSet = (exerciseId: string, setId: string) => {
        setSelectedExercises(prev => {
            const updatedExercises = prev.map(ex => {
                if (ex.id !== exerciseId) return ex;
                const setIndex = ex.sets.findIndex(s => s.id === setId);
                if (setIndex === -1) return ex;

                const updatedSets = ex.sets.map(set =>
                    set.id === setId ? { ...set, completed: !set.completed } : set
                );

                return { ...ex, sets: updatedSets };
            });

            // Find the current exercise and set
            const currentExerciseIndex = updatedExercises.findIndex(ex => ex.id === exerciseId);
            const currentExercise = updatedExercises[currentExerciseIndex];
            const setIndex = currentExercise.sets.findIndex(s => s.id === setId);
            const isCompleting = !prev.find(ex => ex.id === exerciseId)?.sets[setIndex]?.completed;

            // Only start timer if completing (not uncompleting)
            if (isCompleting) {
                // Look for next incomplete set in current exercise
                const nextIncompleteSetInExercise = currentExercise.sets.find((s, idx) => idx > setIndex && !s.completed);

                const toastKey = `complete-${setId}`;
                if (!toastShownRef.current.has(toastKey)) {
                    toastShownRef.current.add(toastKey);

                    if (nextIncompleteSetInExercise) {
                        // Found next set in same exercise
                        setActiveRestTimer({
                            exerciseId,
                            setId: nextIncompleteSetInExercise.id,
                            startTime: Date.now()
                        });
                        toast.success(`Set ${setIndex + 1} complete! Rest timer started.`);
                    } else {
                        // No more sets in current exercise, look for next exercise with incomplete sets
                        let foundNextSet = false;
                        for (let i = currentExerciseIndex + 1; i < updatedExercises.length; i++) {
                            const nextExercise = updatedExercises[i];
                            const firstIncompleteSet = nextExercise.sets.find(s => !s.completed);
                            if (firstIncompleteSet) {
                                setActiveRestTimer({
                                    exerciseId: nextExercise.id,
                                    setId: firstIncompleteSet.id,
                                    startTime: Date.now()
                                });
                                toast.success(`Set ${setIndex + 1} complete! Moving to next exercise. Rest timer started.`);
                                foundNextSet = true;
                                break;
                            }
                        }
                        if (!foundNextSet) {
                            toast.success(`Set ${setIndex + 1} complete! All sets done!`);
                        }
                    }
                    setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
                }
            } else {
                // Uncompleting a set
                const toastKey = `uncomplete-${setId}`;
                if (!toastShownRef.current.has(toastKey)) {
                    toastShownRef.current.add(toastKey);
                    toast.info(`Set ${setIndex + 1} marked as incomplete`);
                    setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
                }
            }

            return updatedExercises;
        });
    };

    const handleRemoveExercise = (exerciseId: string) => {
        setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
        const toastKey = `remove-${exerciseId}`;
        if (!toastShownRef.current.has(toastKey)) {
            toastShownRef.current.add(toastKey);
            toast.success("Exercise removed from workout");
            setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
        }
    };

    const handleRemoveSet = (exerciseId: string, setId: string) => {
        setSelectedExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            const updatedSets = ex.sets.filter(s => s.id !== setId);
            // Renumber sets after deletion
            return {
                ...ex,
                sets: updatedSets.map((set, index) => ({
                    ...set,
                    setNumber: index + 1,
                    id: `${exerciseId}-set-${index + 1}`
                }))
            };
        }));
        const toastKey = `remove-set-${setId}`;
        if (!toastShownRef.current.has(toastKey)) {
            toastShownRef.current.add(toastKey);
            toast.success("Set removed");
            setTimeout(() => toastShownRef.current.delete(toastKey), 3000);
        }
    };

    const handleUpdateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
        setSelectedExercises(prev => prev.map(ex => {
            if (ex.id !== exerciseId) return ex;
            return {
                ...ex,
                sets: ex.sets.map(set =>
                    set.id === setId ? { ...set, [field]: value } : set
                )
            };
        }));
    };

    const handleFinishWorkout = async () => {
        // Set flag to prevent useEffects from saving to sessionStorage
        isFinishingRef.current = true;
        setIsTimerRunning(false);

        // Check if at least one set is completed
        const hasCompletedSet = selectedExercises.some(exercise =>
            exercise.sets.some(set => set.completed)
        );

        if (selectedExercises.length === 0 || !hasCompletedSet) {
            const message = selectedExercises.length === 0
                ? "Workout Canceled."
                : "Workout Canceled. No sets were completed.";
            toast.info(message);
            // Clear session storage immediately and synchronously
            ["workout_timer_running", "workout_exercises", "workout_start_time", "workout_paused_time", "workout_pause_start", "workout_template_id", "workout_template_name"].forEach(key => {
                sessionStorage.removeItem(key);
            });
            navigate("/workout");
            return;
        }

        try {
            // Get template data from sessionStorage as fallback
            const savedTemplateName = sessionStorage.getItem("workout_template_name");
            const finalTemplateName = template?.data?.name || savedTemplateName || "Template Workout";

            // Prepare workout data for backend
            const workoutData = {
                workoutType: templateId ? "template" : "freestyle",
                templateId: templateId || undefined,
                templateName: templateId ? finalTemplateName : undefined,
                duration: workoutTime,
                exercises: selectedExercises.map((exercise) => ({
                    exerciseId: exercise.id,
                    exerciseName: exercise.name,
                    sets: exercise.sets.map((set) => ({
                        setNumber: set.setNumber,
                        weight: set.weight,
                        reps: set.reps,
                        completed: set.completed,
                    })),
                })),
                completedAt: new Date().toISOString(),
            };

            await createWorkout(workoutData).unwrap();
            toast.success(`Workout saved! Duration: ${formatTime(workoutTime)}`);

            // Clear session storage immediately before navigation
            ["workout_timer_running", "workout_exercises", "workout_start_time", "workout_paused_time", "workout_pause_start", "workout_template_id", "workout_template_name"].forEach(key => {
                sessionStorage.removeItem(key);
            });
            navigate("/workout");
        } catch (error: any) {
            console.error("Failed to save workout:", error);
            toast.error("Failed to save workout. Please try again.");

            // Clear session storage even on error before navigation
            ["workout_timer_running", "workout_exercises", "workout_start_time", "workout_paused_time", "workout_pause_start", "workout_template_id", "workout_template_name"].forEach(key => {
                sessionStorage.removeItem(key);
            });
            navigate("/workout");
        }
    };

    const handleBackToWorkout = () => {
        // Navigate back without clearing session storage
        // The workout session will be preserved for resuming later
        navigate("/workout");
    };

    const handleCancelWorkout = () => {
        setShowCancelModal(true);
    };

    const confirmCancelWorkout = () => {
        // Set flag to prevent useEffects from saving to sessionStorage
        isFinishingRef.current = true;
        setIsTimerRunning(false);

        // Clear session storage immediately and synchronously
        ["workout_timer_running", "workout_exercises", "workout_start_time", "workout_paused_time", "workout_pause_start", "workout_template_id", "workout_template_name"].forEach(key => {
            sessionStorage.removeItem(key);
        });

        toast.info("Workout cancelled");
        navigate("/workout");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToWorkout}
                        className="mb-4 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Workout
                    </Button>

                    {/* Timer Display */}
                    <Card className="mb-6 bg-linear-to-r from-blue-500 to-blue-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white/20 rounded-lg">
                                        <Timer className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-xs sm:text-sm font-medium">Workout Duration</p>
                                        <p className="text-white text-2xl sm:text-3xl font-bold font-mono">{formatTime(workoutTime)}</p>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                    {isTimerRunning ? (
                                        <>
                                            <Pause className="w-5 h-5 mr-2" />
                                            Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 mr-2" />
                                            Resume
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                {template?.data?.name || (templateId ? template?.data.name : "Freestyle Workout")}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                {selectedExercises.length} exercise{selectedExercises.length !== 1 ? "s" : ""} added
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleCancelWorkout}
                                className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleFinishWorkout}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Dumbbell className="w-5 h-5 mr-2" />
                                Finish
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Workout Content */}
                <div className="space-y-4">
                    {/* Add Exercise Button */}
                    {!showExerciseSearch && (
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowExerciseSearch(true)}
                            className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Exercise
                        </Button>
                    )}

                    {/* Exercise Search Modal */}
                    {showExerciseSearch && (
                        <Card className="border-2 border-blue-500">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Add Exercise</CardTitle>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setShowExerciseSearch(false);
                                            setSearchTerm("");
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search exercises..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-10 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                        autoFocus
                                    />
                                </div>

                                {/* Exercise List */}
                                {isLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Loading exercises...</p>
                                    </div>
                                ) : filteredExercises && filteredExercises.length > 0 ? (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {filteredExercises.map((exercise) => (
                                            <div
                                                key={exercise.id}
                                                onClick={() => handleAddExercise(exercise)}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {exercise.image && (
                                                        <img
                                                            src={exercise.image}
                                                            alt={exercise.name}
                                                            className="w-10 h-10 object-cover rounded-md shrink-0"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm mb-0.5 truncate">{exercise.name}</h3>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                            {exercise.category}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Plus className="w-5 h-5 text-blue-500 shrink-0 ml-3" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Dumbbell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {searchTerm ? "No exercises found" : "Start typing to search"}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Exercise List */}
                    {selectedExercises.length > 0 && (
                        <div className="space-y-4 mb-6">
                            {selectedExercises.map((exercise, index) => (
                                <Card key={exercise.id}>
                                    <CardContent className="p-4">
                                        {/* Exercise Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-semibold rounded-full">
                                                    {index + 1}
                                                </span>
                                                {exercise.image && (
                                                    <img
                                                        src={exercise.image}
                                                        alt={exercise.name}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-base sm:text-lg">{exercise.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">{exercise.category}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleRemoveExercise(exercise.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Sets List */}
                                        <div className="space-y-2 mb-3">
                                            {exercise.sets?.map((set) => (
                                                <div
                                                    key={set.id}
                                                    className={`relative overflow-hidden flex items-center justify-between p-3 rounded-lg border-2 ${set.completed
                                                        ? "bg-green-50 border-green-500 dark:bg-green-900/20"
                                                        : activeRestTimer?.setId === set.id
                                                            ? "border-blue-500 dark:bg-blue-900/20"
                                                            : "bg-gray-50 border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                                                        }`}
                                                >
                                                    {/* Progress Bar Background - starts full and drains */}
                                                    {activeRestTimer?.setId === set.id && set.restTimeRemaining !== undefined && (
                                                        <div
                                                            className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 transition-all"
                                                            style={{
                                                                width: `${(set.restTimeRemaining / 120) * 100}%`,
                                                                transition: 'width 1s linear'
                                                            }}
                                                        />
                                                    )}

                                                    <div className="relative flex items-center gap-3 z-10">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleCompleteSet(exercise.id, set.id)}
                                                            className={`w-8 h-8 p-0 rounded-full ${set.completed
                                                                ? "bg-green-500 text-white hover:bg-green-600"
                                                                : "bg-white border-2 border-gray-300 hover:border-blue-500"
                                                                }`}
                                                        >
                                                            {set.completed && <Check className="w-4 h-4" />}
                                                        </Button>
                                                        <div>
                                                            <p className="font-semibold text-sm">Set {set.setNumber}</p>
                                                            {set.completed && (
                                                                <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
                                                            )}
                                                        </div>

                                                        {/* Weight and Reps Inputs - Always visible */}
                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                                <input
                                                                    type="number"
                                                                    value={set.weight || ''}
                                                                    onChange={(e) => handleUpdateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                                                                    placeholder="0"
                                                                    className={`w-12 sm:w-16 h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm border rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500 ${set.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''
                                                                        }`}
                                                                />
                                                                <span className="text-[10px] sm:text-xs text-gray-500">{weightUnit}</span>
                                                            </div>
                                                            <span className="text-xs sm:text-sm text-gray-300">×</span>
                                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                                <input
                                                                    type="number"
                                                                    value={set.reps || ''}
                                                                    onChange={(e) => handleUpdateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                                                                    placeholder="0"
                                                                    className={`w-12 sm:w-16 h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm border rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500 ${set.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''
                                                                        }`}
                                                                />
                                                                <span className="text-[10px] sm:text-xs text-gray-500">reps</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="relative flex items-center gap-2 z-10">
                                                        {/* Rest Timer */}
                                                        {activeRestTimer?.setId === set.id && set.restTimeRemaining !== undefined && (
                                                            <div className="flex items-center gap-1 sm:gap-2 text-blue-600 dark:text-blue-400">
                                                                <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                <span className="font-mono font-semibold text-xs sm:text-sm">
                                                                    {Math.floor(set.restTimeRemaining / 60)}:{(set.restTimeRemaining % 60).toString().padStart(2, '0')}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Delete Set Button */}
                                                        {!set.completed && exercise.sets.length > 1 && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleRemoveSet(exercise.id, set.id)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-6 h-6 p-0"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Set Button */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAddSet(exercise.id)}
                                            className="w-full border-dashed"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Set
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {selectedExercises.length === 0 && !showExerciseSearch && (
                        <Card className="border-dashed border-2">
                            <CardContent className="py-12 text-center">
                                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    No Exercises Yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Click "Add Exercise" to start building your workout
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Cancel Workout Confirmation Modal */}
            <AlertModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={confirmCancelWorkout}
                title="Cancel Workout"
                message="Are you sure you want to cancel this workout? All progress will be lost and cannot be recovered."
                confirmText="Yes, Cancel Workout"
                cancelText="Keep Working Out"
                variant="danger"
            />
        </div>
    );
};

export default StartWorkoutScreen;
