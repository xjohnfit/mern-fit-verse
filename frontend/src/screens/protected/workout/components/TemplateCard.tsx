// React
import { useState } from "react";

// Third-party libraries
import { FileText, MoreVertical, Play, Edit, Trash2, Clock, Target } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

// Redux
import { useDeleteTemplateMutation } from "@/slices/workoutTemplateApiSlice";
import type { WorkoutTemplate } from "@/slices/workoutTemplateApiSlice";

// Components
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
    template: WorkoutTemplate;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();

    const totalSets = template.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
    const avgRestTime = template.exercises.reduce((acc, exercise) => acc + exercise.restTime, 0) / template.exercises.length;

    const handleStartWorkout = () => {
        // Navigate to start workout with template
        navigate(`/workout/start?templateId=${template._id}`);
    };

    const handleEditTemplate = () => {
        // Navigate to edit template
        navigate(`/workout/template/edit/${template._id}`);
    };

    const handleDeleteTemplate = async () => {
        if (!window.confirm(`Are you sure you want to delete the "${template.name}" template?`)) {
            return;
        }

        try {
            await deleteTemplate(template._id).unwrap();
            toast.success("Template deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete template");
        }
        setShowMenu(false);
    };

    return (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium sm:font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                        {template.name}
                    </h4>
                    {template.description && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {template.description}
                        </p>
                    )}
                    {/* Template Stats - Desktop only */}
                    <div className="hidden sm:flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{template.exercises.length} exercises</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{totalSets} sets</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.round(avgRestTime)}s avg rest</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Button
                    size="sm"
                    onClick={handleStartWorkout}
                    className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-8 sm:h-9 px-3 sm:px-4"
                >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Start</span>
                </Button>

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMenu(!showMenu)}
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </Button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                <button
                                    onClick={() => {
                                        handleEditTemplate();
                                        setShowMenu(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteTemplate}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
