// React
import { useState } from "react";

// Third-party libraries
import { X } from "lucide-react";
import { toast } from "sonner";

// Redux
import { useCreateTemplateFolderMutation } from "@/slices/workoutTemplateFolderApiSlice";

// Components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PRESET_COLORS = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
    { name: "Green", value: "#22c55e" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Gray", value: "#6b7280" },
];

export const CreateFolderDialog = ({ open, onOpenChange }: CreateFolderDialogProps) => {
    const [folderName, setFolderName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#6366f1");

    const [createFolder, { isLoading }] = useCreateTemplateFolderMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!folderName.trim()) {
            toast.error("Please enter a folder name");
            return;
        }

        try {
            await createFolder({
                name: folderName.trim(),
                color: selectedColor,
            }).unwrap();

            toast.success("Folder created successfully!");
            setFolderName("");
            setSelectedColor("#6366f1");
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create folder");
        }
    };

    const handleClose = () => {
        setFolderName("");
        setSelectedColor("#6366f1");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md p-8">
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                        Organize your workout templates by creating a new folder
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Folder Name Input */}
                    <div>
                        <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Folder Name
                        </label>
                        <Input
                            id="folderName"
                            type="text"
                            placeholder="e.g., Upper Body, Cardio, Strength..."
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            maxLength={50}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {folderName.length}/50 characters
                        </p>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Folder Color
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-full aspect-square rounded-lg transition-all duration-200 ${selectedColor === color.value
                                            ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100 scale-110"
                                            : "hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !folderName.trim()}
                            className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                            {isLoading ? "Creating..." : "Create Folder"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
