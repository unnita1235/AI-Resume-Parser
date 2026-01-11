"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    FileText,
    TrendingUp,
    Target,
    Sparkles,
    Clock,
    ChevronRight,
    BarChart3,
    Zap,
    Award,
    Search
} from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const MOCK_STATS = {
    totalResumes: 12,
    averageScore: 78,
    keywordsMatched: 156,
    improvementsApplied: 34
};

const MOCK_RECENT_RESUMES = [
    {
        id: "1",
        name: "John_Doe_Resume.pdf",
        score: 85,
        date: "2024-12-23",
        keywords: ["React", "TypeScript", "Node.js"]
    },
    {
        id: "2",
        name: "Software_Engineer_CV.docx",
        score: 72,
        date: "2024-12-22",
        keywords: ["Python", "AWS", "Docker"]
    },
    {
        id: "3",
        name: "Senior_Dev_Resume.pdf",
        score: 91,
        date: "2024-12-21",
        keywords: ["Java", "Kubernetes", "Microservices"]
    }
];

const QUICK_TIPS = [
    "Use action verbs at the start of bullet points",
    "Include quantifiable achievements (%, $, numbers)",
    "Tailor keywords to match job descriptions",
    "Keep resume to 1-2 pages maximum",
    "Use consistent formatting throughout"
];

export default function DashboardPage() {
    const [stats, setStats] = useState(MOCK_STATS);
    const [recentResumes, setRecentResumes] = useState(MOCK_RECENT_RESUMES);
    const [currentTip, setCurrentTip] = useState(0);

    // Rotate tips every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % QUICK_TIPS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 85) return "text-green-500";
        if (score >= 70) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBadge = (score: number) => {
        if (score >= 85) return { variant: "default" as const, label: "Excellent" };
        if (score >= 70) return { variant: "secondary" as const, label: "Good" };
        return { variant: "destructive" as const, label: "Needs Work" };
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Header resumeText="" onReset={() => { }} />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track your resume optimization progress and insights
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Resumes
                            </CardTitle>
                            <FileText className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.totalResumes}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Processed this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Average Score
                            </CardTitle>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.averageScore}%</div>
                            <Progress value={stats.averageScore} className="mt-2 h-2" />
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Keywords Matched
                            </CardTitle>
                            <Target className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.keywordsMatched}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all resumes
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Improvements
                            </CardTitle>
                            <Sparkles className="h-5 w-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.improvementsApplied}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                AI suggestions applied
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Resumes */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Recent Resumes
                                    </CardTitle>
                                    <CardDescription>
                                        Your recently analyzed resumes
                                    </CardDescription>
                                </div>
                                <Link href="/">
                                    <Button variant="outline" size="sm">
                                        View All
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-4">
                                    {recentResumes.map((resume, index) => (
                                        <div key={resume.id}>
                                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <FileText className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{resume.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {resume.date}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className={`text-2xl font-bold ${getScoreColor(resume.score)}`}>
                                                            {resume.score}%
                                                        </p>
                                                        <Badge variant={getScoreBadge(resume.score).variant}>
                                                            {getScoreBadge(resume.score).label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-2 ml-4">
                                                {resume.keywords.map((keyword) => (
                                                    <Badge key={keyword} variant="outline" className="text-xs">
                                                        {keyword}
                                                    </Badge>
                                                ))}
                                            </div>
                                            {index < recentResumes.length - 1 && <Separator className="mt-4" />}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Quick Tips & Actions */}
                    <div className="space-y-6">
                        {/* Quick Tips Card */}
                        <Card className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    Quick Tip
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground min-h-[60px] transition-all duration-500">
                                    {QUICK_TIPS[currentTip]}
                                </p>
                                <div className="flex gap-1 mt-4">
                                    {QUICK_TIPS.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`h-1 flex-1 rounded-full transition-colors ${index === currentTip ? "bg-primary" : "bg-muted"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/" className="block">
                                    <Button className="w-full justify-start gap-2" variant="outline">
                                        <Search className="h-4 w-4" />
                                        Analyze New Resume
                                    </Button>
                                </Link>
                                <Link href="/cover-letter" className="block">
                                    <Button className="w-full justify-start gap-2" variant="outline">
                                        <FileText className="h-4 w-4" />
                                        Generate Cover Letter
                                    </Button>
                                </Link>
                                <Button className="w-full justify-start gap-2" variant="outline" disabled>
                                    <Award className="h-4 w-4" />
                                    View Achievements
                                    <Badge variant="secondary" className="ml-auto text-xs">Soon</Badge>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
