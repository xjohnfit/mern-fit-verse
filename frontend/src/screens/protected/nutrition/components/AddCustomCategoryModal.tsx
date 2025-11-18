import { X } from 'lucide-react';

interface AddCustomCategoryModalProps {
    showModal: boolean;
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    onAdd: () => void;
    onClose: () => void;
    currentCount: number;
    maxCount: number;
}

export const AddCustomCategoryModal = ({
    showModal,
    newCategoryName,
    setNewCategoryName,
    onAdd,
    onClose,
    currentCount,
    maxCount
}: AddCustomCategoryModalProps) => {
    if (!showModal) return null;

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onAdd();
        }
    };

    return (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Create Custom Category ({currentCount}/{maxCount})
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Pre-Workout, Post-Workout"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    maxLength={20}
                />
                <button
                    onClick={onAdd}
                    disabled={!newCategoryName.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                    Add
                </button>
            </div>
        </div>
    );
};
