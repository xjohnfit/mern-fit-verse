import { FileText, FolderPlus, Plus } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TemplatesHeaderProps {
    onCreateFolder: () => void;
    onCreateTemplate: () => void;
}

export const TemplatesHeader = ({ onCreateFolder, onCreateTemplate }: TemplatesHeaderProps) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                    My Templates
                </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
                Organize your templates with folders
            </CardDescription>
            <div className="flex items-center gap-2 pt-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateFolder}
                    className="flex-1 sm:flex-none border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-xs sm:text-sm h-8 sm:h-9"
                >
                    <FolderPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">New </span>Folder
                </Button>
                <Button
                    size="sm"
                    onClick={onCreateTemplate}
                    className="flex-1 sm:flex-none bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-xs sm:text-sm h-8 sm:h-9"
                >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">New </span>Template
                </Button>
            </div>
        </div>
    );
};
