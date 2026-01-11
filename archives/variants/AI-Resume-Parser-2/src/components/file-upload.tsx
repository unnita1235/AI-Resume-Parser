"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

interface FileUploadProps {
  onFileProcessed: (text: string) => void;
  disabled?: boolean;
  isDemoMode?: boolean;
}

export function FileUpload({ onFileProcessed, disabled = false, isDemoMode = false }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isProcessing = uploadStatus === "uploading" || uploadStatus === "processing";

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Reset error state
    setErrorMessage(null);

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadStatus("error");
      setErrorMessage("Invalid file type. Please upload a PDF, DOCX, or TXT file.");
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("error");
      setErrorMessage("File too large. Maximum size is 5MB.");
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 40) {
          clearInterval(progressInterval);
          return 40;
        }
        return prev + 10;
      });
    }, 100);

    try {
      setUploadProgress(50);
      setUploadStatus("processing");

      const text = await extractTextFromFile(file);

      setUploadProgress(100);
      setUploadStatus("success");

      onFileProcessed(text);
      toast({
        title: "File processed successfully",
        description: `Extracted ${text.split(/\s+/).length} words from ${file.name}`
      });

      // Reset status after showing success
      setTimeout(() => {
        setUploadStatus("idle");
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus("error");
      setUploadProgress(0);
      const message = error instanceof Error ? error.message : "Failed to extract text from the file.";
      setErrorMessage(message);
      toast({
        title: "Error processing file",
        description: message + " Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetry = () => {
    if (uploadedFile) {
      handleFileSelect(uploadedFile);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/extract-text', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract text');
    }

    const result = await response.json();
    return result.text;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Uploading file...";
      case "processing":
        return "Extracting text...";
      case "success":
        return "File processed successfully!";
      case "error":
        return errorMessage || "An error occurred";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Demo Mode Warning */}
        {isDemoMode && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Demo Mode:</strong> File upload is disabled. Paste your resume text instead.
            </p>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : uploadStatus === "error"
              ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              : uploadStatus === "success"
              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled || isDemoMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isDemoMode && !isProcessing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isDemoMode}
          />

          {isProcessing ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">{getStatusMessage()}</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : uploadStatus === "success" ? (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <p className="text-green-600 dark:text-green-400 font-medium">{getStatusMessage()}</p>
                {uploadedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>
          ) : uploadStatus === "error" ? (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <p className="text-red-600 dark:text-red-400 font-medium">Upload Failed</p>
                <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">
                  {isDemoMode ? "File Upload Disabled" : "Upload Resume"}
                </p>
                <p className="text-muted-foreground">
                  {isDemoMode
                    ? "Connect to backend to enable file upload"
                    : "Drag and drop your resume here, or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports PDF, DOCX, and TXT files (max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
