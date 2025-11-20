import type { LoadingStateProps } from "@/screens/protected/workout/workout.types";

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
    return (
        <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        </div>
    );
};
