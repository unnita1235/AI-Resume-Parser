"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    FileText,
    Sparkles,
    Copy,
    Download,
    Loader2,
    Building2,
    User,
    Briefcase,
    Mail
} from "lucide-react";
import { runGenerateCoverLetter } from "@/app/actions";

export default function CoverLetterPage() {
    const { toast } = useToast();

    // Form state
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [hiringManagerName, setHiringManagerName] = useState("");
    const [tone, setTone] = useState<"professional" | "enthusiastic" | "creative">("professional");

    // Result state
    const [coverLetter, setCoverLetter] = useState("");
    const [keyHighlights, setKeyHighlights] = useState<string[]>([]);
    const [subjectLine, setSubjectLine] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!resumeText.trim()) {
            toast({ title: "Please enter your resume content", variant: "destructive" });
            return;
        }
        if (!jobDescription.trim()) {
            toast({ title: "Please enter the job description", variant: "destructive" });
            return;
        }
        if (!companyName.trim()) {
            toast({ title: "Please enter the company name", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setCoverLetter("");
        setKeyHighlights([]);
        setSubjectLine("");

        try {
            const result = await runGenerateCoverLetter({
                resumeText,
                jobDescription,
                companyName,
                hiringManagerName: hiringManagerName || undefined,
                tone
            });

            setCoverLetter(result.coverLetter);
            setKeyHighlights(result.keyHighlights);
            setSubjectLine(result.suggestedSubjectLine);

            toast({
                title: "Cover Letter Generated!",
                description: "Your personalized cover letter is ready."
            });
        } catch (error) {
            toast({
                title: "Generation Failed",
                description: (error as Error).message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: `${label} copied to clipboard!` });
    };

    const downloadCoverLetter = () => {
        const blob = new Blob([coverLetter], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cover-letter-${companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Cover letter downloaded!" });
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <Header resumeText="" onReset={() => { }} />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1 rounded-full mb-4">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">AI-Powered</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Cover Letter Generator
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Generate a personalized, professional cover letter tailored to the job you're applying for
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Your Resume
                                </CardTitle>
                                <CardDescription>
                                    Paste your resume content for personalized results
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste your resume text here..."
                                    className="h-48 resize-none"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {resumeText.length} characters
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Job Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Company Name *
                                        </Label>
                                        <Input
                                            id="company"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="e.g., Google"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="manager" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Hiring Manager (Optional)
                                        </Label>
                                        <Input
                                            id="manager"
                                            value={hiringManagerName}
                                            onChange={(e) => setHiringManagerName(e.target.value)}
                                            placeholder="e.g., John Smith"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Job Description *</Label>
                                    <Textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the job description here..."
                                        className="h-32 resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Writing Tone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={tone}
                                    onValueChange={(v) => setTone(v as typeof tone)}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    <div>
                                        <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
                                        <Label
                                            htmlFor="professional"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <span className="font-medium">Professional</span>
                                            <span className="text-xs text-muted-foreground">Formal & polished</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="enthusiastic" id="enthusiastic" className="peer sr-only" />
                                        <Label
                                            htmlFor="enthusiastic"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <span className="font-medium">Enthusiastic</span>
                                            <span className="text-xs text-muted-foreground">Energetic & positive</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="creative" id="creative" className="peer sr-only" />
                                        <Label
                                            htmlFor="creative"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            <span className="font-medium">Creative</span>
                                            <span className="text-xs text-muted-foreground">Unique & memorable</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <Button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full h-12 text-lg"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Generate Cover Letter
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-6">
                        <Card className={`min-h-[600px] ${!coverLetter && "flex items-center justify-center"}`}>
                            {!coverLetter ? (
                                <div className="text-center text-muted-foreground p-8">
                                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                    <p>Your generated cover letter will appear here</p>
                                </div>
                            ) : (
                                <>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Mail className="h-5 w-5" />
                                                Your Cover Letter
                                            </CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(coverLetter, "Cover letter")}
                                                >
                                                    <Copy className="h-4 w-4 mr-1" />
                                                    Copy
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={downloadCoverLetter}
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {subjectLine && (
                                            <div className="p-3 bg-muted rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">Suggested Email Subject</p>
                                                        <p className="font-medium">{subjectLine}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(subjectLine, "Subject line")}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {coverLetter}
                                        </div>

                                        {keyHighlights.length > 0 && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <p className="text-sm font-medium mb-2">Key Qualifications Highlighted:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {keyHighlights.map((highlight, index) => (
                                                            <Badge key={index} variant="secondary">
                                                                {highlight}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
