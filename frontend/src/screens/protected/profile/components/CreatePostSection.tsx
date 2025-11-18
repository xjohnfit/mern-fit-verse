import { type FC } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { getInitials } from '@/lib/getInitials';
import { type UserProfile } from '../types';

interface CreatePostSectionProps {
    isOwnProfile: boolean;
    showCreatePost: boolean;
    setShowCreatePost: (show: boolean) => void;
    postContent: string;
    setPostContent: (content: string) => void;
    postImage: string | null;
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    removeImage: () => void;
    handleCreatePost: () => void;
    currentUser: UserProfile | null;
}

export const CreatePostSection: FC<CreatePostSectionProps> = ({
    isOwnProfile,
    showCreatePost,
    setShowCreatePost,
    postContent,
    setPostContent,
    postImage,
    handleImageUpload,
    removeImage,
    handleCreatePost,
    currentUser,
}) => {
    if (!isOwnProfile) return null;

    return (
        <>
            <Button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="flex items-center space-x-2"
                size="sm"
            >
                <Plus className="w-4 h-4" />
                <span className="sm:inline">Create Post</span>
            </Button>

            {showCreatePost && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4 mb-6 border border-gray-200 dark:border-gray-600 col-span-full">
                    <div className="flex space-x-3">
                        <Avatar className="w-10 h-10 shrink-0">
                            <AvatarImage
                                src={currentUser?.photo}
                                alt={currentUser?.name}
                            />
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                {currentUser ? getInitials(currentUser.name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <textarea
                                placeholder="Share your fitness journey..."
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows={3}
                            />

                            {postImage && (
                                <div className="mt-3 relative">
                                    <img
                                        src={postImage}
                                        alt="Upload preview"
                                        className="w-full max-h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                                <label className="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                                    <ImageIcon className="w-5 h-5" />
                                    <span>Add Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setShowCreatePost(false);
                                            setPostContent('');
                                            removeImage();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleCreatePost}
                                        disabled={!postContent.trim() && !postImage}
                                    >
                                        Post
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
