"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { runAdjustTone, runEnhanceActionVerbs, runOptimizeForAts } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2, Lightbulb, ClipboardCopy, Upload } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { FileUpload } from "./file-upload";
import type { OptimizeForAtsOutput } from "@/ai/flows/optimize-for-ats";

interface ResumeEditorProps {
  resumeText: string;
  setResumeText: Dispatch<SetStateAction<string>>;
}

export function ResumeEditor({ resumeText, setResumeText }: ResumeEditorProps) {
  const { toast } = useToast();
  
  // ATS State
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState<OptimizeForAtsOutput | null>(null);
  const [isAtsLoading, setIsAtsLoading] = useState(false);

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
    try {
      const result = await runOptimizeForAts({ resumeText, jobDescription });
      setAtsResult(result);
    } catch (error) {
      toast({ title: (error as Error).message, variant: "destructive" });
    } finally {
      setIsAtsLoading(false);
    }
  };
  
  const handleAdjustTone = async () => {
    if (!resumeText) {
      toast({ title: "Please enter your resume content.", variant: "destructive" });
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
    setIsVerbLoading(true);
    setVerbSuggestions([]);
    try {
      const { suggestions } = await runEnhanceActionVerbs({ bulletPoint });
      setVerbSuggestions(suggestions);
    } catch (error) {
      toast({ title: (error as Error).message, variant: "destructive" });
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
          </CardTitle>
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
                      {verbSuggestions.map((suggestion) => (
                        <li key={suggestion} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                           <span>{bulletPoint.replace(/^\s*[\w-]+/, `<strong>${suggestion}</strong>`)}</span>
                          <Button size="icon" variant="ghost" onClick={() => copySuggestion(suggestion)} title="Copy Suggestion">
                            <ClipboardCopy className="w-4 h-4" />
                          </Button>
                        </li>
                      ))}
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
