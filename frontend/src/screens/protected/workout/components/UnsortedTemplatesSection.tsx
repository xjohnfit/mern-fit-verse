import { FileText } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import type { WorkoutTemplate } from "@/slices/workoutTemplateApiSlice";

interface UnsortedTemplatesSectionProps {
    templates: WorkoutTemplate[];
}

export const UnsortedTemplatesSection = ({ templates }: UnsortedTemplatesSectionProps) => {
    if (templates.length === 0) return null;

    const sortedTemplates = [...templates].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Unsorted Templates
            </h4>
            {sortedTemplates.map((template) => (
                <TemplateCard key={template._id} template={template} />
            ))}
        </div>
    );
};
