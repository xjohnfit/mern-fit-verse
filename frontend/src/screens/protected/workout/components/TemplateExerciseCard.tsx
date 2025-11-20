import { Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExerciseSetRow } from "./ExerciseSetRow";

interface TemplateSet {
    setNumber: number;
    targetReps: number;
    targetWeight: number;
    notes?: string;
}

interface TemplateExercise {
    exerciseId: string;
    exerciseName: string;
    sets: TemplateSet[];
    restTime: number;
    notes?: string;
}

interface TemplateExerciseCardProps {
    exercise: TemplateExercise;
    index: number;
    onRemove: () => void;
    onAddSet: () => void;
    onRemoveSet: (setNumber: number) => void;
    onUpdateSet: (setNumber: number, field: 'targetReps' | 'targetWeight', value: number) => void;
    onUpdateRestTime: (restTime: number) => void;
}

export const TemplateExerciseCard = ({
    exercise,
    index,
    onRemove,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    onUpdateRestTime
}: TemplateExerciseCardProps) => {
    return (
        <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
                {/* Exercise Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white text-sm font-semibold rounded-full">
                            {index + 1}
                        </span>
                        <div>
                            <p className="font-semibold text-base">{exercise.exerciseName}</p>
                            <p className="text-xs text-gray-500">{exercise.sets.length} sets</p>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onRemove}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Sets */}
                <div className="space-y-2 mb-4">
                    {exercise.sets.map((set) => (
                        <ExerciseSetRow
                            key={set.setNumber}
                            setNumber={set.setNumber}
                            targetReps={set.targetReps}
                            targetWeight={set.targetWeight}
                            canRemove={exercise.sets.length > 1}
                            onChange={(field, value) => onUpdateSet(set.setNumber, field, value)}
                            onRemove={() => onRemoveSet(set.setNumber)}
                        />
                    ))}
                </div>

                {/* Add Set & Rest Time */}
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onAddSet}
                        className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Set
                    </Button>
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rest:</span>
                        <Input
                            type="number"
                            value={exercise.restTime || 60}
                            onChange={(e) => onUpdateRestTime(parseInt(e.target.value) || 60)}
                            className="w-20"
                            min="0"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">sec</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
