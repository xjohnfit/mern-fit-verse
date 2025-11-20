import { FileText, FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmptyTemplatesStateProps } from "@/screens/protected/workout/workout.types";

export const EmptyTemplatesState = ({ onCreateFolder, onCreateTemplate }: EmptyTemplatesStateProps) => {
    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Templates Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first workout template to save time and maintain consistency in your training routine.
            </p>
            <div className="flex justify-center gap-3">
                <Button
                    variant="outline"
                    onClick={onCreateFolder}
                    className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create Folder
                </Button>
                <Button
                    onClick={onCreateTemplate}
                    className="bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                </Button>
            </div>
        </div>
    );
};
