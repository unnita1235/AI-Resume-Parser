"use client";

import { Download, FileText, Copy, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  resumeText?: string;
  onReset?: () => void;
}

export function Header({ resumeText, onReset }: HeaderProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    window.print();
  };

  const handleCopyResume = () => {
    if (resumeText) {
      navigator.clipboard.writeText(resumeText);
      toast({
        title: "Resume copied!",
        description: "Your resume has been copied to clipboard."
      });
    } else {
      toast({
        title: "No resume to copy",
        description: "Please add resume content first.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      toast({
        title: "Resume reset",
        description: "Your resume has been reset to default."
      });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm no-print">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold md:text-2xl text-foreground">
            AI Resume Parser & Rewriter
          </h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Optimize your resume with AI-powered enhancements
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onReset && (
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
        
        <Button onClick={handleCopyResume} variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
        
        <Button onClick={handleDownload} variant="default" size="sm">
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </header>
  );
}
