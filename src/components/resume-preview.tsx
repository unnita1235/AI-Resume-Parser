"use client";

import { parseResume } from "@/lib/resume-parser";
import { Briefcase, GraduationCap, Star, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface ResumePreviewProps {
  resumeText: string;
}

const getSectionIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("experience")) return <Briefcase className="mr-2 h-5 w-5 text-primary" />;
  if (lowerTitle.includes("education")) return <GraduationCap className="mr-2 h-5 w-5 text-primary" />;
  if (lowerTitle.includes("skills")) return <Star className="mr-2 h-5 w-5 text-primary" />;
  return <User className="mr-2 h-5 w-5 text-primary" />;
};

export function ResumePreview({ resumeText }: ResumePreviewProps) {
  const { name, contact, sections } = parseResume(resumeText);

  return (
    <div className="p-4 md:p-8 bg-white text-foreground font-body min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center border-b-2 border-primary pb-6">
          <h1 className="text-4xl font-bold font-headline text-primary mb-2">{name}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
            {contact.map((item, index) => (
              <span key={index} className="text-sm">
                {item}
              </span>
            ))}
          </div>
        </header>

        {sections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No resume content to display</p>
              <p className="text-sm">Upload a file or paste your resume text to see the preview</p>
            </div>
          </div>
        ) : (
          sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <Card className="border-none shadow-sm bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-semibold flex items-center text-primary border-b border-primary/20 pb-2">
                    {getSectionIcon(section.title)}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.entries.map((entry, entryIndex) => (
                    <div key={entryIndex} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-foreground">{entry.title}</h3>
                          {entry.subtitle && (
                            <p className="text-sm italic text-muted-foreground mt-1">{entry.subtitle}</p>
                          )}
                        </div>
                        {entry.date && (
                          <p className="text-sm text-muted-foreground font-medium bg-primary/10 px-2 py-1 rounded">
                            {entry.date}
                          </p>
                        )}
                      </div>
                      {entry.details.length > 0 && (
                        <ul className="space-y-2 ml-4">
                          {entry.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-muted-foreground text-sm leading-relaxed flex items-start">
                              <span className="text-primary mr-2 mt-1">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
