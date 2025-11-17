import { Label, Pie, PieChart } from "recharts";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

interface MacroDistributionChartProps {
    protein: number;
    carbs: number;
    fats: number;
}

const chartConfig = {
    calories: {
        label: "Calories",
    },
    protein: {
        label: "Protein",
        color: "hsl(142, 76%, 36%)", // green-600
    },
    carbs: {
        label: "Carbs",
        color: "hsl(0, 84%, 60%)", // red-500
    },
    fats: {
        label: "Fats",
        color: "hsl(48, 96%, 53%)", // yellow-500
    },
} satisfies ChartConfig;

export function MacroDistributionChart({ protein, carbs, fats }: MacroDistributionChartProps) {
    const chartData = useMemo(() => {
        // If all values are 0, show equal dummy data to render the chart
        if (protein === 0 && carbs === 0 && fats === 0) {
            return [
                { macro: "protein", grams: 1, fill: "hsl(142, 76%, 36%)" },
                { macro: "carbs", grams: 1, fill: "hsl(0, 84%, 60%)" },
                { macro: "fats", grams: 1, fill: "hsl(48, 96%, 53%)" },
            ];
        }
        return [
            { macro: "protein", grams: protein || 0.01, fill: "hsl(142, 76%, 36%)" },
            { macro: "carbs", grams: carbs || 0.01, fill: "hsl(0, 84%, 60%)" },
            { macro: "fats", grams: fats || 0.01, fill: "hsl(48, 96%, 53%)" },
        ];
    }, [protein, carbs, fats]);

    const totalCalories = useMemo(() => {
        // 1g protein = 4 calories, 1g carb = 4 calories, 1g fat = 9 calories
        return (protein * 4) + (carbs * 4) + (fats * 9);
    }, [protein, carbs, fats]);

    return (
        <div className="flex flex-col h-full w-full">
            <ChartContainer
                config={chartConfig}
                className="w-full h-full flex-1"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="grams"
                        nameKey="macro"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {totalCalories.toFixed(0)}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground text-sm"
                                            >
                                                Calories
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
    );
}
