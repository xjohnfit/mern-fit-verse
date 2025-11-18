// React
import { type FC } from "react";

// Icons
import { MessageSquare } from "lucide-react";

export const EmptyMessages: FC = () => {
    return (
        <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                No conversations yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
                Follow some users to start messaging
            </p>
        </div>
    );
};
