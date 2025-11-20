import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExerciseSetRowProps } from "@/screens/protected/workout/workout.types";

export const ExerciseSetRow = ({
    setNumber,
    targetReps,
    targetWeight,
    canRemove,
    onChange,
    onRemove
}: ExerciseSetRowProps) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                Set {setNumber}
            </span>
            <Input
                type="number"
                placeholder="Reps"
                value={targetReps || ""}
                onChange={(e) => onChange('targetReps', parseInt(e.target.value) || 0)}
                className="w-20"
                min="0"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">reps @</span>
            <Input
                type="number"
                placeholder="Weight"
                value={targetWeight || ""}
                onChange={(e) => onChange('targetWeight', parseFloat(e.target.value) || 0)}
                className="w-20"
                min="0"
                step="0.5"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">lbs</span>
            {canRemove && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onRemove}
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};
