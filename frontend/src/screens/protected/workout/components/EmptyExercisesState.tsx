import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyExercisesStateProps {
    onAddClick: () => void;
}

export const EmptyExercisesState = ({ onAddClick }: EmptyExercisesStateProps) => {
    return (
        <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No exercises added yet</p>
            <Button
                onClick={onAddClick}
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Exercise
            </Button>
        </div>
    );
};
