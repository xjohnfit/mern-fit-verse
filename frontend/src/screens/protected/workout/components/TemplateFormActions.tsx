import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateFormActionsProps } from "@/screens/protected/workout/workout.types";

export const TemplateFormActions = ({
    onCancel,
    onSave,
    isSaving,
    canSave,
    saveButtonText = "Save Template"
}: TemplateFormActionsProps) => {
    return (
        <div className="flex justify-end gap-3">
            <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
            >
                Cancel
            </Button>
            <Button
                onClick={onSave}
                disabled={isSaving || !canSave}
                className="bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : saveButtonText}
            </Button>
        </div>
    );
};
