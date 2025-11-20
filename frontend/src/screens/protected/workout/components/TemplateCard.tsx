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
import { Card, CardContent } from "@/components/ui/card";
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
        <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-purple-500">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {template.name}
                            </h4>
                            {template.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                    {template.description}
                                </p>
                            )}

                            {/* Template Stats */}
                            <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
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
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={handleStartWorkout}
                            className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                        </Button>

                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMenu(!showMenu)}
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
            </CardContent>
        </Card>
    );
};
