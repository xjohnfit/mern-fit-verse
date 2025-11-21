import { Button } from '@/components/ui/button';
import type { ExerciseTableProps } from '../admin.types';

const ExerciseTable = ({ exercises, onEdit, onDelete, isLoading }: ExerciseTableProps) => {
    if (isLoading) {
        return <div className="text-center py-8 text-muted-foreground">Loading exercises...</div>;
    }

    if (exercises.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No exercises found</div>;
    }

    // Group exercises by category
    const exercisesByCategory = exercises.reduce((acc: Record<string, typeof exercises>, exercise) => {
        const category = exercise.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(exercise);
        return acc;
    }, {});

    // Sort categories alphabetically
    const sortedCategories = Object.keys(exercisesByCategory).sort();

    return (
        <div className="space-y-8">
            {sortedCategories.map((category) => (
                <div key={category} className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground capitalize bg-muted px-4 py-2 rounded-md">
                        {category} ({exercisesByCategory[category].length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    <th className="text-left p-3 font-semibold text-foreground w-2/3">Exercise Name</th>
                                    <th className="text-left p-3 font-semibold text-foreground w-1/3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercisesByCategory[category].map((exercise) => (
                                    <tr key={exercise.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="p-3 text-foreground w-2/3">{exercise.name}</td>
                                        <td className="p-3 w-1/3">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onEdit(exercise)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => onDelete(exercise.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExerciseTable;
