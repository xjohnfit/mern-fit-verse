// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Third-party libraries
import { Dumbbell, Plus, Play, Timer } from "lucide-react";

// Redux
import { useGetTemplateFoldersQuery } from "@/slices/workoutTemplateFolderApiSlice";
import { useGetTemplatesQuery } from "@/slices/workoutTemplateApiSlice";
import type { WorkoutTemplateFolder } from "@/slices/workoutTemplateFolderApiSlice";

// Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "./components/PageHeader";
import { WorkoutActionCard } from "./components/WorkoutActionCard";
import { TemplatesHeader } from "./components/TemplatesHeader";
import { LoadingState } from "./components/LoadingState";
import { EmptyTemplatesState } from "./components/EmptyTemplatesState";
import { FolderCard } from "./components/FolderCard";
import { UnsortedTemplatesSection } from "./components/UnsortedTemplatesSection";
import { CreateFolderDialog } from "./components/CreateFolderDialog";
import { EditFolderDialog } from "./components/EditFolderDialog";

const WorkoutScreen = () => {
    const navigate = useNavigate();
    const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
    const [showEditFolderDialog, setShowEditFolderDialog] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<WorkoutTemplateFolder | null>(null);
    const [hasActiveWorkout, setHasActiveWorkout] = useState(false);

    const { data: foldersResponse, isLoading: foldersLoading } = useGetTemplateFoldersQuery();
    const { data: templatesResponse, isLoading: templatesLoading } = useGetTemplatesQuery();

    const folders = foldersResponse?.data || [];
    const templates = templatesResponse?.data || [];
    const unsortedTemplates = templates.filter(t => !t.folderId);

    const handleEditFolder = (folder: WorkoutTemplateFolder) => {
        setSelectedFolder(folder);
        setShowEditFolderDialog(true);
    };

    // Check for active workout session
    useEffect(() => {
        const checkActiveWorkout = () => {
            const hasSession = sessionStorage.getItem("workout_start_time") !== null;
            setHasActiveWorkout(hasSession);
        };

        checkActiveWorkout();
        // Check periodically in case session is cleared elsewhere
        const interval = setInterval(checkActiveWorkout, 1000);
        return () => clearInterval(interval);
    }, []);

    const isLoading = foldersLoading || templatesLoading;

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                <PageHeader
                    icon={Dumbbell}
                    title="Workout"
                    description="Start a workout or create a custom template"
                />

                {/* Active Workout Session Alert */}
                {hasActiveWorkout && (
                    <Card className="mb-6 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <Timer className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Active Workout Session</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">You have a workout in progress</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate("/workout/start")}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                                >
                                    Resume Workout
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Action Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <WorkoutActionCard
                        title="Start Freestyle Workout"
                        description="Begin a quick workout session without a template. Add exercises on the fly and track your performance in real-time."
                        icon={Play}
                        iconGradient="from-blue-500 to-blue-600"
                        benefits={[
                            "Quick training sessions",
                            "Spontaneous workouts",
                            "Trying new exercises",
                            "Flexible training days"
                        ]}
                        benefitColor="blue"
                        buttonText="Start Freestyle Workout"
                        buttonGradient="from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        hoverBorderColor="blue-500"
                        onClick={() => navigate("/workout/start")}
                    />

                    <WorkoutActionCard
                        title="Create Workout Template"
                        description="Design a structured workout plan with predefined exercises, sets, and reps. Save it for repeated use."
                        icon={Plus}
                        iconGradient="from-purple-500 to-purple-600"
                        benefits={[
                            "Structured training programs",
                            "Consistency in your routine",
                            "Progressive overload tracking",
                            "Sharing with others"
                        ]}
                        benefitColor="purple"
                        buttonText="Create New Template"
                        buttonGradient="from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        hoverBorderColor="purple-500"
                        onClick={() => navigate("/workout/template/create")}
                    />
                </div>

                {/* Saved Templates Section */}
                <Card>
                    <CardHeader>
                        <TemplatesHeader
                            onCreateFolder={() => setShowCreateFolderDialog(true)}
                            onCreateTemplate={() => navigate("/workout/template/create")}
                        />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingState message="Loading templates..." />
                        ) : folders.length === 0 && templates.length === 0 ? (
                            <EmptyTemplatesState
                                onCreateFolder={() => setShowCreateFolderDialog(true)}
                                onCreateTemplate={() => navigate("/workout/template/create")}
                            />
                        ) : (
                            <div className="space-y-4">
                                {/* Folders with templates */}
                                {folders.map((folder) => (
                                    <FolderCard
                                        key={folder._id}
                                        folder={folder}
                                        templates={templates}
                                        onEditFolder={handleEditFolder}
                                    />
                                ))}

                                {/* Unsorted templates */}
                                <UnsortedTemplatesSection templates={unsortedTemplates} />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialogs */}
                <CreateFolderDialog
                    open={showCreateFolderDialog}
                    onOpenChange={setShowCreateFolderDialog}
                />
                <EditFolderDialog
                    open={showEditFolderDialog}
                    onOpenChange={setShowEditFolderDialog}
                    folder={selectedFolder}
                />
            </div>
        </div>
    );
};

export default WorkoutScreen;