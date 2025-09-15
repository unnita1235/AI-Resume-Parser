"use client";

import { parseResume, ResumeSection } from "@/lib/resume-parser";
import { Briefcase, GraduationCap, Star, User } from "lucide-react";
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
    <div className="p-4 md:p-8 bg-white text-foreground font-body">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold font-headline">{name}</h1>
          <p className="text-muted-foreground mt-1">{contact.join(" | ")}</p>
        </header>

        {sections.map((section, index) => (
          <section key={index}>
            <Card className="border-none shadow-none">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-2xl font-semibold flex items-center border-b-2 border-primary pb-2">
                  {getSectionIcon(section.title)}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-base">
                {section.entries.map((entry, entryIndex) => (
                  <div key={entryIndex} className={entryIndex > 0 ? "mt-4" : ""}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-lg">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                    {entry.subtitle && <p className="text-sm italic text-muted-foreground">{entry.subtitle}</p>}
                    <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                      {entry.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        ))}
      </div>
    </div>
  );
}
