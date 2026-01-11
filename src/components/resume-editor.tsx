"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { runAdjustTone, runEnhanceActionVerbs, runOptimizeForAts } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Wand2, Loader2, Lightbulb, ClipboardCopy, Upload, AlertTriangle, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { FileUpload } from "./file-upload";
import type { OptimizeForAtsOutput } from "@/ai/flows/optimize-for-ats";

// Demo ATS result for offline mode
const DEMO_ATS_RESULT: OptimizeForAtsOutput = {
  atsCompatibilityScore: 78,
  missingKeywords: ["Agile", "Scrum", "CI/CD", "REST APIs", "Microservices"],
  recommendations: "Sample Output - Connect backend for real parsing\n\n1. Add more specific technical keywords related to the job description\n2. Include quantifiable achievements (e.g., 'increased efficiency by 25%')\n3. Use standard section headers (Experience, Education, Skills)\n4. Ensure consistent formatting throughout the document"
};

interface ResumeEditorProps {
  resumeText: string;
  setResumeText: Dispatch<SetStateAction<string>>;
  isDemoMode?: boolean;
}

export function ResumeEditor({ resumeText, setResumeText, isDemoMode = false }: ResumeEditorProps) {
  const { toast } = useToast();

  // ATS State
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState<OptimizeForAtsOutput | null>(null);
  const [isAtsLoading, setIsAtsLoading] = useState(false);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  // Tone State
  const [tone, setTone] = useState<"formal" | "casual">("formal");
  const [isToneLoading, setIsToneLoading] = useState(false);

  // Action Verb State
  const [bulletPoint, setBulletPoint] = useState("");
  const [verbSuggestions, setVerbSuggestions] = useState<string[]>([]);
  const [isVerbLoading, setIsVerbLoading] = useState(false);

  const handleAtsCheck = async () => {
    if (!resumeText) {
      toast({ title: "Please enter your resume content.", variant: "destructive" });
      return;
    }

    setIsAtsLoading(true);
    setAtsResult(null);
    setIsUsingDemoData(false);

    // In demo mode, show sample data after a brief delay
    if (isDemoMode) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAtsResult(DEMO_ATS_RESULT);
      setIsUsingDemoData(true);
      setIsAtsLoading(false);
      toast({
        title: "Demo Mode",
        description: "Showing sample ATS analysis. Connect backend for real results.",
      });
      return;
    }

    try {
      const result = await runOptimizeForAts({ resumeText, jobDescription });
      setAtsResult(result);
      toast({ title: "ATS Analysis Complete", description: `Score: ${result.atsCompatibilityScore}%` });
    } catch (error) {
      // Fallback to demo data on error
      setAtsResult(DEMO_ATS_RESULT);
      setIsUsingDemoData(true);
      toast({
        title: "Using sample data",
        description: "Backend unavailable. Showing sample output.",
        variant: "destructive"
      });
    } finally {
      setIsAtsLoading(false);
    }
  };

  const handleAdjustTone = async () => {
    if (!resumeText) {
      toast({ title: "Please enter your resume content.", variant: "destructive" });
      return;
    }

    if (isDemoMode) {
      toast({
        title: "Demo Mode",
        description: "Tone adjustment requires backend connection.",
        variant: "destructive"
      });
      return;
    }

    setIsToneLoading(true);
    try {
      const { adjustedResume } = await runAdjustTone({ resume: resumeText, tone });
      setResumeText(adjustedResume);
      toast({ title: `Tone adjusted to ${tone}.`, description: "Your resume has been updated." });
    } catch (error) {
      toast({ title: (error as Error).message, variant: "destructive" });
    } finally {
      setIsToneLoading(false);
    }
  };

  const handleEnhanceVerbs = async () => {
    if (!bulletPoint) {
      toast({ title: "Please enter a bullet point.", variant: "destructive" });
      return;
    }

    if (isDemoMode) {
      // Provide demo suggestions
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVerbSuggestions(["Spearheaded", "Orchestrated", "Pioneered"]);
      toast({
        title: "Demo Mode",
        description: "Showing sample suggestions. Connect backend for real results.",
      });
      return;
    }

    setIsVerbLoading(true);
    setVerbSuggestions([]);
    try {
      const { suggestions } = await runEnhanceActionVerbs({ bulletPoint });
      setVerbSuggestions(suggestions);
    } catch (error) {
      // Fallback to demo suggestions
      setVerbSuggestions(["Spearheaded", "Orchestrated", "Pioneered"]);
      toast({
        title: "Using sample suggestions",
        description: "Backend unavailable. Showing sample output.",
        variant: "destructive"
      });
    } finally {
      setIsVerbLoading(false);
    }
  };

  const copySuggestion = (suggestion: string) => {
    const updatedPoint = bulletPoint.replace(/^\s*[\w-]+/, suggestion);
    navigator.clipboard.writeText(updatedPoint);
    toast({ title: "Copied to clipboard!", description: `"${updatedPoint}"` });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="resume-input" className="text-lg font-semibold">Your Resume</Label>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4" />
            <span>Upload or paste your resume</span>
          </div>
        </div>
        
        <FileUpload
          onFileProcessed={(text) => setResumeText(text)}
          disabled={isAtsLoading || isToneLoading || isVerbLoading}
          isDemoMode={isDemoMode}
        />
        
        <div className="relative">
          <Textarea
            id="resume-input"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Or paste your resume text here..."
            className="h-[400px] text-base"
            disabled={isAtsLoading || isToneLoading || isVerbLoading}
          />
          {resumeText && (
            <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
              {resumeText.length} characters
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            <span>AI Enhancement Tools</span>
            {isDemoMode && (
              <Badge variant="secondary" className="ml-auto text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30">
                Demo Mode
              </Badge>
            )}
          </CardTitle>
          {isDemoMode && (
            <CardDescription className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              Some features limited without backend connection
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ats">
              <AccordionTrigger>ATS Optimization</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description (Optional)</Label>
                  <Textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here for tailored suggestions."
                    className="h-32"
                  />
                </div>
                <Button onClick={handleAtsCheck} disabled={isAtsLoading}>
                  {isAtsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Check ATS Score
                </Button>
                {atsResult && (
                  <div className="mt-4 space-y-4 animate-in fade-in">
                    {/* Demo Mode Warning - More prominent */}
                    {isUsingDemoData && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                            Demo Data - Not Real Results
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-300">
                            Backend is unavailable. The results shown below are sample data for demonstration only.
                            Do not use these results for your actual resume. Connect to the backend for real AI analysis.
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Compatibility Score: {atsResult.atsCompatibilityScore}%</Label>
                      <Progress value={atsResult.atsCompatibilityScore} className="w-full mt-1" />
                    </div>
                    {atsResult.missingKeywords.length > 0 && (
                      <div>
                        <Label>Missing Keywords</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {atsResult.missingKeywords.map((kw) => (
                            <Badge key={kw} variant="secondary">{kw}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <Label>Recommendations</Label>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">{atsResult.recommendations}</p>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tone">
              <AccordionTrigger>Tone Adjustment</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <RadioGroup defaultValue="formal" onValueChange={(value: "formal" | "casual") => setTone(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="formal" />
                    <Label htmlFor="formal">Formal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual">Casual</Label>
                  </div>
                </RadioGroup>
                <Button onClick={handleAdjustTone} disabled={isToneLoading}>
                  {isToneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Adjust Tone
                </Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="verbs">
              <AccordionTrigger>Action Verb Enhancement</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bullet-point">Paste a bullet point</Label>
                  <Textarea
                    id="bullet-point"
                    value={bulletPoint}
                    onChange={(e) => setBulletPoint(e.target.value)}
                    placeholder="e.g., Led a team of 5 engineers to develop a new feature."
                    className="h-24"
                  />
                </div>
                <Button onClick={handleEnhanceVerbs} disabled={isVerbLoading}>
                  {isVerbLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Suggest Verbs
                </Button>
                {verbSuggestions.length > 0 && (
                  <div className="mt-4 space-y-2 animate-in fade-in">
                    <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Suggestions</h4>
                    <ul className="space-y-2">
                      {verbSuggestions.map((suggestion) => {
                        // Safely render suggestion without HTML injection
                        const restOfBullet = bulletPoint.replace(/^\s*[\w-]+\s*/, '');
                        return (
                          <li key={suggestion} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                            <span>
                              <strong className="text-primary">{suggestion}</strong> {restOfBullet}
                            </span>
                            <Button size="icon" variant="ghost" onClick={() => copySuggestion(suggestion)} title="Copy Suggestion">
                              <ClipboardCopy className="w-4 h-4" />
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
