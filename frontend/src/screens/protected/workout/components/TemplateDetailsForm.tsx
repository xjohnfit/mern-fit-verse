import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FolderSelector } from "./FolderSelector";

interface Folder {
    _id: string;
    name: string;
    color: string;
}

interface TemplateDetailsFormProps {
    name: string;
    description: string;
    folderId: string;
    folders: Folder[];
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onFolderChange: (folderId: string) => void;
}

export const TemplateDetailsForm = ({
    name,
    description,
    folderId,
    folders,
    onNameChange,
    onDescriptionChange,
    onFolderChange
}: TemplateDetailsFormProps) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Template Name *
                    </label>
                    <Input
                        id="templateName"
                        type="text"
                        placeholder="e.g., Push Day, Leg Day, Full Body..."
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        maxLength={100}
                    />
                </div>

                <div>
                    <label htmlFor="templateDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description (Optional)
                    </label>
                    <textarea
                        id="templateDescription"
                        placeholder="Add notes about this workout..."
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        maxLength={500}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <FolderSelector
                    folders={folders}
                    selectedFolderId={folderId}
                    onSelectFolder={onFolderChange}
                />
            </CardContent>
        </Card>
    );
};
