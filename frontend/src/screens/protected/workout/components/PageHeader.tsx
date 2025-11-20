import type { PageHeaderProps } from "@/screens/protected/workout/workout.types";

export const PageHeader = ({
    icon: Icon,
    title,
    description,
    iconGradient = "from-blue-500 to-purple-600"
}: PageHeaderProps) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 bg-linear-to-r ${iconGradient} rounded-lg shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {title}
                </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-[60px]">
                {description}
            </p>
        </div>
    );
};
