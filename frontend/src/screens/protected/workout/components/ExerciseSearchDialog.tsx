import { Search, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Exercise {
    id: string;
    name: string;
    category: string;
    image?: string;
}

interface ExerciseSearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    exercises: Exercise[];
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onAddExercise: (exercise: Exercise) => void;
}

export const ExerciseSearchDialog = ({
    isOpen,
    onClose,
    exercises,
    isLoading,
    searchTerm,
    onSearchChange,
    onAddExercise
}: ExerciseSearchDialogProps) => {
    if (!isOpen) return null;

    return (
        <Card className="border-2 border-purple-500">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Add Exercise</CardTitle>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Loading exercises...</p>
                    </div>
                ) : exercises.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {exercises.map((exercise) => (
                            <div
                                key={exercise.id}
                                onClick={() => onAddExercise(exercise)}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    {exercise.image && (
                                        <img
                                            src={exercise.image}
                                            alt={exercise.name}
                                            className="w-10 h-10 object-cover rounded-md"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{exercise.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{exercise.category}</p>
                                    </div>
                                </div>
                                <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-gray-600 dark:text-gray-400">No exercises found</p>
                )}
            </CardContent>
        </Card>
    );
};
