// React
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

// Third-party libraries
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

// Redux
import { useGetExercisesQuery } from "@/slices/exerciseApiSlice";
import { useGetTemplateByIdQuery, useUpdateTemplateMutation } from "@/slices/workoutTemplateApiSlice";
import { useGetTemplateFoldersQuery } from "@/slices/workoutTemplateFolderApiSlice";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateTemplateForm } from "@/screens/protected/workout/components/CreateTemplateForm";
import { ExerciseSearchDialog } from "@/screens/protected/workout/components/ExerciseSearchDialog";
import { EmptyExercisesState } from "@/screens/protected/workout/components/EmptyExercisesState";
import { TemplateExerciseCard } from "@/screens/protected/workout/components/TemplateExerciseCard";
import { TemplateFormActions } from "@/screens/protected/workout/components/TemplateFormActions";

// Types
import type { TemplateExercise } from "@/screens/protected/workout/types";

const EditTemplateScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string; }>();

    const { data: templateResponse, isLoading: templateLoading, error: templateError } = useGetTemplateByIdQuery(id!);
    const { data: exercises, isLoading: exercisesLoading } = useGetExercisesQuery();
    const { data: foldersResponse } = useGetTemplateFoldersQuery();
    const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();

    const [templateName, setTemplateName] = useState("");
    const [templateDescription, setTemplateDescription] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState<string>("");
    const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([]);
    const [showExerciseSearch, setShowExerciseSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const folders = foldersResponse?.data || [];
    const template = templateResponse?.data;

    // Load template data when available
    useEffect(() => {
        if (template) {
            setTemplateName(template.name);
            setTemplateDescription(template.description || "");
            setSelectedFolderId(template.folderId || "");
            setTemplateExercises(
                template.exercises.map((exercise: any) => ({
                    ...exercise,
                    sets: exercise.sets.map((set: any) => ({
                        ...set,
                        targetWeight: set.targetWeight ?? 0,
                    })),
                }))
            );
        }
    }, [template]);

    // Handle template not found
    useEffect(() => {
        if (templateError) {
            toast.error("Template not found");
            navigate("/workout");
        }
    }, [templateError, navigate]);

    const filteredExercises = exercises?.filter((exercise: any) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddExercise = (exercise: any) => {
        const newExercise: TemplateExercise = {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: [
                { setNumber: 1, targetReps: 10, targetWeight: 0, notes: "" }
            ],
            restTime: 60,
            notes: "",
        };

        setTemplateExercises([...templateExercises, newExercise]);
        setShowExerciseSearch(false);
        setSearchTerm("");
        toast.success(`${exercise.name} added to template`);
    };

    const handleRemoveExercise = (exerciseId: string) => {
        setTemplateExercises(templateExercises.filter(ex => ex.exerciseId !== exerciseId));
    };

    const handleAddSet = (exerciseId: string) => {
        setTemplateExercises(templateExercises.map(ex => {
            if (ex.exerciseId === exerciseId) {
                const newSetNumber = ex.sets.length + 1;
                return {
                    ...ex,
                    sets: [...ex.sets, {
                        setNumber: newSetNumber,
                        targetReps: 10,
                        targetWeight: 0,
                        notes: ""
                    }]
                };
            }
            return ex;
        }));
    };

    const handleRemoveSet = (exerciseId: string, setNumber: number) => {
        setTemplateExercises(templateExercises.map(ex => {
            if (ex.exerciseId === exerciseId && ex.sets.length > 1) {
                return {
                    ...ex,
                    sets: ex.sets
                        .filter(s => s.setNumber !== setNumber)
                        .map((s, idx) => ({ ...s, setNumber: idx + 1 }))
                };
            }
            return ex;
        }));
    };

    const handleUpdateSet = (exerciseId: string, setNumber: number, field: keyof TemplateExercise['sets'][0], value: any) => {
        setTemplateExercises(templateExercises.map(ex => {
            if (ex.exerciseId === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.map(s =>
                        s.setNumber === setNumber ? { ...s, [field]: value } : s
                    )
                };
            }
            return ex;
        }));
    };

    const handleUpdateRestTime = (exerciseId: string, restTime: number) => {
        setTemplateExercises(templateExercises.map(ex =>
            ex.exerciseId === exerciseId ? { ...ex, restTime } : ex
        ));
    };

    const handleUpdateTemplate = async () => {
        if (!templateName.trim()) {
            toast.error("Please enter a template name");
            return;
        }

        if (templateExercises.length === 0) {
            toast.error("Please add at least one exercise");
            return;
        }

        try {
            await updateTemplate({
                id: id!,
                name: templateName.trim(),
                description: templateDescription.trim() || undefined,
                exercises: templateExercises,
                folderId: selectedFolderId || undefined,
            }).unwrap();

            toast.success("Template updated successfully!");
            navigate("/workout");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update template");
        }
    };

    if (templateLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading template...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/workout")}
                        className="mb-4 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Workout
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                                Edit Workout Template
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Update your workout plan with exercises, sets, and rest times
                            </p>
                        </div>
                    </div>
                </div>

                {/* Template Details */}
                <CreateTemplateForm
                    name={templateName}
                    description={templateDescription}
                    folderId={selectedFolderId}
                    folders={folders}
                    onNameChange={setTemplateName}
                    onDescriptionChange={setTemplateDescription}
                    onFolderChange={setSelectedFolderId}
                />

                {/* Exercises Section */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Exercises</CardTitle>
                            {!showExerciseSearch && (
                                <Button
                                    size="sm"
                                    onClick={() => setShowExerciseSearch(true)}
                                    className="bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Exercise
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Exercise Search */}
                        <ExerciseSearchDialog
                            isOpen={showExerciseSearch}
                            onClose={() => {
                                setShowExerciseSearch(false);
                                setSearchTerm("");
                            }}
                            exercises={filteredExercises || []}
                            isLoading={exercisesLoading}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onAddExercise={handleAddExercise}
                        />

                        {/* Template Exercises List */}
                        {templateExercises.length === 0 ? (
                            <EmptyExercisesState onAddClick={() => setShowExerciseSearch(true)} />
                        ) : (
                            templateExercises.map((exercise, index) => (
                                <TemplateExerciseCard
                                    key={exercise.exerciseId}
                                    exercise={exercise}
                                    index={index}
                                    onRemove={() => handleRemoveExercise(exercise.exerciseId)}
                                    onAddSet={() => handleAddSet(exercise.exerciseId)}
                                    onRemoveSet={(setNumber) => handleRemoveSet(exercise.exerciseId, setNumber)}
                                    onUpdateSet={(setNumber, field, value) => handleUpdateSet(exercise.exerciseId, setNumber, field, value)}
                                    onUpdateRestTime={(restTime) => handleUpdateRestTime(exercise.exerciseId, restTime)}
                                />
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Save Button */}
                <TemplateFormActions
                    onCancel={() => navigate("/workout")}
                    onSave={handleUpdateTemplate}
                    isSaving={isUpdating}
                    canSave={templateName.trim() !== "" && templateExercises.length > 0}
                    saveButtonText="Save Changes"
                />
            </div>
        </div>
    );
};

export default EditTemplateScreen;
