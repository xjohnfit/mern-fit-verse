import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '@/components/ui/dialog';
import type { ExerciseFormModalProps } from '../admin.types';

const ExerciseFormModal = ({ isOpen, onClose, onSubmit, form, onFormChange, isEditing }: ExerciseFormModalProps) => {
    const [imagePreview, setImagePreview] = useState<string>(form.image || '');
    const [isUploading, setIsUploading] = useState(false);

    // Sync imagePreview with form.image whenever it changes (e.g., when opening a different exercise)
    useEffect(() => {
        setImagePreview(form.image || '');
    }, [form.image, isOpen]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String);
            onFormChange({ ...form, image: base64String });
            setIsUploading(false);
        };
        reader.onerror = () => {
            alert('Failed to read image file');
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        onFormChange({ ...form, image: '' });
    };
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
                                    <select
                                        value={form.category}
                                        onChange={(e) => onFormChange({ ...form, category: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Chest">Chest</option>
                                        <option value="Back">Back</option>
                                        <option value="Arms">Arms</option>
                                        <option value="Legs">Legs</option>
                                        <option value="Glutes">Glutes</option>
                                        <option value="Core">Core</option>
                                        <option value="Shoulders">Shoulders</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">Exercise Image</label>
                                <div className="space-y-3">
                                    {imagePreview && (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-md border border-border"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-destructive/90"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    <div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            disabled={isUploading}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {isUploading ? 'Processing image...' : 'Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP'}
                                        </p>
                                    </div>
                                </div>
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
                        <Button type="submit" disabled={isUploading}>
                            {isUploading ? 'Processing...' : isEditing ? 'Update Exercise' : 'Create Exercise'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ExerciseFormModal;
