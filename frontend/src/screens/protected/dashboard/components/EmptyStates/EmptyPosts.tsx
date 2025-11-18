// React
import { type FC } from "react";

// Icons
import { Users } from "lucide-react";

export const EmptyPosts: FC = () => {
    return (
        <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first post or follow some users to see posts in your feed
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
                Check out the suggested users on the left to get started!
            </p>
        </div>
    );
};
