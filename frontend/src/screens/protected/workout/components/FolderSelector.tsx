import { FolderOpen } from "lucide-react";

interface Folder {
    _id: string;
    name: string;
    color: string;
}

interface FolderSelectorProps {
    folders: Folder[];
    selectedFolderId: string;
    onSelectFolder: (folderId: string) => void;
}

export const FolderSelector = ({ folders, selectedFolderId, onSelectFolder }: FolderSelectorProps) => {
    if (folders.length === 0) return null;

    return (
        <div>
            <label htmlFor="folder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Save to Folder (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <button
                    type="button"
                    onClick={() => onSelectFolder("")}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${selectedFolderId === ""
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                        }`}
                >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Unsorted</p>
                </button>
                {folders.map((folder) => (
                    <button
                        key={folder._id}
                        type="button"
                        onClick={() => onSelectFolder(folder._id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${selectedFolderId === folder._id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                            }`}
                        style={{
                            borderLeftColor: selectedFolderId === folder._id ? folder.color : undefined,
                            borderLeftWidth: selectedFolderId === folder._id ? '4px' : undefined
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {folder.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};
