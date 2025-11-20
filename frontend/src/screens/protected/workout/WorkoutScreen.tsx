// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Third-party libraries
import { Dumbbell, FolderPlus, Timer, Zap, Plus } from "lucide-react";

// Redux
import { useGetTemplateFoldersQuery } from "@/slices/workoutTemplateFolderApiSlice";
import { useGetTemplatesQuery } from "@/slices/workoutTemplateApiSlice";
import type { WorkoutTemplateFolder } from "@/slices/workoutTemplateFolderApiSlice";

// Components
import { Card, CardContent } from "@/components/ui/card";
import { CreateFolderDialog } from "./components/CreateFolderDialog";
import { EditFolderDialog } from "./components/EditFolderDialog";
import { LoadingState } from "./components/LoadingState";
import { EmptyTemplatesState } from "./components/EmptyTemplatesState";
import { FolderCard } from "./components/FolderCard";
import { UnsortedTemplatesSection } from "./components/UnsortedTemplatesSection";

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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
                {/* Modern Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-linear-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                            <Dumbbell className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                Workout
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-0.5">
                                Start training or manage your templates
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Workout Banner */}
                {hasActiveWorkout && (
                    <Card className="mb-6 border-2 border-blue-500 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 shadow-lg">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500 rounded-xl shadow-md">
                                        <Timer className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                                            Active Workout
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            You have a workout in progress
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate("/workout/start")}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    Resume Workout
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* My Templates Section */}
                <div className="space-y-4 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                My Templates
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Manage and organize your workout templates
                            </p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setShowCreateFolderDialog(true)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                <FolderPlus className="w-4 h-4" />
                                <span>New Folder</span>
                            </button>
                            <button
                                onClick={() => navigate("/workout/template/create")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Template</span>
                            </button>
                        </div>
                    </div>

                    <Card className="border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4 sm:p-6">
                            {isLoading ? (
                                <LoadingState message="Loading templates..." />
                            ) : folders.length === 0 && templates.length === 0 ? (
                                <EmptyTemplatesState
                                    onCreateFolder={() => setShowCreateFolderDialog(true)}
                                    onCreateTemplate={() => navigate("/workout/template/create")}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {folders.map((folder) => (
                                        <FolderCard
                                            key={folder._id}
                                            folder={folder}
                                            templates={templates}
                                            onEditFolder={handleEditFolder}
                                        />
                                    ))}
                                    <UnsortedTemplatesSection templates={unsortedTemplates} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Freestyle Workout Card */}
                <Card
                    onClick={() => navigate("/workout/start")}
                    className="group cursor-pointer border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1"
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                                QUICK START
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Freestyle Workout
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                            Jump right in and add exercises on the fly. Perfect for spontaneous training sessions.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg">
                                Flexible
                            </span>
                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg">
                                No Planning
                            </span>
                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg">
                                Spontaneous
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
    );
};

export default WorkoutScreen;