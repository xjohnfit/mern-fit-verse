import { Button } from '@/components/ui/button';
import type { ExerciseTableProps } from '../admin.types';

const ExerciseTable = ({ exercises, onEdit, onDelete, isLoading }: ExerciseTableProps) => {
    if (isLoading) {
        return <div className="text-center py-8 text-muted-foreground">Loading exercises...</div>;
    }

    if (exercises.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No exercises found</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-3 font-semibold text-foreground">Exercise Name</th>
                        <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <tr key={exercise.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="p-3 text-foreground">{exercise.name}</td>
                            <td className="p-3">
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
    );
};

export default ExerciseTable;
