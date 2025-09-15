"use client";

import { Download, FileText } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm no-print">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold md:text-2xl text-foreground">
          Resume Rewriter
        </h1>
      </div>
      <Button onClick={handleDownload} variant="default">
        <Download className="mr-2 h-4 w-4" />
        <span>Download</span>
      </Button>
    </header>
  );
}
