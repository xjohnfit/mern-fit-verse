import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WorkoutActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconGradient?: string;
    benefits: string[];
    benefitColor?: string;
    buttonText: string;
    buttonGradient?: string;
    hoverBorderColor?: string;
    onClick: () => void;
}

export const WorkoutActionCard = ({
    title,
    description,
    icon: Icon,
    iconGradient = "from-blue-500 to-blue-600",
    benefits,
    benefitColor = "blue",
    buttonText,
    buttonGradient = "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    hoverBorderColor = "blue-500",
    onClick
}: WorkoutActionCardProps) => {
    return (
        <Card className={`hover:shadow-xl transition-all duration-300 border-2 hover:border-${hoverBorderColor} dark:hover:border-${hoverBorderColor.replace('500', '400')}`}>
            <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 bg-linear-to-r ${iconGradient} rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className={`bg-${benefitColor}-50 dark:bg-${benefitColor}-900/20 rounded-lg p-4 space-y-2`}>
                    <h4 className={`font-semibold text-${benefitColor}-900 dark:text-${benefitColor}-100 flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 bg-${benefitColor}-500 rounded-full`}></span>
                        Perfect For:
                    </h4>
                    <ul className={`space-y-1 ml-4 text-sm text-${benefitColor}-800 dark:text-${benefitColor}-200`}>
                        {benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                        ))}
                    </ul>
                </div>
                <Button
                    className={`w-full bg-linear-to-r ${buttonGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                    size="lg"
                    onClick={onClick}
                >
                    <Icon className="w-5 h-5 mr-2" />
                    {buttonText}
                </Button>
            </CardContent>
        </Card>
    );
};
