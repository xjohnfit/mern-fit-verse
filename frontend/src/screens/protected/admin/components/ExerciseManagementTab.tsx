import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetExercisesQuery, useCreateExerciseMutation, useUpdateExerciseMutation, useDeleteExerciseMutation } from '@/slices/exerciseApiSlice';
import SearchInput from './SearchInput';
import ExerciseTable from './ExerciseTable';
import ExerciseFormModal from './ExerciseFormModal';
import type { Exercise, ExerciseForm } from '../admin.types';

const ExerciseManagementTab = () => {
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [exerciseForm, setExerciseForm] = useState<ExerciseForm>({
        name: '',
        description: '',
        instructions: '',
        image: '',
        category: '',
    });

    const { data: exercises, isLoading: exercisesLoading, refetch: refetchExercises } = useGetExercisesQuery();
    const [createExercise] = useCreateExerciseMutation();
    const [updateExercise] = useUpdateExerciseMutation();
    const [deleteExercise] = useDeleteExerciseMutation();

    // Handle exercise form submission
    const handleExerciseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!exerciseForm.name || !exerciseForm.description || !exerciseForm.instructions || !exerciseForm.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingExercise) {
                await updateExercise({ id: editingExercise.id, data: exerciseForm }).unwrap();
                toast.success('Exercise updated successfully');
            } else {
                await createExercise(exerciseForm).unwrap();
                toast.success('Exercise created successfully');
            }

            resetExerciseForm();
            refetchExercises();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to save exercise');
        }
    };

    // Handle exercise deletion
    const handleExerciseDelete = async (exerciseId: string) => {
        if (!confirm('Are you sure you want to delete this exercise?')) return;

        try {
            await deleteExercise(exerciseId).unwrap();
            toast.success('Exercise deleted successfully');
            refetchExercises();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete exercise');
        }
    };

    // Handle exercise editing
    const handleExerciseEdit = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setExerciseForm({
            name: exercise.name,
            description: exercise.description,
            instructions: exercise.instructions,
            image: exercise.image,
            category: exercise.category,
        });
        setShowExerciseModal(true);
    };

    // Handle add new exercise
    const handleAddExercise = () => {
        setEditingExercise(null);
        setExerciseForm({
            name: '',
            description: '',
            instructions: '',
            image: '',
            category: '',
        });
        setShowExerciseModal(true);
    };

    // Reset exercise form
    const resetExerciseForm = () => {
        setEditingExercise(null);
        setExerciseForm({
            name: '',
            description: '',
            instructions: '',
            image: '',
            category: '',
        });
        setShowExerciseModal(false);
    };

    // Filter exercises based on search
    const filteredExercises = exercises?.filter((exercise: Exercise) =>
        exercise.name.toLowerCase().includes(exerciseSearchTerm.toLowerCase()) ||
        exercise.category.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
    ) || [];

    return (
        <>
            <div className="w-full space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Exercise Management</CardTitle>
                        <CardDescription>Add and manage workout exercises</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAddExercise} className="mb-4">
                            Add New Exercise
                        </Button>

                        <SearchInput
                            value={exerciseSearchTerm}
                            onChange={setExerciseSearchTerm}
                            placeholder="Search exercises by name or category..."
                        />

                        <ExerciseTable
                            exercises={filteredExercises}
                            onEdit={handleExerciseEdit}
                            onDelete={handleExerciseDelete}
                            isLoading={exercisesLoading}
                        />
                    </CardContent>
                </Card>
            </div>

            <ExerciseFormModal
                isOpen={showExerciseModal}
                onClose={resetExerciseForm}
                onSubmit={handleExerciseSubmit}
                form={exerciseForm}
                onFormChange={setExerciseForm}
                isEditing={!!editingExercise}
            />
        </>
    );
};

export default ExerciseManagementTab;
