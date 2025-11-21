// React
import { useState } from "react";

// Third-party libraries
import { FolderOpen, MoreVertical, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// Redux
import { useDeleteTemplateFolderMutation } from "@/slices/workoutTemplateFolderApiSlice";
import type { WorkoutTemplate } from "@/slices/workoutTemplateApiSlice";
import type { WorkoutTemplateFolder } from "@/slices/workoutTemplateFolderApiSlice";

// Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TemplateCard } from "./TemplateCard";
import AlertModal from "@/components/modals/AlertModal";

interface FolderCardProps {
    folder: WorkoutTemplateFolder;
    templates: WorkoutTemplate[];
    onEditFolder: (folder: WorkoutTemplateFolder) => void;
}

export const FolderCard = ({ folder, templates, onEditFolder }: FolderCardProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteFolder, { isLoading: isDeleting }] = useDeleteTemplateFolderMutation();

    const folderTemplates = templates.filter(t => t.folderId === folder._id);

    const handleDeleteFolder = () => {
        setShowDeleteModal(true);
        setShowMenu(false);
    };

    const confirmDeleteFolder = async () => {
        try {
            await deleteFolder(folder._id).unwrap();
            toast.success("Folder deleted successfully");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete folder");
        }
    };

    return (
        <Card className="border-l-4 py-0" style={{ borderLeftColor: folder.color }}>
            <CardContent className="p-0 overflow-hidden rounded-lg">
                {/* Folder Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: folder.color + "20" }}
                        >
                            <FolderOpen
                                className="w-5 h-5"
                                style={{ color: folder.color }}
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {folder.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {folderTemplates.length} {folderTemplates.length === 1 ? "template" : "templates"}
                            </p>
                        </div>
                    </button>

                    {/* Folder Actions */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMenu(!showMenu)}
                            className="hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                    <button
                                        onClick={() => {
                                            onEditFolder(folder);
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Folder
                                    </button>
                                    <button
                                        onClick={handleDeleteFolder}
                                        disabled={isDeleting}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {isDeleting ? "Deleting..." : "Delete Folder"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Folder Contents */}
                {isExpanded && (
                    <div className="p-4 space-y-3">
                        {folderTemplates.length > 0 ? (
                            folderTemplates.map((template) => (
                                <TemplateCard key={template._id} template={template} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p className="text-sm">No templates in this folder yet</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            {/* Delete Folder Confirmation Modal */}
            <AlertModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteFolder}
                title="Delete Folder"
                message={`Are you sure you want to delete the "${folder.name}" folder? Templates will be moved to "Unsorted".`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </Card>
    );
};
