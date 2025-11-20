import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import type { ExerciseFormModalProps } from '../admin.types';

const ExerciseFormModal = ({ isOpen, onClose, onSubmit, form, onFormChange, isEditing }: ExerciseFormModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the exercise details below.' : 'Fill in the details to create a new exercise.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <DialogBody>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-foreground">Name *</label>
                                    <Input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => onFormChange({ ...form, name: e.target.value })}
                                        placeholder="Exercise name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-foreground">Category *</label>
                                    <Input
                                        type="text"
                                        value={form.category}
                                        onChange={(e) => onFormChange({ ...form, category: e.target.value })}
                                        placeholder="e.g., Chest, Back, Legs"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">Image URL</label>
                                <Input
                                    type="text"
                                    value={form.image}
                                    onChange={(e) => onFormChange({ ...form, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">Description *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => onFormChange({ ...form, description: e.target.value })}
                                    placeholder="Brief description of the exercise"
                                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">Instructions *</label>
                                <textarea
                                    value={form.instructions}
                                    onChange={(e) => onFormChange({ ...form, instructions: e.target.value })}
                                    placeholder="Step-by-step instructions"
                                    className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEditing ? 'Update Exercise' : 'Create Exercise'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExerciseFormModal;
