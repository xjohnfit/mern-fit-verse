import { FileText } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";

export const TemplatesHeader = () => {
    return (
        <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                My Templates
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
                Organize your templates with folders
            </CardDescription>
        </div>
    );
};
