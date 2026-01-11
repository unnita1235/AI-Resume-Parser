"use client";

import { cn } from "@/lib/utils";

interface ResumeScoreCardProps {
    score: number;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    animated?: boolean;
}

export function ResumeScoreCard({
    score,
    size = "md",
    showLabel = true,
    animated = true
}: ResumeScoreCardProps) {
    const sizeClasses = {
        sm: { container: "w-16 h-16", text: "text-lg", strokeWidth: 4 },
        md: { container: "w-24 h-24", text: "text-2xl", strokeWidth: 6 },
        lg: { container: "w-32 h-32", text: "text-3xl", strokeWidth: 8 },
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return { color: "#22c55e", bg: "bg-green-500/10", label: "Excellent" };
        if (score >= 70) return { color: "#eab308", bg: "bg-yellow-500/10", label: "Good" };
        if (score >= 50) return { color: "#f97316", bg: "bg-orange-500/10", label: "Fair" };
        return { color: "#ef4444", bg: "bg-red-500/10", label: "Needs Work" };
    };

    const { color, bg, label } = getScoreColor(score);
    const { container, text, strokeWidth } = sizeClasses[size];

    // Calculate stroke dasharray for circular progress
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn("relative", container)}>
                {/* Background circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-muted/30"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className={cn(
                            animated && "transition-all duration-1000 ease-out"
                        )}
                        style={{
                            filter: `drop-shadow(0 0 8px ${color}40)`,
                        }}
                    />
                </svg>

                {/* Score text in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn("font-bold", text)} style={{ color }}>
                        {score}
                    </span>
                </div>
            </div>

            {showLabel && (
                <div className={cn("px-3 py-1 rounded-full text-sm font-medium", bg)}>
                    <span style={{ color }}>{label}</span>
                </div>
            )}
        </div>
    );
}

interface ScoreBreakdownProps {
    categories: {
        name: string;
        score: number;
        maxScore: number;
        description?: string;
    }[];
}

export function ScoreBreakdown({ categories }: ScoreBreakdownProps) {
    return (
        <div className="space-y-4">
            {categories.map((category, index) => {
                const percentage = (category.score / category.maxScore) * 100;
                const getColor = (pct: number) => {
                    if (pct >= 80) return "bg-green-500";
                    if (pct >= 60) return "bg-yellow-500";
                    if (pct >= 40) return "bg-orange-500";
                    return "bg-red-500";
                };

                return (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm text-muted-foreground">
                                {category.score}/{category.maxScore}
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-700 ease-out",
                                    getColor(percentage)
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        {category.description && (
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
