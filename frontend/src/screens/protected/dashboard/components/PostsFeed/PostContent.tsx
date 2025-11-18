// React
import { type FC } from "react";

interface PostContentProps {
    content: string;
    image?: string;
}

export const PostContent: FC<PostContentProps> = ({ content, image }) => {
    return (
        <div className="mb-4">
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap mb-3">
                {content}
            </p>
            {image && (
                <img
                    src={image}
                    alt="Post image"
                    className="w-full max-h-96 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                />
            )}
        </div>
    );
};
