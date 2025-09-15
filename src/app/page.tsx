"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ResumeEditor } from "@/components/resume-editor";
import { ResumePreview } from "@/components/resume-preview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DEFAULT_RESUME } from "@/lib/constants";

export default function Home() {
  const [resumeText, setResumeText] = useState<string>(DEFAULT_RESUME);

  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <Header />
      <main className="flex-grow">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30} className="h-full overflow-y-auto no-print">
            <ResumeEditor resumeText={resumeText} setResumeText={setResumeText} />
          </ResizablePanel>
          <ResizableHandle withHandle className="no-print" />
          <ResizablePanel defaultSize={50} minSize={30} className="h-full overflow-y-auto">
            <div className="printable-area bg-white md:bg-transparent">
              <ResumePreview resumeText={resumeText} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
