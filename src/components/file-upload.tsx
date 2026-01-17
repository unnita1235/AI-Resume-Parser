"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
// Import the Server Action
import { processResume } from "@/app/actions/process-resume";

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

interface FileUploadProps {
  onFileProcessed: (data: any) => void; // Changed to accept full data object
  disabled?: boolean;
}

export function FileUpload({ onFileProcessed, disabled = false }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setErrorMessage(null);

    // Size Limit: 4MB (Vercel Serverless Function Limit is ~4.5MB)
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 4MB", variant: "destructive" });
      return;
    }

    setUploadedFile(file);
    setUploadStatus("uploading");
    
    // Fake progress for UX
    const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Call Server Action
      const result = await processResume(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!result.success) {
        throw new Error(result.error);
      }

      setUploadStatus("success");
      onFileProcessed(result.data.structuredData); // Pass structured data up
      
      toast({ title: "Success!", description: "Resume analyzed by AI." });

    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setErrorMessage(error.message);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // ... (Keep the rest of your UI code for drag/drop, just remove the old fetch logic)
  
  // Minimal render return for clarity (Keep your existing JSX styling)
  return (
      <Card className="w-full">
        <CardContent className="p-6">
             <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed p-8 text-center rounded-lg hover:bg-slate-50 transition">
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
                
                {uploadStatus === 'processing' || uploadStatus === 'uploading' ? (
                     <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-2" />
                        <p>Analyzing with AI...</p>
                        <Progress value={uploadProgress} className="w-[60%] mt-2" />
                     </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-10 w-10 text-gray-400" />
                        <p className="font-semibold">Click to Upload Resume</p>
                        <p className="text-xs text-gray-500">PDF, DOCX up to 4MB</p>
                    </div>
                )}
                
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
             </div>
        </CardContent>
      </Card>
  );
}
